import "https://deno.land/std@0.191.0/dotenv/load.ts";
import PocketBase from "pb";
import { HandlerContext, Status } from "$fresh/server.ts";
import { scrapeRSS } from "../../src/scrape_rss.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  try {
    const feedUrl = new URL("https://p3.no/filmpolitiet/feed/");

    const pb = new PocketBase(
      Deno.env.get("PB_URL") || "http://127.0.0.1:8090",
    );
    const username = Deno.env.get("PB_ADMIN_USERNAME")!;
    const password = Deno.env.get("PB_ADMIN_PASSWORD")!;
    await pb.admins.authWithPassword(username, password);

    await scrapeRSS({ feedUrl, pb });
    return new Response(JSON.stringify({ message: "sucess!" }), {
      status: Status.OK,
    });
  } catch (error) {
    console.error("/api/auto-scrape failed.");
    console.error(error);
    return new Response(JSON.stringify({ message: "error" }), {
      status: Status.BadRequest,
    });
  }
};
