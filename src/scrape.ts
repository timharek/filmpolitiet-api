import "https://deno.land/std@0.191.0/dotenv/load.ts";
import PocketBase from "pb";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

interface ScrapeProps {
  pb: PocketBase;
  url: URL | string;
  isRecursive?: boolean;
}

export async function scrape(
  { pb, url, isRecursive }: ScrapeProps,
) {
  console.log("isRecursive", isRecursive);
  console.log("url", url);
  const rating = getRatingFromUrl(url);
  const inputType = getTypeFromUrl(url);

  console.log("rating", rating);
  console.log("type", inputType);

  const site = await fetch(
    url,
  ).then((res) => res.text());
  const doc = new DOMParser().parseFromString(site, "text/html");

  if (doc) {
    const entries = doc.getElementsByTagName("article");

    for (const entry of entries) {
      const type = await pb.collection("type").getFirstListItem<App.Type>(
        `name="${inputType}"`,
      );
      const entryUrl = entry.querySelector("header h2 a")?.attributes
        .getNamedItem("href")
        ?.value as string;
      const author = await getAuthor(pb, entryUrl);
      const formData = new FormData();
      formData.set(
        "filmpolitietId",
        entry.attributes.getNamedItem("id")?.value as string,
      );
      formData.set(
        "name",
        entry.querySelector("header h2 a")?.textContent as string,
      );
      const coverArtBlob = await getCoverArt(entryUrl);
      if (coverArtBlob) {
        formData.set("coverArt", coverArtBlob, `${formData.get("name")}.jpg`);
      }
      formData.set("url", entryUrl);
      formData.set("rating", String(rating));
      formData.set(
        "reviewDate",
        entry.querySelector("header time")?.attributes.getNamedItem("datetime")
          ?.value as string,
      );
      formData.set("type", type.id);
      if (author) {
        formData.set("author", author.id);
      }
      try {
        await pb.collection("entry").create(formData);
      } catch (_error) {
        try {
          console.error("could not create");
          const existingEntry = await pb.collection("entry").getFirstListItem<
            App.Entry
          >(`name="${formData.get("name")}"`);

          await pb.collection("entry").update(existingEntry.id, formData);
        } catch (_error) {
          console.error("could not update");
        }
      }
    }
    const nextPage = doc.querySelector(".post-previous a")?.attributes
      .getNamedItem("href")?.value;
    if (isRecursive && nextPage) {
      console.log("is recursive and has next page");
      await scrape({ pb, url: nextPage, rating, inputType, isRecursive: true });
    }
  }
}

async function getAuthor(
  pb: PocketBase,
  entryUrl: URL | string,
): Promise<App.Author | undefined> {
  const site = await fetch(
    entryUrl,
  ).then((res) => res.text());
  const entryPage = new DOMParser().parseFromString(site, "text/html");

  if (entryPage) {
    const authorWrapper = entryPage.querySelector(".author-wrap");
    const authorNameWrapper = authorWrapper?.querySelector(".b_skribent a");

    const formData = new FormData();
    formData.set("name", authorNameWrapper?.textContent as string);
    formData.set(
      "email",
      authorWrapper?.querySelector(".b_epost")?.textContent as string,
    );
    formData.set(
      "url",
      authorNameWrapper?.attributes.getNamedItem("href")?.value as string,
    );

    try {
      await pb.collection("filmpolitiet_author").create(formData);
    } catch (_error) {
      console.error("could not create new author, trying to update");
      try {
        const existingAuthor = await pb.collection("filmpolitiet_author")
          .getFirstListItem<App.Author>(`name="${formData.get("name")}"`);
        await pb.collection("filmpolitiet_author").update(
          existingAuthor.id,
          formData,
        );
      } catch (_error) {
        console.error("could not create or update author");
      }
    }

    return await pb.collection("filmpolitiet_author").getFirstListItem<
      App.Author
    >(`name="${formData.get("name")}"`);
  }
}

async function getCoverArt(
  entryUrl: URL | string,
): Promise<Blob | undefined> {
  const site = await fetch(
    entryUrl,
  ).then((res) => res.text());
  const entryPage = new DOMParser().parseFromString(site, "text/html");

  if (entryPage) {
    const coverArtUrlString = entryPage.querySelector(".coverart")?.attributes
      .getNamedItem("src")?.value as string;
    if (!coverArtUrlString) {
      return undefined;
    }
    try {
      const coverArtUrl = coverArtUrlString.split("?src=")[1];
      console.log(coverArtUrl);
      const coverArtResponse = await fetch(coverArtUrl.split("&")[0]);
      const coverArtBinary = await coverArtResponse.blob();

      return coverArtBinary;
    } catch (_error) {
      console.error("could not get cover-art");
      return undefined;
    }
  }
}

function getRatingFromUrl(url: URL | string) {
  const ratingRegex = /terningkast-(\d+)/;
  const ratingMatch = url.toString().match(ratingRegex);
  const rating = ratingMatch ? ratingMatch[1] : null;
  return rating as string;
}

function getTypeFromUrl(url: URL | string) {
  interface InputType {
    [key: string]: string;
  }
  const inputTypeEnum: InputType = {
    "tv-serieanmeldelser": "show",
    "spillanmeldelser": "game",
    "filmanmeldelser": "movie",
  };
  const typeRegex = /(tv-serieanmeldelser|spillanmeldelser|filmanmeldelser)/;
  const typeMatch = url.toString().match(typeRegex);
  const inputTypeMatch = typeMatch ? typeMatch[1] : null;
  const inputType = inputTypeEnum[inputTypeMatch as string];
  return inputType;
}
