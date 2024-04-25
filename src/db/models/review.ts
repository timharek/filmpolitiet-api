import { db, Where } from "../../db.ts";
import { Author } from "./author.ts";

export type ReviewData = {
  id: string;
  title: string;
  url: string;
  rating: number;
  reviewDate: string;
  typeId: number;
  authorId: number;
  coverArtUrl?: string;
};

export type ReviewCreateInput = { id?: number } & Omit<ReviewData, "id">;

type ReviewType = {
  id: number;
  title: string;
};

export class Review {
  private constructor(private data: ReviewData) {}

  public static get(id: number): Review | null {
    const result = db.queryEntries<ReviewData>(
      "SELECT * FROM entry WHERE id = :id",
      { id },
    );

    if (result.length === 0 || !result[0]) {
      return null;
    }

    return new Review(result[0]);
  }

  public static getAll(
    { pageSize = 48, pageNo = 1, where }: {
      pageSize: number;
      pageNo: number;
      where?: Where<keyof ReviewData> | null;
    },
  ): Review[] {
    const entries: Review[] = [];
    let result: ReviewData[];
    const offset = (pageNo - 1) * pageSize;
    const paginationString = `LIMIT ${pageSize} OFFSET ${offset ?? 0}`;
    result = db.queryEntries<ReviewData>(
      `SELECT * FROM entry ORDER BY reviewDate DESC ${paginationString}`,
    );
    if (where) {
      result = db.queryEntries<ReviewData>(
        `SELECT * FROM entry WHERE ${where.string} ORDER BY reviewDate DESC ${paginationString}`,
        where.args,
      );
    }

    for (const entry of result) {
      entries.push(new Review(entry));
    }

    return entries;
  }

  public static count(where?: Where<keyof ReviewData> | null): number {
    type Count = Record<"COUNT(*)", number>;
    let count =
      db.queryEntries<Count>(`SELECT COUNT(*) FROM entry`)[0]["COUNT(*)"];
    if (where) {
      count = db.queryEntries<Count>(
        `SELECT COUNT(*) FROM entry WHERE ${where.string}`,
        where.args,
      )[0]["COUNT(*)"];
    }

    return count;
  }

  public static getType(title: string): ReviewType | null {
    const result = db.queryEntries<ReviewType>(
      "SELECT * FROM entryType WHERE title = :title",
      { title },
    );

    if (result.length === 0 || !result[0]) {
      return null;
    }

    return result[0];
  }

  public static getByUrl(url: string): Review | null {
    const result = db.queryEntries<ReviewData>(
      "SELECT * FROM entry WHERE url = :url;",
      { url },
    );

    if (result.length === 0 || !result[0]) {
      return null;
    }

    return new Review(result[0]);
  }

  public static create(data: ReviewCreateInput): Review | null {
    const existing = this.getByUrl(data.url);
    if (existing) return existing;

    db.queryEntries<ReviewData>(
      `INSERT INTO entry (title, url, rating, coverArtUrl, reviewDate, typeId, authorId) VALUES
        (:title, :url, :rating, :coverArtUrl, :reviewDate, :typeId, :authorId);
      `,
      data,
    );

    return this.get(db.lastInsertRowId);
  }

  public static upsert(data: ReviewCreateInput): Review | null {
    const updated = db.queryEntries<ReviewData>(
      `INSERT OR REPLACE INTO entry (title, url, rating, coverArtUrl, reviewDate, typeId, authorId) VALUES
        (:title, :url, :rating, :coverArtUrl, :reviewDate, :typeId, :authorId);
      `,
      data,
    );
    if (updated.length === 0 || !updated[0]) {
      return null;
    }

    return new Review(updated[0]);
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
    let url;
    if (!this.data.coverArtUrl) return null;
    if (this.data.coverArtUrl.startsWith("https")) {
      url = new URL(this.data.coverArtUrl);
    } else {
      url = new URL(`https:${this.data.coverArtUrl}`);
    }

    url.searchParams.set("w", "240");

    return url;
  }

  get title(): string {
    return this.data.title;
  }
}
