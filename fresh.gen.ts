// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/[name].tsx";
import * as $1 from "./routes/_app.tsx";
import * as $2 from "./routes/api/entries/index.ts";
import * as $3 from "./routes/api/scrape.ts";
import * as $4 from "./routes/docs.tsx";
import * as $5 from "./routes/entries.tsx";
import * as $6 from "./routes/index.tsx";
import * as $7 from "./routes/reviewers.tsx";
import * as $$0 from "./islands/Counter.tsx";

const manifest = {
  routes: {
    "./routes/[name].tsx": $0,
    "./routes/_app.tsx": $1,
    "./routes/api/entries/index.ts": $2,
    "./routes/api/scrape.ts": $3,
    "./routes/docs.tsx": $4,
    "./routes/entries.tsx": $5,
    "./routes/index.tsx": $6,
    "./routes/reviewers.tsx": $7,
  },
  islands: {
    "./islands/Counter.tsx": $$0,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
