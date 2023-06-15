import "https://deno.land/std@0.191.0/dotenv/load.ts";
import PocketBase from "pb";
import { HandlerContext } from "$fresh/server.ts";
import { scrape } from "../../src/scrape.ts";

export const handler = async (
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  const reqUrl = new URL(req.url);

  try {
    const url = reqUrl.searchParams.get("url")!;
    const type = reqUrl.searchParams.get("type")!;
    const rating = reqUrl.searchParams.get("rating")!;
    const isRecursive = reqUrl.searchParams.has("recursive");

    const pb = new PocketBase(
      Deno.env.get("PB_URL") || "http://127.0.0.1:8090",
    );
    const username = Deno.env.get("PB_ADMIN_USERNAME")!;
    const password = Deno.env.get("PB_ADMIN_PASSWORD")!;
    await pb.admins.authWithPassword(username, password);

    await scrape({
      pb,
      url,
      inputType: type,
      rating: Number(rating),
      isRecursive,
    });
    return new Response(JSON.stringify({ message: "sucess!" }));
  } catch (error) {
    console.error("/api/scrape failed.");
    console.error(error);
    return new Response(JSON.stringify({ message: "error" }));
  }
};
