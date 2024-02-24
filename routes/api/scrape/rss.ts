import "$std/dotenv/load.ts";
import { HandlerContext, Status } from "$fresh/server.ts";
import { scrapeRSS } from "../../../src/scrape_rss.ts";

export const handler = async (
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  const { searchParams } = new URL(req.url);
  try {
    const SECRET = Deno.env.get("SECRET");
    if (!SECRET) {
      throw new Error("Missing `SECRET`");
    }

    const providedSecret = searchParams.get("secret");

    if (!providedSecret) {
      throw new Error("Missing `SECRET`");
    }

    if (SECRET !== providedSecret) {
      throw new Error("Provided secret doesn't match `SECERT`");
    }
    const feedUrl = new URL(
      "https://p3.no/category/filmpolitiet-anmelder/feed/",
    );

    await scrapeRSS({ feedUrl });
    return new Response(JSON.stringify({ message: "sucess!" }), {
      status: Status.OK,
    });
  } catch (error) {
    console.error("/api/scrape/rss failed.");
    console.error(error);
    return new Response(JSON.stringify({ message: "error" }), {
      status: Status.BadRequest,
    });
  }
};
