import "https://deno.land/std@0.191.0/dotenv/load.ts";
import PocketBase from "pb";
import { HandlerContext, Status } from "$fresh/server.ts";
import { scrape } from "../../src/scrape.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  try {
    const commonUrl = "https://p3.no/filmpolitiet/category";
    const urls = [
      `${commonUrl}/filmanmeldelser/terningkast-6-filmanmeldelser/`,
      `${commonUrl}/filmanmeldelser/terningkast-5-filmanmeldelser/`,
      `${commonUrl}/filmanmeldelser/terningkast-4-filmanmeldelser/`,
      `${commonUrl}/filmanmeldelser/terningkast-3-filmanmeldelser/`,
      `${commonUrl}/filmanmeldelser/terningkast-2-filmanmeldelser/`,
      `${commonUrl}/filmanmeldelser/terningkast-1-filmanmeldelser/`,
      `${commonUrl}/spillanmeldelser/terningkast-6-spillanmeldelser/`,
      `${commonUrl}/spillanmeldelser/terningkast-5-spillanmeldelser/`,
      `${commonUrl}/spillanmeldelser/terningkast-4-spillanmeldelser/`,
      `${commonUrl}/spillanmeldelser/terningkast-3-spillanmeldelser/`,
      `${commonUrl}/spillanmeldelser/terningkast-2-spillanmeldelser/`,
      `${commonUrl}/spillanmeldelser/terningkast-1-spillanmeldelser/`,
      `${commonUrl}/tv-serieanmeldelser/terningkast-6-tv-serieanmeldelser/`,
      `${commonUrl}/tv-serieanmeldelser/terningkast-5-tv-serieanmeldelser/`,
      `${commonUrl}/tv-serieanmeldelser/terningkast-4-tv-serieanmeldelser/`,
      `${commonUrl}/tv-serieanmeldelser/terningkast-3-tv-serieanmeldelser/`,
      `${commonUrl}/tv-serieanmeldelser/terningkast-2-tv-serieanmeldelser/`,
      `${commonUrl}/tv-serieanmeldelser/terningkast-1-tv-serieanmeldelser/`,
    ];
    const isRecursive = false;
    const isOverwriting = false;

    const pb = new PocketBase(
      Deno.env.get("PB_URL") || "http://127.0.0.1:8090",
    );
    const username = Deno.env.get("PB_ADMIN_USERNAME")!;
    const password = Deno.env.get("PB_ADMIN_PASSWORD")!;
    await pb.admins.authWithPassword(username, password);

    for (const index in urls) {
      const url = urls[index];
      console.log("url", url);
      console.log("scraping");
      await scrape({ pb, url, isRecursive, isOverwriting });
    }
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
