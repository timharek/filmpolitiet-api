// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_slug_ from "./routes/[slug].tsx";
import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_scrape_index from "./routes/api/scrape/index.ts";
import * as $api_scrape_rss from "./routes/api/scrape/rss.ts";
import * as $feed_xml_index from "./routes/feed.xml/index.ts";
import * as $index from "./routes/index.tsx";
import * as $reviewers from "./routes/reviewers.tsx";
import * as $reviews from "./routes/reviews.tsx";

import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/[slug].tsx": $_slug_,
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/scrape/index.ts": $api_scrape_index,
    "./routes/api/scrape/rss.ts": $api_scrape_rss,
    "./routes/feed.xml/index.ts": $feed_xml_index,
    "./routes/index.tsx": $index,
    "./routes/reviewers.tsx": $reviewers,
    "./routes/reviews.tsx": $reviews,
  },
  islands: {},
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
