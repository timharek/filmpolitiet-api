import { db, Where } from "../../db.ts";

type AuthorData = {
  id: number;
  fullName: string;
  email: string;
  url: string;
  count: number;
};

export type AuthorCreateInput =
  & { id?: number }
  & Omit<AuthorData, "id" | "count">;

export class Author {
  private constructor(private data: AuthorData) {}

  public static get(id: number): Author | null {
    const result = db.queryEntries<AuthorData>(
      "SELECT author.*, (SELECT COUNT(*) FROM entry WHERE authorId = author.id) AS count FROM author WHERE id = :id",
      { id },
    );

    if (result.length === 0 || !result[0]) {
      return null;
    }

    return new Author(result[0]);
  }

  public static getAll(
    order: { column: keyof AuthorData; by: "ASC" | "DESC" } = {
      column: "fullName",
      by: "ASC",
    },
    where?: Where<keyof AuthorData>,
  ): Author[] {
    const authors: Author[] = [];
    let result = db.queryEntries<AuthorData>(
      `SELECT author.*, (SELECT COUNT(*) FROM entry WHERE authorId = author.id) AS count FROM author ORDER BY ${order.column} ${order.by}`,
    );
    if (where) {
      result = db.queryEntries<AuthorData>(
        `SELECT author.*, (SELECT COUNT(*) FROM entry WHERE authorId = author.id) AS count WHERE ${where.string} FROM author ORDER BY ${order.column} ${order.by}`,
        where.args,
      );
    }

    for (const author of result) {
      authors.push(new Author(author));
    }

    return authors;
  }

  /**
   * Count of authors.
   */
  public static get count(): number {
    const countObjects = db.queryEntries<{ "count(*)": number }>(
      `SELECT count(*) FROM author;`,
    );
    return countObjects[0]["count(*)"];
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

  public static upsert(
    data: AuthorCreateInput & { id: number },
  ): Author | null {
    const { id, ...input } = data;
    const existing = this.get(id);
    if (existing) {
      return existing.update(input);
    }

    return this.create(input);
  }

  public update(data: Partial<AuthorCreateInput>): Author {
    db.queryEntries<AuthorData>(
      `UPDATE author
        SET 
          fullName = CASE WHEN :fullName IS NOT NULL THEN :fullName ELSE fullName END,
          email = CASE WHEN :email IS NOT NULL THEN :email ELSE email END,
          url = CASE WHEN :url IS NOT NULL THEN :url ELSE url END
        WHERE id = :id`,
      { ...data, id: this.id },
    );

    return this.get();
  }

  private get(): Author {
    const result = db.queryEntries<AuthorData>(
      "SELECT author.*, (SELECT COUNT(*) FROM entry WHERE authorId = author.id) AS count FROM author WHERE id = :id",
      { id: this.id },
    );

    if (result.length === 0 || !result[0]) {
      throw new Error("Author doesn't exist, should not be possible.");
    }

    return new Author(result[0]);
  }

  get id() {
    return this.data.id;
  }

  get fullName() {
    return this.data.fullName;
  }

  get email() {
    return this.data.email;
  }

  get url() {
    return this.data.url;
  }

  get reviewCount() {
    return this.data.count;
  }
}
