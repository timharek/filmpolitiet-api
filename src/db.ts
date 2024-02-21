import { DB } from "sqlite";

export const db = new DB("data.db");

db.execute(`
    CREATE TABLE IF NOT EXISTS entryType (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
      title TEXT NOT NULL UNIQUE
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
