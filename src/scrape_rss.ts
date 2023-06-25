import PocketBase from "pb";
import { parse } from "https://deno.land/x/xml@2.0.4/mod.ts";
import { getAuthor, getCoverArt, getType, inputTypeEnum } from "./scrape.ts";
import { Status } from "$fresh/server.ts";

interface FeedItem {
  title: string;
  link: string;
  comments: string;
  category: string | string[];
  pubDate: string;
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
  pb: PocketBase;
}

export async function scrapeRSS(
  { feedUrl, pb }: ScrapeRSSProps,
): Promise<Status.Created | Status.InternalServerError> {
  try {
    const feed = await fetch(feedUrl).then((res) => res.text());
    const items = getItems(feed);

    for (const item of items) {
      await resolveItem(pb, item);
    }
    return Status.Created;
  } catch (error) {
    console.error(error);
    return Status.InternalServerError;
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

async function parseItem(item: FeedItem) {
  const parsedItem = new FormData();
  //parsedEntryMap.set("filmpolitietId", "TODO");
  parsedItem.set("url", item.link);
  parsedItem.set("name", item.title);
  parsedItem.set("reviewDate", new Date(item.pubDate).toISOString());
  const coverArtBlob = await getCoverArt(item.link);
  if (coverArtBlob) {
    parsedItem.set(
      "coverArt",
      coverArtBlob,
      `${parsedItem.get("name")}.jpg`,
    );
  }
  return parsedItem;
}

async function resolveItem(pb: PocketBase, item: FeedItem) {
  const { rating, type: typeString } = getRatingAndType(item);
  const type = await getType(pb, typeString);
  try {
    await pb.collection("entry").getFirstListItem(`url="${item.link}"`);
  } catch (_error) {
    console.log(`Item: ${item.title} doesn't exist -> Adding...`);
    const parsedItem = await parseItem(item);
    parsedItem.set("rating", rating.toString());
    parsedItem.set("type", type.id);
    const isOverwriting = true;
    const author = await getAuthor(pb, item.link, isOverwriting);
    if (author) {
      parsedItem.set("author", author.id);
    }
    try {
      await pb.collection("entry").create(parsedItem);
    } catch (error) {
      console.error(`Couldn't create ${item.title}`);
      console.error(error);
    }
  }
}

export const forTestingOnly = {
  getItems,
  getRatingFromString,
  getTypeFromString,
  getRatingAndType,
};
