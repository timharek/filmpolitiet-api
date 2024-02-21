import { db } from "../../db.ts";

type AuthorData = {
  id: number;
  fullName: string;
  email: string;
  url: string;
};

export type AuthorCreateInput = { id?: number } & Omit<AuthorData, "id">;

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

  /**
   * TODO: Add filter. https://todo.sr.ht/~timharek/filmpolitiet-api/4
   */
  public static getAll(): Author[] {
    const authors: Author[] = [];
    const result = db.queryEntries<AuthorData>("SELECT * FROM author");

    for (const author of result) {
      authors.push(new Author(author));
    }

    return authors;
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

    db.queryEntries<AuthorData>(
      `INSERT INTO author (fullName, email, url) VALUES
        (:fullName, :email, :url);
      `,
      data,
    );
    const created = this.getByEmail(data.email);
    if (!created) return null;
    return created;
  }

  get id() {
    return this.data.id;
  }

  get fullName() {
    return this.data.fullName;
  }
}
