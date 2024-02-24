import "$std/dotenv/load.ts";
import { FreshContext, STATUS_CODE } from "$fresh/server.ts";
import { scrape } from "../../../src/scrape.ts";

export const handler = async (
  req: Request,
  _ctx: FreshContext,
): Promise<Response> => {
  const reqUrl = new URL(req.url);

  try {
    const url = reqUrl.searchParams.get("url")!;
    const isRecursive = reqUrl.searchParams.has("recursive");

    const res = await scrape({ url, isRecursive });
    return new Response(JSON.stringify({ message: "sucess!" }), {
      status: res,
    });
  } catch (error) {
    console.error("/api/scrape failed.");
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
