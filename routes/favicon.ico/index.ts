import "@std/dotenv/load";
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    const faviconEmoji = "🍿";

    return new Response(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="100">${faviconEmoji}</text></svg>`,
      {
        headers: { "content-type": `image/svg+xml` },
      },
    );
  },
};
