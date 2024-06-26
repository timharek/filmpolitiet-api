import { assertEquals } from "@std/assert";
import { HTMLDocument } from "deno_dom";
import { forTestingOnly } from "./scrape.ts";

const indexPage = new URL("./testdata/index-page.html", import.meta.url);

const pageDocument = await forTestingOnly.getPageDoc(indexPage) as HTMLDocument;

Deno.test("Get entries", () => {
  const entries = forTestingOnly.getEntries(pageDocument);

  assertEquals(entries?.length, 50);
});

Deno.test("Get type from URL: 'show'", () => {
  const url =
    "https://p3.no/filmpolitiet/category/tv-serieanmeldelser/terningkast-3-tv-serieanmeldelser/";
  const type = forTestingOnly.getTypeFromUrl(url);

  assertEquals(type, "show");
});

Deno.test("Get rating from URL: '3'", () => {
  const url =
    "https://p3.no/filmpolitiet/category/tv-serieanmeldelser/terningkast-3-tv-serieanmeldelser/";
  const rating = forTestingOnly.getRatingFromUrl(url);

  assertEquals(rating, 3);
});

Deno.test("Get type from URL: 'movie'", () => {
  const url =
    "https://p3.no/filmpolitiet/category/filmanmeldelser/terningkast-6-filmanmeldelser/";
  const type = forTestingOnly.getTypeFromUrl(url);

  assertEquals(type, "movie");
});

Deno.test("Get rating from URL: '6'", () => {
  const url =
    "https://p3.no/filmpolitiet/category/filmanmeldelser/terningkast-6-filmanmeldelser/";
  const rating = forTestingOnly.getRatingFromUrl(url);

  assertEquals(rating, 6);
});

Deno.test("Get type from URL: 'game'", () => {
  const url =
    "https://p3.no/filmpolitiet/category/spillanmeldelser/terningkast-3";
  const type = forTestingOnly.getTypeFromUrl(url);

  assertEquals(type, "game");
});

Deno.test("Get rating from URL: '3'", () => {
  const url =
    "https://p3.no/filmpolitiet/category/spillanmeldelser/terningkast-3";
  const rating = forTestingOnly.getRatingFromUrl(url);

  assertEquals(rating, 3);
});
