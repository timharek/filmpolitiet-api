import { HandlerContext } from "$fresh/server.ts";
import { scrape } from "../../src/scrape.ts";

export const handler = async (
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  const reqUrl = new URL(req.url);

  try {
    const url = reqUrl.searchParams.get("url");
    const type = reqUrl.searchParams.get("type");
    const rating = reqUrl.searchParams.get("rating");
    await scrape(url as string, Number(rating), type as string);
    return new Response(JSON.stringify({ message: "sucess!" }));
  } catch (error) {
    console.error("/api/scrape failed.");
    console.error(error);
    return new Response(JSON.stringify({ message: "error" }));
  }
};
