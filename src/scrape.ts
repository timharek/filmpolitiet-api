import "https://deno.land/std@0.191.0/dotenv/load.ts";
import PocketBase from "pb";
import {
  DOMParser,
  Element,
  HTMLDocument,
} from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { Status } from "$fresh/server.ts";

interface ScrapeProps {
  pb: PocketBase;
  url: URL | string;
  isRecursive?: boolean;
  isOverwriting?: boolean;
}

export async function scrape(
  { pb, url, isRecursive, isOverwriting = true }: ScrapeProps,
): Promise<Status.Created | Status.NoContent | Status.NotFound> {
  const rating = getRatingFromUrl(url);
  const inputType = getTypeFromUrl(url);
  const type = await getType(pb, inputType);

  const pageDocument = await getPageDoc(url);
  if (!pageDocument) {
    return Status.NotFound;
  }
  const entries = getEntries(pageDocument);

  if (entries.length === 0) {
    return Status.NoContent;
  }

  const parsedEntries = [];

  for (const entry of entries) {
    const parsedEntry = parseEntry(entry);
    const url = parsedEntry.get("url") as string;
    const coverArtBlob = await getCoverArt(url);
    if (coverArtBlob) {
      parsedEntry.set(
        "coverArt",
        coverArtBlob,
        `${parsedEntry.get("name")}.jpg`,
      );
    }
    parsedEntry.set("type", type.id);
    parsedEntry.set("rating", String(rating));
    const author = await getAuthor(pb, url, isOverwriting);
    if (author) {
      parsedEntry.set("author", author.id);
    }

    parsedEntries.push(parsedEntry);
  }

  for await (const entry of parsedEntries) {
    try {
      await pb.collection("entry").create(entry);
    } catch (_error) {
      if (isOverwriting) {
        try {
          console.error("could not create");
          const existingEntry = await pb.collection("entry").getFirstListItem<
            App.Entry
          >(`name="${entry.get("name")}"`);

          await pb.collection("entry").update(existingEntry.id, entry);
        } catch (_error) {
          console.error("could not update");
        }
      }
    }
  }

  const nextPage = pageDocument.querySelector(".post-previous a")?.attributes
    .getNamedItem("href")?.value;
  if (isRecursive && nextPage) {
    console.debug("is recursive and has next page");
    await scrape({ pb, url: nextPage, isRecursive: true });
  }

  return Status.Created;
}

async function getPageDoc(url: string | URL): Promise<HTMLDocument | null> {
  const page = await fetch(url).then((res) => res.text());
  await sleep(1000);
  return new DOMParser().parseFromString(page, "text/html");
}

function getEntries(pageDocument: HTMLDocument): Element[] {
  return pageDocument.getElementsByTagName("article");
}

function parseEntry(entry: Element) {
  const parsedEntryMap = new FormData();
  parsedEntryMap.set(
    "filmpolitietId",
    entry.attributes.getNamedItem("id")?.value as string,
  );
  parsedEntryMap.set(
    "url",
    entry.querySelector("header h2 a")?.attributes
      .getNamedItem("href")
      ?.value as string,
  );
  parsedEntryMap.set(
    "name",
    entry.querySelector("header h2 a")?.textContent as string,
  );
  parsedEntryMap.set(
    "reviewDate",
    entry.querySelector("header time")?.attributes.getNamedItem("datetime")
      ?.value as string,
  );
  return parsedEntryMap;
}

export async function getType(pb: PocketBase, type: string) {
  return await pb.collection("type").getFirstListItem<App.Type>(
    `name="${type}"`,
  );
}

export async function getAuthor(
  pb: PocketBase,
  entryUrl: URL | string,
  isOverwriting = true,
): Promise<App.Author | undefined> {
  const entryPage = await getPageDoc(entryUrl);

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
      if (isOverwriting) {
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
    }

    const author = await pb.collection("filmpolitiet_author").getFirstListItem<
      App.Author
    >(`name="${formData.get("name")}"`);
    return author ? author : undefined;
  }
}

export async function getCoverArt(
  entryUrl: URL | string,
): Promise<Blob | undefined> {
  const entryPage = await getPageDoc(entryUrl);

  if (entryPage) {
    const coverArtUrlString = entryPage.querySelector(".coverart")?.attributes
      .getNamedItem("src")?.value as string;
    if (!coverArtUrlString) {
      return undefined;
    }
    try {
      const coverArtUrl = coverArtUrlString.split("?src=")[1];
      console.debug(coverArtUrl);
      const coverArtResponse = await fetch(coverArtUrl.split("&")[0]);
      await sleep(1000);
      const coverArtBinary = await coverArtResponse.blob();

      return coverArtBinary;
    } catch (_error) {
      console.error("could not get cover-art");
      return undefined;
    }
  }
}

function getRatingFromUrl(url: URL | string): number {
  const ratingRegex = /terningkast-(\d+)/;
  const ratingMatch = url.toString().match(ratingRegex);
  const rating = ratingMatch ? ratingMatch[1] : null;
  return Number(rating);
}

interface InputType {
  [key: string]: string;
}
export const inputTypeEnum: InputType = {
  "tv-serieanmeldelser": "show",
  "spillanmeldelser": "game",
  "filmanmeldelser": "movie",
};

function getTypeFromUrl(url: URL | string): "show" | "movie" | "game" {
  const typeRegex = /(tv-serieanmeldelser|spillanmeldelser|filmanmeldelser)/;
  const typeMatch = url.toString().match(typeRegex);
  const inputTypeMatch = typeMatch ? typeMatch[1] : null;
  const inputType = inputTypeEnum[inputTypeMatch as string];
  return inputType as "show" | "movie" | "game";
}

function sleep(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export const forTestingOnly = {
  getPageDoc,
  getEntries,
  parseEntry,
  getRatingFromUrl,
  getTypeFromUrl,
};
