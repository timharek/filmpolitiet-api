import { assertExists } from "$std/assert/mod.ts";
import { assertEquals } from "https://deno.land/std@0.216.0/assert/assert_equals.ts";
import { Author } from "./author.ts";

Deno.test("Create new author: Ola Nordmann", () => {
  const newAuthor = Author.create({
    fullName: "Ola Nordmann",
    email: "ola@nordmann.no",
    url: "https://example.org/ola",
  });

  assertExists(newAuthor);
  assertEquals(newAuthor.fullName, "Ola Nordmann");
  assertEquals(newAuthor.email, "ola@nordmann.no");
  assertEquals(newAuthor.url, "https://example.org/ola");
  assertEquals(Author.count, 1);
});

Deno.test("Get author: Ola Nordmann", () => {
  const author = Author.getByEmail("ola@nordmann.no");

  assertExists(author);
  assertEquals(author.fullName, "Ola Nordmann");
  assertEquals(author.email, "ola@nordmann.no");
  assertEquals(author.url, "https://example.org/ola");
  assertEquals(Author.count, 1);
});

Deno.test("Create another new author: Kari Nordmann", () => {
  const newAuthor = Author.create({
    fullName: "Kari Nordmann",
    email: "kari@nordmann.no",
    url: "https://example.org/kari",
  });

  assertExists(newAuthor);
  assertEquals(newAuthor.fullName, "Kari Nordmann");
  assertEquals(newAuthor.email, "kari@nordmann.no");
  assertEquals(newAuthor.url, "https://example.org/kari");
  assertEquals(Author.count, 2);
});

Deno.test("Update author: Kari Norwegian", () => {
  const existingAuthor = Author.getByEmail("kari@nordmann.no");
  assertExists(existingAuthor);

  const updatedAuthor = existingAuthor.update({
    fullName: "Kari Norwegian",
    email: "kari@norway.no",
    url: "https://example.com/kari",
  });

  assertExists(updatedAuthor);
  assertEquals(updatedAuthor.fullName, "Kari Norwegian");
  assertEquals(updatedAuthor.email, "kari@norway.no");
  assertEquals(updatedAuthor.url, "https://example.com/kari");
  assertEquals(Author.count, 2);
});

Deno.test("Upsert (new) author: Kai Nordmann", () => {
  const upsertedAuthor = Author.upsert({
    fullName: "Kai Nordmann",
    email: "kai@nordmann.no",
    url: "https://example.com/kai",
  });

  assertExists(upsertedAuthor);
  assertEquals(upsertedAuthor.fullName, "Kai Nordmann");
  assertEquals(upsertedAuthor.email, "kai@nordmann.no");
  assertEquals(upsertedAuthor.url, "https://example.com/kai");
  assertEquals(Author.count, 3);
});

Deno.test("Upsert (existing) author: Ola Nordmann", () => {
  const newAuthor = Author.upsert({
    fullName: "Ola Norway",
    email: "ola@nordmann.no",
    url: "https://example.org/ola",
  });

  assertExists(newAuthor);
  assertEquals(newAuthor.fullName, "Ola Norway");
  assertEquals(newAuthor.email, "ola@nordmann.no");
  assertEquals(newAuthor.url, "https://example.org/ola");
  assertEquals(Author.count, 3);
});
