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
        <ul class="grid grid-cols-3 gap-4 mb-4">
          {data.entries.map((entry) => (
            <li>
              <Card entry={entry} />
            </li>
          ))}
        </ul>
        <div class="flex gap-4">
          {previousPage &&
            (
              <a
                href={`${url.pathname}?page=${previousPage}`}
                class="underline"
              >
                Previous
              </a>
            )}
          {nextPage &&
            (
              <a href={`${url.pathname}?page=${nextPage}`} class="underline">
                Next
              </a>
            )}
        </div>
      </div>
    </>
  );
}
