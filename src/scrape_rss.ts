import { parse } from "https://deno.land/x/xml@2.0.4/mod.ts";
import { getAuthor, getCoverArtUrl, inputTypeEnum } from "./scrape.ts";
import { STATUS_CODE } from "$fresh/server.ts";
import { Entry } from "./db/models/entry.ts";
import { EntryCreateInput } from "./db/models/entry.ts";

interface FeedItem {
  title: string;
  link: string;
  comments: string;
  category: string | string[];
  pubDate: string;
  "post-id": {
    "#text": number;
  };
}
interface Feed {
  xml: string;
  rss: {
    channel: {
      title: string;
      item: FeedItem[];
    };
  };
}

interface ScrapeRSSProps {
  feedUrl: URL | string;
}

export async function scrapeRSS({ feedUrl }: ScrapeRSSProps): Promise<number> {
  try {
    const feed = await fetch(feedUrl).then((res) => res.text());
    const items = getItems(feed);

    for (const item of items) {
      await resolveItem(item);
    }
    return STATUS_CODE.Created;
  } catch (error) {
    console.error(error);
    return STATUS_CODE.InternalServerError;
  }
}

function getItems(feed: string) {
  const parsedFeed = parse(feed) as unknown as Feed;
  const items = parsedFeed.rss.channel.item.filter((item) => {
    if (Array.isArray(item.category) && !item.category.includes("Toppsak")) {
      return item;
    }

    if (!Array.isArray(item.category) && item.category !== "Toppsak") {
      return item;
    }
  });

  return items;
}

function getRatingAndType(
  item: FeedItem,
): { rating: number; type: "show" | "movie" | "game" } {
  const ratingCategory = (item.category as string[]).find((category) =>
    category.includes("Terningkast")
  );
  const typeCategory = (item.category as string[]).find((category) =>
    category.match("Filmanmeldelser|TV-serieanmeldelser|Spillanmeldelser")
  );
  if (!ratingCategory || !typeCategory) {
    throw new Error("Missing category for rating and/or type.");
  }

  const rating = getRatingFromString(ratingCategory);
  const type = getTypeFromString(typeCategory);

  return { rating, type };
}

function getRatingFromString(string: string) {
  const ratingRegex = /Terningkast (\d+)/;
  const ratingMatch = string.match(ratingRegex);
  const rating = ratingMatch ? ratingMatch[1] : null;
  return Number(rating);
}

function getTypeFromString(string: string): "show" | "movie" | "game" {
  const typeRegex = /(tv-serieanmeldelser|spillanmeldelser|filmanmeldelser)/;
  const typeMatch = string.toLocaleLowerCase().match(typeRegex);
  const inputTypeMatch = typeMatch ? typeMatch[1] : null;
  if (!inputTypeMatch) {
    throw new Error("Type string was invalid!");
  }
  const inputType = inputTypeEnum[inputTypeMatch];
  return inputType as "show" | "movie" | "game";
}

async function parseItem(
  { item, authorId, rating, typeId }: {
    item: FeedItem;
    authorId: number;
    rating: number;
    typeId: number;
  },
): Promise<EntryCreateInput> {
  const url = item.link;
  const coverArtUrl = await getCoverArtUrl(url);

  return {
    title: item.title,
    url,
    reviewDate: new Date(item.pubDate).toISOString(),
    coverArtUrl: coverArtUrl ?? "",
    authorId,
    rating,
    typeId,
  };
}

async function resolveItem(item: FeedItem) {
  const { rating, type: typeString } = getRatingAndType(item);
  const type = Entry.getType(typeString);
  if (!type) throw new Error("Missing type");
  const author = await getAuthor(item.link, true);
  if (!author) throw new Error("Missing author");
  const parsedItem = await parseItem({
    item,
    rating,
    typeId: type.id,
    authorId: author.id,
  });
  Entry.create(parsedItem);
}

export const forTestingOnly = {
  getItems,
  getRatingFromString,
  getTypeFromString,
  getRatingAndType,
};
