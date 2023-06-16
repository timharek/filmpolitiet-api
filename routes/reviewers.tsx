import PocketBase from "pb";
import { Head } from "$fresh/runtime.ts";
import { Handlers } from "$fresh/server.ts";
import { PageProps } from "$fresh/src/server/types.ts";
import { sort } from "https://deno.land/std@0.178.0/semver/mod.ts";

interface Props {
  authors: App.Author[];
  page: number;
  totalPages: number;
}

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const page = url.searchParams.has("page")
      ? Number(url.searchParams.get("page"))
      : 1;
    const perPage = 48;
    const pb = new PocketBase(
      Deno.env.get("PB_URL") || "http://127.0.0.1:8090",
    );
    const username = Deno.env.get("PB_ADMIN_USERNAME")!;
    const password = Deno.env.get("PB_ADMIN_PASSWORD")!;
    await pb.admins.authWithPassword(username, password);

    const authorsResult = await pb.collection("filmpolitiet_author").getList<
      App.Author
    >(
      page,
      perPage,
      { sort: "name" },
    );

    return await ctx.render(
      {
        authors: authorsResult.items,
        page,
        totalPages: authorsResult.totalPages,
      } as Props,
    );
  },
};

export default function Reviewers(props: PageProps<Props>) {
  const { data } = props;
  const url = props.url;

  const nextPage = data.totalPages > data.page ? data.page + 1 : false;
  const previousPage = data.page > 1 ? data.page - 1 : false;
  const nextPageUrl = setPage(url, nextPage);
  const previousPageUrl = setPage(url, previousPage);
  return (
    <>
      <Head>
        <title>Entries - Filmpolitiet API</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <h1 class="text-4xl font-semibold my-6">
          Filmpolitiet's reviewers
        </h1>
        {data.authors.length === 0 &&
          <p class="">No results. Check back later.</p>}
        {data.authors.length > 0 && (
          <ul class="columns-2 space-y-2 mb-4">
            {data.authors.map((author) => (
              <li>
                <a href={`/entries?author=${author.id}`} class="underline">
                  {author.name}
                </a>
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

function setPage(url: URL, newPage: number | false) {
  if (!newPage) {
    return url.toString();
  }
  url.searchParams.set("page", String(newPage));
  return url.toString();
}
