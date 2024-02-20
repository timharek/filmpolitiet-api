import { DB } from "sqlite";
import { Entry } from "./db/models/entry.ts";
import { Author } from "./db/models/author.ts";

export const db = new DB("data.db");

db.execute(`
    CREATE TABLE IF NOT EXISTS entryType (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      title TEXT NOT NULL,
      UNIQUE(id)
    );
    INSERT OR IGNORE INTO entryType (id, title) VALUES
      (1, 'movie'),
      (2, 'show'),
      (3, 'game');

    CREATE TABLE IF NOT EXISTS author (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL,
      url TEXT NOT NULL,
      UNIQUE(email)
    );

    CREATE TABLE IF NOT EXISTS entry (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
      filmpolitietId TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      rating INTEGER NOT NULL,
      reviewDate TEXT NOT NULL,
      coverArtUrl TEXT,
      typeId INTEGER NOT NULL,
      authorId INTEGER NOT NULL,
      FOREIGN KEY (authorId) REFERENCES author(id),
      FOREIGN KEY (typeId) REFERENCES entryType(id)
    );
`);

const createdAuthor = Author.create({
  fullName: "Tim",
  email: "tim@example.org",
  url: "https://example.org",
});
console.log("createdAuthor", createdAuthor);

const firstEntry = Entry.get(1);

console.log("first", firstEntry);

const createdEntry = Entry.create({
  filmpolitietId: "a24",
  title: "film",
  url: "",
  rating: 3,
  reviewDate: "2024-02-20",
  authorId: 1,
  typeId: 1,
  coverArtUrl: "https://example.org",
});

console.log("created", createdEntry);

console.log("type", createdEntry?.type);
console.log("author", createdEntry?.author);

db.close();
