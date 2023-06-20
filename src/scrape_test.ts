import { assertEquals } from "$std/testing/asserts.ts";
import { HTMLDocument } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { forTestingOnly } from "./scrape.ts";

const indexPage = new URL("./testdata/index-page.html", import.meta.url);

const pageDocument = await forTestingOnly.getPageDoc(indexPage) as HTMLDocument;

Deno.test("Get entries", () => {
  const entries = forTestingOnly.getEntries(pageDocument);

  assertEquals(entries?.length, 50);
});

Deno.test("Parse single entry", () => {
  const entries = forTestingOnly.getEntries(pageDocument);
  const parsedEntry = forTestingOnly.parseEntry(entries[0]);

  assertEquals(Array.from(parsedEntry.keys()), [
    "filmpolitietId",
    "url",
    "name",
    "reviewDate",
  ]);
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
