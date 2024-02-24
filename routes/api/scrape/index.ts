import "https://deno.land/std@0.191.0/dotenv/load.ts";
import { HandlerContext, Status } from "$fresh/server.ts";
import { scrape } from "../../../src/scrape.ts";

export const handler = async (
  req: Request,
  _ctx: HandlerContext,
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
    return new Response(JSON.stringify({ message: "error" }), {
      status: Status.BadRequest,
    });
  }
};