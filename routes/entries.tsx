import { Head } from "$fresh/runtime.ts";
import { Handlers } from "$fresh/server.ts";
import { PageProps } from "$fresh/src/server/types.ts";
import { Card } from "../components/Card.tsx";
import { Select, SelectOption } from "../components/Select.tsx";
import { Author } from "../src/db/models/author.ts";
import { Entry, EntryData } from "../src/db/models/entry.ts";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { ENTRY_TYPE, Where } from "../src/db.ts";

interface Props {
  entries: Entry[];
  authors: Author[];
  page: number;
  totalPages: number;
}

const searchParamsSchema = zfd.formData({
  q: zfd.text(z.string().optional()),
  type: zfd.text(z.enum(["movie", "show", "game"]).optional()),
  rating: zfd.numeric(z.number().min(1).max(6).optional()),
  author: zfd.numeric(z.number().optional()),
  page: zfd.numeric(z.number().default(1)),
});

type SearchParams = z.infer<typeof searchParamsSchema>;

export const handler: Handlers<Props> = {
  async GET(req, ctx) {
    const url = new URL(req.url);

    const { q, type, rating, author, page } = searchParamsSchema.parse(
      url.searchParams,
    );
    const perPage = 48;

    const where = getFilter({ q, type, rating, author });

    const entries = Entry.getAll(perPage, page, where);
    const count = Entry.count();
    const totalPages = count / 48;

    const requestHeaders = req.headers.get("accept");
    const isRequestingHtml = requestHeaders?.includes("text/html");

    if (!isRequestingHtml) {
      const headers = new Headers();
      headers.set("content-type", "application/json");
      return new Response(JSON.stringify(entries), { headers });
    }

    const authors = Author.getAll();

    return await ctx.render(
      {
        entries,
        page,
        totalPages,
        authors,
      },
    );
  },
};

export default function Entries(props: PageProps<Props>) {
  const { data } = props;
  const url = props.url;

  const { q: search, type, author, rating } = searchParamsSchema.parse(
    url.searchParams,
  );

  const types: SelectOption[] = [
    { value: "movie", label: "Movie" },
    { value: "show", label: "TV Show" },
    { value: "game", label: "Games" },
  ];
  const ratings: SelectOption[] = [];
  for (let index = 1; index <= 6; index++) {
    ratings.push({ value: `${index}`, label: `${index}` });
  }
  const authorOptions: SelectOption[] = data.authors.map((author) => {
    return {
      value: String(author.id),
      label: author.fullName,
    };
  });

  const nextPage = data.totalPages > data.page ? data.page + 1 : false;
  const previousPage = data.page > 1 ? data.page - 1 : false;
  const nextPageUrl = setPage(url, nextPage);
  const previousPageUrl = setPage(url, previousPage);
  return (
    <>
      <Head>
        <title>Entries - Filmpolitiet API</title>
      </Head>
      <div class="px-4 mx-auto max-w-screen-md">
        <h1 class="text-4xl font-semibold my-6">
          Entries
        </h1>
        <p class="my-6">
          Here be dragons!
        </p>
        {url.searchParams.size > 0 && (
          <details>
            <summary>API filter preview</summary>
            <div class="p-4 bg-slate-800 text-white select-all rounded">
              <code class="">
                curl -X GET "{url.toString()}"
              </code>
            </div>
          </details>
        )}
        <form class="mb-4 space-y-4">
          <div class="flex flex-wrap gap-4">
            <Select
              label="Type"
              name="type"
              options={types}
              defaultValue={type ?? ""}
            />
            <Select
              label="Rating"
              name="rating"
              options={ratings}
              defaultValue={String(rating) ?? ""}
            />
            <Select
              label="Author"
              name="author"
              options={authorOptions}
              defaultValue={String(author) ?? ""}
            />
          </div>
          <div class="flex gap-2">
            <label for="search" class="hidden">Search</label>
            <input
              id="search"
              type="search"
              name="q"
              placeholder="Search for movies, tv shows or games"
              class="border w-full p-2 rounded text-black"
              defaultValue={search ?? ""}
            />
            <button
              type="submit"
              class="bg-primary text-black hover:(bg-primary-hover text-white) px-4 py-1 rounded font-semibold transition-all"
            >
              Search
            </button>
          </div>
        </form>
        {data.entries.length === 0 && (
          <p class="">No results. Check back later.</p>
        )}
        {data.entries.length > 0 && (
          <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {data.entries.map((entry) => (
              <li>
                <Card entry={entry} />
              </li>
            ))}
          </ul>
        )}
        <div class="flex flex-wrap justify-between gap-4">
          {previousPage &&
            (
              <a
                href={previousPageUrl.toString()}
                class="underline"
              >
                {"<"} Previous page
              </a>
            )}
          {nextPage &&
            (
              <a
                href={nextPageUrl.toString()}
                class="underline"
              >
                Next page {">"}
              </a>
            )}
        </div>
      </div>
    </>
  );
}

function getFilter(
  { q, type, rating, author }: Omit<SearchParams, "page">,
): Where<keyof EntryData> | null {
  const filters = [];
  const args = {} as Where<keyof EntryData>["args"];

  if (q) {
    filters.push(`title LIKE '%' || :title || '%'`);
    args.title = q;
  }

  if (type) {
    filters.push(`typeId = :typeId`);
    args.typeId = ENTRY_TYPE[type];
  }

  if (rating) {
    filters.push(`rating = :rating`);
    args.rating = rating;
  }

  if (author) {
    filters.push(`authorId = :authorId`);
    args.authorId = author;
  }

  if (!filters || Object.keys(args).length === 0) {
    return null;
  }
  return { string: filters.join(" AND "), args };
}

function setPage(url: URL, newPage: number | false) {
  if (!newPage) {
    return url.toString();
  }
  url.searchParams.set("page", String(newPage));
  return url.toString();
}
