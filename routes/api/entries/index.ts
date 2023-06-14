import "https://deno.land/std@0.191.0/dotenv/load.ts";
import PocketBase from "pb";
import { HandlerContext } from "$fresh/server.ts";

export const handler = async (
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  const reqUrl = new URL(req.url);
  const page = Number(reqUrl.searchParams.get("page")) ?? 1;
  const perPage = Number(reqUrl.searchParams.get("perPage")) ?? 50;
  const filter = reqUrl.searchParams.get("filter") as string;

  try {
    const pb = new PocketBase(
      Deno.env.get("PB_URL") || "http://127.0.0.1:8090",
    );
    const username = Deno.env.get("PB_ADMIN_USERNAME")!;
    const password = Deno.env.get("PB_ADMIN_PASSWORD")!;
    await pb.admins.authWithPassword(username, password);
    const result = await pb.collection("entry").getList<App.Entry>(
      page,
      perPage,
      { filter, expand: "type, author" },
    );
    return new Response(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("/api/entries failed.");
    console.error(error);
    return new Response(JSON.stringify({ message: "error" }));
  }
};
