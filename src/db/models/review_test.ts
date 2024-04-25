import { assertExists } from "$std/assert/mod.ts";
import { assertEquals } from "https://deno.land/std@0.216.0/assert/assert_equals.ts";
import { Review } from "./review.ts";
import { Author } from "./author.ts";

const author = Author.create({
  fullName: "Ola Nordmann",
  email: "ola@nordmann.no",
  url: "https://example.org/ola",
});

Deno.test("Create new review: Ex Machina", () => {
  assertExists(author);
  const newReview = Review.create({
    title: "Ex Machina",
    url: "https://example.org/ex-machina",
    coverArtUrl: "https://example.org/ex-machina.jpg",
    reviewDate: "2016-01-01",
    rating: 5,
    typeId: 1,
    authorId: author.id,
  });

  assertExists(newReview);
  assertEquals(newReview.title, "Ex Machina");
  assertEquals(newReview.url, new URL("https://example.org/ex-machina"));
  assertEquals(
    newReview.coverArtUrl,
    new URL("https://example.org/ex-machina.jpg?w=240"),
  );
  assertEquals(Review.count(), 1);
});

Deno.test("Get review: Ex Machina", () => {
  const review = Review.getByUrl("https://example.org/ex-machina");

  assertExists(review);
  assertEquals(review.title, "Ex Machina");
  assertEquals(review.url, new URL("https://example.org/ex-machina"));
  assertEquals(
    review.coverArtUrl,
    new URL("https://example.org/ex-machina.jpg?w=240"),
  );
  assertEquals(Review.count(), 1);
});

Deno.test("Upsert (new) review: Drive", () => {
  assertExists(author);
  const upsertedReview = Review.upsert({
    title: "Drive",
    url: "https://example.org/drive",
    coverArtUrl: "https://example.org/drive.png",
    reviewDate: "2011-01-01",
    rating: 6,
    typeId: 1,
    authorId: author.id,
  });
  assertExists(upsertedReview);
  assertEquals(upsertedReview.title, "Drive");
  assertEquals(upsertedReview.url, new URL("https://example.org/drive"));
  assertEquals(
    upsertedReview.coverArtUrl,
    new URL("https://example.org/drive.png?w=240"),
  );
  assertEquals(Review.count(), 2);
});

Deno.test("Upsert (existing) review: Ex Machina", () => {
  assertExists(author);
  const upsertedReview = Review.upsert({
    title: "Ex Machina",
    url: "https://example.org/ex-machina",
    coverArtUrl: "https://example.org/ex-machina.png",
    reviewDate: "2016-01-01",
    rating: 6,
    typeId: 1,
    authorId: author.id,
  });
  assertExists(upsertedReview);
  assertEquals(upsertedReview.title, "Ex Machina");
  assertEquals(upsertedReview.url, new URL("https://example.org/ex-machina"));
  assertEquals(
    upsertedReview.coverArtUrl,
    new URL("https://example.org/ex-machina.png?w=240"),
  );
  assertEquals(Review.count(), 2);
});
