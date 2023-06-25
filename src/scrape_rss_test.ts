import { assertEquals, assertThrows } from "$std/testing/asserts.ts";
import { forTestingOnly } from "./scrape_rss.ts";

const testFeedPath = new URL("./testdata/sample-feed.xml", import.meta.url);
const file = await Deno.readTextFile(testFeedPath);

Deno.test("Number of items", () => {
  const items = forTestingOnly.getItems(file);

  assertEquals(items.length, 5);
});

Deno.test("Title of some items", () => {
  const items = forTestingOnly.getItems(file);
  const item1Title = items[1].title;
  const item2Title = items[2].title;

  assertEquals(item1Title, "Piggy");
  assertEquals(item2Title, "No Hard Feelings");
});

Deno.test("Get rating from string", () => {
  const rating = forTestingOnly.getRatingFromString("Terningkast 5");

  assertEquals(rating, 5);
});

Deno.test("Get type from string: Filmanmeldelse", () => {
  const type = forTestingOnly.getTypeFromString("Filmanmeldelser");

  assertEquals(type, "movie");
});

Deno.test("Get type from string: TV-serieanmeldelse", () => {
  const type = forTestingOnly.getTypeFromString("TV-serieanmeldelser");

  assertEquals(type, "show");
});

Deno.test("Get type from string: Spillanmeldelse", () => {
  const type = forTestingOnly.getTypeFromString("Spillanmeldelser");

  assertEquals(type, "game");
});

Deno.test("Get type from string: Throw error if wrong", () => {
  assertThrows(() => forTestingOnly.getTypeFromString("Spillanmeldelse"));
});

Deno.test("Get rating and type", () => {
  const items = forTestingOnly.getTitles(file);
  const item = items[1];
  const { rating, type } = forTestingOnly.getRatingAndType(item);

  assertEquals(item.title, "Piggy");
  assertEquals(rating, 5);
  assertEquals(type, "movie");
});
