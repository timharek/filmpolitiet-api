import PocketBase from "pb";
import { Head } from "$fresh/runtime.ts";
import { Handlers } from "$fresh/server.ts";
import { PageProps } from "$fresh/src/server/types.ts";
import { Card } from "../components/Card.tsx";

interface Props {
  entries: App.Entry[];
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
    const search = url.searchParams.has("q")
      ? url.searchParams.get("q") as string
      : undefined;
    const type = url.searchParams.has("type")
      ? url.searchParams.get("type") as string
      : undefined;
    const rating = url.searchParams.has("rating")
      ? url.searchParams.get("rating") as string
      : undefined;
    const filter = getFilter({ search, type, rating });
    const pb = new PocketBase(
      Deno.env.get("PB_URL") || "http://127.0.0.1:8090",
    );
    const username = Deno.env.get("PB_ADMIN_USERNAME")!;
    const password = Deno.env.get("PB_ADMIN_PASSWORD")!;
    await pb.admins.authWithPassword(username, password);

    const entriesResult = await pb.collection("entry").getList<App.Entry>(
      page,
      perPage,
      {
        expand: "author, type",
        sort: "-reviewDate",
        filter,
      },
    );

    return await ctx.render(
      {
        entries: entriesResult.items.map((item) => {
          return {
            ...item,
            coverArt: pb.getFileUrl(item, item.coverArt),
          };
        }),
        page,
        totalPages: entriesResult.totalPages,
      } as Props,
    );
  },
};

export default function Home(props: PageProps<Props>) {
  const { data } = props;
  const url = props.url;

  const type = url.searchParams.get("type");
  const rating = url.searchParams.get("rating");
  const search = url.searchParams.get("q");

  const nextPage = data.totalPages > data.page ? data.page + 1 : false;
  const previousPage = data.page > 1 ? data.page - 1 : false;
  return (
    <>
      <Head>
        <title>Entries - Filmpolitiet API</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <p class="my-6">
          Here be dragons!
        </p>
        <form class="mb-4 space-y-4">
          <div class="flex gap-2">
            <input
              type="search"
              name="q"
              placeholder="Search for movies, tv shows or games"
              class="border w-full p-2"
              defaultValue={search as string}
            />
            <button
              type="submit"
              class="border bg-slate-800 text-white px-2 py-1"
            >
              Search
            </button>
          </div>
          <div class="flex gap-4">
            <div class="flex flex-col">
              <label for="type">Type</label>
              <select
                name="type"
                class="p-2 w-max"
                defaultValue={type as string}
              >
                <option value="">-- nothing --</option>
                <option value="movie">Movie</option>
                <option value="show">TV Show</option>
                <option value="game">Video-game</option>
              </select>
            </div>
            <div class="flex flex-col">
              <label for="rating">Rating</label>
              <select
                name="rating"
                class="p-2 w-max"
                defaultValue={rating as string}
              >
                <option value="">-- nothing --</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>
          </div>
        </form>
        {data.entries.length === 0 &&
          <p class="">No results. Check back later.</p>}
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
                href={`${url.pathname}?page=${previousPage}`}
                class="underline"
              >
                {"<"} Previous page
              </a>
            )}
          {nextPage &&
            (
              <a
                href={`${url.pathname}?page=${nextPage}`}
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

interface Filter {
  search?: string;
  type?: string;
  rating?: string;
}

function getFilter({ search, type, rating }: Filter) {
  const filterArray = [];

  if (search) {
    filterArray.push(`name ~ "${search}"`);
  }

  if (type) {
    filterArray.push(`type.name = "${type}"`);
  }

  if (rating) {
    filterArray.push(`rating = "${rating}"`);
  }

  return filterArray.join(" && ");
}
