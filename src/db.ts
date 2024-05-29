import "@std/dotenv/load";
import { DB } from "sqlite";

const dbPath = Deno.env.get("DB_PATH");
if (!dbPath) {
  console.warn("No path for SQLite, using memory instead");
}
export const db = new DB(dbPath);

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
      title TEXT NOT NULL,
      url TEXT NOT NULL UNIQUE,
      rating INTEGER NOT NULL,
      reviewDate TEXT NOT NULL,
      coverArtUrl TEXT,
      typeId INTEGER NOT NULL,
      authorId INTEGER NOT NULL,
      FOREIGN KEY (authorId) REFERENCES author(id),
      FOREIGN KEY (typeId) REFERENCES entryType(id)
    );
`);

export const ENTRY_TYPE: Record<string, number> = {
  movie: 1,
  show: 2,
  game: 3,
};

export type Where<T extends string> = {
  string: string;
  args: Record<T, string | number>;
};
