import "$std/dotenv/load.ts";
import {
  DOMParser,
  Element,
  HTMLDocument,
} from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { STATUS_CODE } from "$fresh/server.ts";
import { Author, AuthorCreateInput } from "./db/models/author.ts";
import { EntryCreateInput } from "./db/models/entry.ts";
import { Entry } from "./db/models/entry.ts";
import { ENTRY_TYPE } from "./db.ts";

type ScrapeProps = {
  url: URL | string;
  isRecursive?: boolean;
  isOverwriting?: boolean;
};

export async function scrape(
  { url, isRecursive, isOverwriting = true }: ScrapeProps,
): Promise<number> {
  const rating = getRatingFromUrl(url);
  const type = getTypeFromUrl(url);

  const pageDocument = await getPageDoc(url);
  if (!pageDocument) {
    return STATUS_CODE.NotFound;
  }
  const entries = getEntries(pageDocument);

  if (entries.length === 0) {
    return STATUS_CODE.NoContent;
  }

  const parsedEntries = [];

  for (const entry of entries) {
    const url = getEntryUrl(entry);
    const author = await getAuthor(url, isOverwriting);
    if (!author) {
      console.error("Missing author.");
      continue;
    }
    const parsedEntry = await parseEntry({
      entry,
      rating,
      typeId: ENTRY_TYPE[type],
      authorId: author.id,
    });

    parsedEntries.push(parsedEntry);
  }

  for await (const entry of parsedEntries) {
    if (isOverwriting) {
      // TODO: Add upcate method. https://todo.sr.ht/~timharek/filmpolitiet-api/5
      console.log("overwriting");
      Entry.upsert(entry);
      continue;
    }
    Entry.create(entry);
  }

  const nextPage = pageDocument.querySelector(".post-previous a")?.attributes
    .getNamedItem("href")?.value;
  if (isRecursive && nextPage) {
    console.debug("is recursive and has next page");
    await scrape({ url: nextPage, isRecursive: true });
  }

  return STATUS_CODE.Created;
}

async function getPageDoc(
  url: string | URL,
): Promise<HTMLDocument | null> {
  const page = await fetch(url).then((res) => res.text()).catch((_error) =>
    null
  );
  if (!page) {
    console.error("url failed:", url);
    return null;
  }
  await sleep(1000);
  return new DOMParser().parseFromString(page, "text/html");
}

function getEntries(pageDocument: HTMLDocument): Element[] {
  return pageDocument.getElementsByTagName("article");
}

async function parseEntry(
  { entry, authorId, rating, typeId }: {
    entry: Element;
    authorId: number;
    rating: number;
    typeId: number;
  },
): Promise<EntryCreateInput> {
  const title = entry.querySelector("header h2 a")!.textContent;
  console.debug("title", title);
  const coverArtUrl = await getCoverArt(entry) ?? "";
  return {
    title,
    url: getEntryUrl(entry),
    reviewDate: await getReviewDate(entry),
    authorId,
    rating,
    typeId,
    coverArtUrl,
  };
}

async function getCoverArt(entry: Element): Promise<string | null> {
  const url = getEntryUrl(entry);

  const entryPageDom = await getPageDoc(url);

  if (!entryPageDom) {
    return null;
  }
  return entryPageDom.querySelector(".coverart")?.attributes.getNamedItem(
    "src",
  )?.value ?? null;
}

async function getReviewDate(entry: Element): Promise<string> {
  const url = getEntryUrl(entry);

  const entryPageDom = await getPageDoc(url);

  if (!entryPageDom) {
    throw new Error("Entry doesn't exit.");
  }

  return entryPageDom.querySelector(".post time")?.attributes.getNamedItem(
    "datetime",
  )?.value ?? "1970-01-01";
}

function getEntryUrl(entry: Element): string {
  return entry.querySelector("header h2 a")!.attributes
    .getNamedItem("href")!.value;
}

export async function getAuthor(
  entryUrl: URL | string,
  isOverwriting = true,
): Promise<Author | null> {
  const entryPage = await getPageDoc(entryUrl);

  if (!entryPage) {
    return null;
  }
  const authorWrapper = entryPage.querySelector(".author-wrap");
  const authorNameWrapper = authorWrapper?.querySelector(".b_skribent a");

  const authorInput: AuthorCreateInput = {
    fullName: authorNameWrapper?.textContent ?? "Missing",
    email: authorWrapper?.querySelector(".b_epost")?.textContent ??
      "missing@missing.org",
    url: authorNameWrapper?.attributes.getNamedItem("href")?.value ??
      "https://missing.org",
  };

  const author = Author.create(authorInput);
  if (!author) {
    throw new Error("Failed to create new author");
  }
  if (isOverwriting) {
    // TODO: Update author. https://todo.sr.ht/~timharek/filmpolitiet-api/6
  }

  return author;
}

export async function getCoverArtUrl(url: string): Promise<string | null> {
  const entryPage = await getPageDoc(url);
  if (!entryPage) {
    return null;
  }
  return entryPage.querySelector(".coverart")?.attributes
    .getNamedItem("src")?.value as string;
}

function getRatingFromUrl(url: URL | string): number {
  const ratingRegex = /terningkast-(\d+)/;
  const ratingMatch = url.toString().match(ratingRegex);
  const rating = ratingMatch ? ratingMatch[1] : null;
  return Number(rating);
}

export const inputTypeEnum: Record<string, string> = {
  "tv-serieanmeldelser": "show",
  "spillanmeldelser": "game",
  "\-filmanmeldelser": "movie",
  "filmanmeldelser": "movie",
};

type EntryType = "show" | "movie" | "game";
function getTypeFromUrl(url: URL | string): EntryType {
  const typeRegex = /(tv-serieanmeldelser|spillanmeldelser|\-filmanmeldelser)/;
  const typeMatch = url.toString().match(typeRegex);
  const inputTypeMatch = typeMatch ? typeMatch[1] : null;
  const inputType = inputTypeEnum[inputTypeMatch as string];
  return inputType as EntryType;
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
