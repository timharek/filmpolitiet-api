import { parse } from "https://deno.land/x/xml@2.0.4/mod.ts";
import { getAuthor, getCoverArtUrl, inputTypeEnum } from "./scrape.ts";
import { Review, ReviewCreateInput } from "./db/models/review.ts";
import { z } from "zod";

const feedItemSchema = z.object({
  title: z.string(),
  link: z.string(),
  category: z.union([z.string(), z.array(z.string())]),
  pubDate: z.string(),
  "post-id": z.object({
    "#text": z.number(),
  }),
});

const feedSchema = z.object({
  rss: z.object({
    channel: z.object({
      title: z.string(),
      item: z.array(feedItemSchema),
    }),
  }),
});

type FeedItem = z.infer<typeof feedItemSchema>;

type ScrapeRSSProps = {
  feedUrl: URL | string;
};

export async function scrapeRSS({ feedUrl }: ScrapeRSSProps): Promise<number> {
  const feed = await fetch(feedUrl).then((res) => res.text()).catch(
    (error) => {
      throw new Error(error, { cause: "fetch" });
    },
  );
  const items = getItems(feed);

  let sucessesfulItems = 0;
  for (const item of items) {
    await resolveItem(item);
    sucessesfulItems++;
  }
  return sucessesfulItems;
}

function getItems(feed: string) {
  const parsedFeed = feedSchema.parse(parse(feed));
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
    throw new Error("Missing category for rating and/or type.", {
      cause: "bad_data",
    });
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
    throw new Error("Type string was invalid!", { cause: "bad_data" });
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
): Promise<ReviewCreateInput> {
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
  const type = Review.getType(typeString);
  if (!type) throw new Error("Missing type", { cause: "bad_data" });
  const author = await getAuthor(item.link, true);
  if (!author) throw new Error("Missing author", { cause: "bad_data" });
  const parsedItem = await parseItem({
    item,
    rating,
    typeId: type.id,
    authorId: author.id,
  });
  Review.create(parsedItem);
}

export const forTestingOnly = {
  getItems,
  getRatingFromString,
  getTypeFromString,
  getRatingAndType,
};
