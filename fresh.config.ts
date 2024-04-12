import "$std/dotenv/load.ts";
import twindPlugin from "$fresh/plugins/twindv1.ts";
import twindConfig from "./twind.config.ts";
import { defineConfig } from "$fresh/server.ts";

export default defineConfig({
  port: Number(Deno.env.get("PORT")) || 8000,
  hostname: Deno.env.get("HOSTNAME") || "localhost",
  plugins: [twindPlugin(twindConfig)],
});
