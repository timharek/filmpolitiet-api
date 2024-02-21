import "$std/dotenv/load.ts";
import { HandlerContext, Status } from "$fresh/server.ts";
import { scrapeRSS } from "../../src/scrape_rss.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  try {
    const feedUrl = new URL(
      "https://p3.no/category/filmpolitiet-anmelder/feed/",
    );

    await scrapeRSS({ feedUrl });
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
