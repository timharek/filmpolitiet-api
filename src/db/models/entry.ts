import { db } from "../../db.ts";
import { Author } from "./author.ts";

type EntryData = {
  id: string;
  filmpolitietId: string;
  title: string;
  url: string;
  rating: number;
  coverArtUrl: string;
  reviewDate: string;
  typeId: number;
  authorId: number;
};

export type EntryCreateInput = { id?: number } & Omit<EntryData, "id">;

type EntryType = {
  id: number;
  title: string;
};

export class Entry {
  private constructor(private data: EntryData) {}

  public static get(id: number): Entry | null {
    const result = db.queryEntries<EntryData>(
      "SELECT * FROM entry WHERE id = :id",
      { id },
    );

    if (result.length === 0 || !result[0]) {
      return null;
    }

    return new Entry(result[0]);
  }

  public static getType(title: string): EntryType | null {
    const result = db.queryEntries<EntryType>(
      "SELECT * FROM entryType WHERE title = :title",
      { title },
    );

    if (result.length === 0 || !result[0]) {
      return null;
    }

    return result[0];
  }

  public static getByFId(id: string): Entry | null {
    const result = db.queryEntries<EntryData>(
      "SELECT * FROM entry WHERE filmpolitietId = :id;",
      { id },
    );

    if (result.length === 0 || !result[0]) {
      return null;
    }

    return new Entry(result[0]);
  }

  public static create(data: EntryCreateInput): Entry | null {
    const existing = this.getByFId(data.filmpolitietId);
    if (existing) return existing;

    const created = db.queryEntries<EntryData>(
      `INSERT INTO entry (filmpolitietId, title, url, rating, coverArtUrl, reviewDate, typeId, authorId) VALUES
        (:filmpolitietId, :title, :url, :rating, :coverArtUrl, :reviewDate, :typeId, :authorId);
      `,
      data,
    );

    if (created.length === 0 || !created[0]) {
      return null;
    }

    return new Entry(created[0]);
  }

  get type(): string {
    const result = db.queryEntries<{ title: string }>(
      "SELECT title FROM entryType WHERE id = :id",
      { id: this.data.typeId },
    );

    return result[0].title;
  }

  get author(): Author {
    const author = Author.get(this.data.authorId);
    if (!author) throw new Error("Missing author. Not possible.");
    return author;
  }
}
