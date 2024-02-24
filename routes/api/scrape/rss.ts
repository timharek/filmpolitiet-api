import "$std/dotenv/load.ts";
import { FreshContext, STATUS_CODE } from "$fresh/server.ts";
import { scrapeRSS } from "../../../src/scrape_rss.ts";
import { ZodError } from "zod";

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

    const successItems = await scrapeRSS({ feedUrl });
    return new Response(
      JSON.stringify({ message: "sucess!", items: successItems }),
      {
        status: STATUS_CODE.OK,
      },
    );
  } catch (error) {
    console.error("/api/scrape/rss failed.");
    console.error(error);
    let response: Record<string, unknown> = { message: "error" };
    let status: number = STATUS_CODE.BadRequest;
    if (error instanceof Error) {
      response = { message: error.message, cause: error.cause };
      status = STATUS_CODE.BadRequest;
    }
    if (error instanceof ZodError) {
      response = {
        name: error.name,
        issueCount: error.issues.length,
        issues: error.issues.map((issue) => ({
          code: issue.code,
          path: issue.path.map((path) => String(path)).join("."),
        })),
      };
      status = STATUS_CODE.BadRequest;
    }
    return new Response(JSON.stringify(response, null, 2), {
      status,
    });
  }
};
