import { db } from "../../db.ts";

type AuthorData = {
  id: string;
  fullName: string;
  email: string;
  url: string;
};

type AuthorCreateInput = { id?: number } & Omit<AuthorData, "id">;

export class Author {
  private constructor(private data: AuthorData) {}

  public static get(id: number): Author | null {
    const result = db.queryEntries<AuthorData>(
      "SELECT * FROM author WHERE id = :id",
      { id },
    );

    if (result.length === 0 || !result[0]) {
      return null;
    }

    return new Author(result[0]);
  }

  public static getByEmail(email: string): Author | null {
    const result = db.queryEntries<AuthorData>(
      "SELECT * FROM author WHERE email = :email",
      { email },
    );

    if (result.length === 0 || !result[0]) {
      return null;
    }

    return new Author(result[0]);
  }

  public static create(data: AuthorCreateInput): Author | null {
    const existing = this.getByEmail(data.email);
    if (existing) return existing;

    const created = db.queryEntries<AuthorData>(
      `INSERT INTO author (fullName, email, url) VALUES
        (:fullName, :email, :url);
      `,
      data,
    );

    if (created.length === 0 || !created[0]) {
      return null;
    }

    return new Author(created[0]);
  }
}
