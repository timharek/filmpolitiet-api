import "$std/dotenv/load.ts";
import { FreshContext, STATUS_CODE } from "$fresh/server.ts";
import { scrapeRSS } from "../../../src/scrape_rss.ts";

export const handler = async (
  req: Request,
  _ctx: FreshContext,
): Promise<Response> => {
  const { searchParams } = new URL(req.url);
  try {
    const SECRET = Deno.env.get("SECRET");
    if (!SECRET) {
      throw new Error("Missing `SECRET`", { cause: "environment" });
    }

    const providedSecret = searchParams.get("secret");

    if (!providedSecret) {
      throw new Error("Missing secret parameter");
    }

    if (SECRET !== providedSecret) {
      throw new Error("Provided secret doesn't match `SECERT`", {
        cause: "parameter",
      });
    }
    const feedUrl = new URL(
      "https://p3.no/category/filmpolitiet-anmelder/feed/",
    );

    await scrapeRSS({ feedUrl });
    return new Response(JSON.stringify({ message: "sucess!" }), {
      status: STATUS_CODE.OK,
    });
  } catch (error) {
    console.error("/api/scrape/rss failed.");
    console.error(error);
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ message: error.message, cause: error.cause }),
        {
          status: STATUS_CODE.BadRequest,
        },
      );
    }
    return new Response(JSON.stringify({ message: "error" }), {
      status: STATUS_CODE.BadRequest,
    });
  }
};
