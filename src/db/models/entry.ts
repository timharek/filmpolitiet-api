import { db, Where } from "../../db.ts";
import { Author } from "./author.ts";

export type EntryData = {
  id: string;
  filmpolitietId: string;
  title: string;
  url: string;
  rating: number;
  reviewDate: string;
  typeId: number;
  authorId: number;
  coverArtUrl?: string;
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

  // TODO: Add pagintion. https://todo.sr.ht/~timharek/filmpolitiet-api/1
  public static getAll(where?: Where<keyof EntryData> | null): Entry[] {
    const entries: Entry[] = [];
    let result: EntryData[];
    result = db.queryEntries<EntryData>(
      "SELECT * FROM entry",
    );
    if (where) {
      result = db.queryEntries<EntryData>(
        `SELECT * FROM entry WHERE ${where.string}`,
        where.args,
      );
    }

    for (const entry of result) {
      entries.push(new Entry(entry));
    }

    return entries;
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

  get reviewDate(): Date {
    return new Date(this.data.reviewDate);
  }

  get url(): URL {
    return new URL(this.data.url);
  }

  get rating(): number {
    return this.data.rating;
  }

  get coverArtUrl(): URL | null {
    if (!this.data.coverArtUrl) return null;
    if (this.data.coverArtUrl.startsWith("https")) {
      return new URL(this.data.coverArtUrl);
    }

    return new URL(`https:${this.data.coverArtUrl}`);
  }

  get title(): string {
    return this.data.title;
  }
}
