import { Handlers } from "$fresh/server.ts";
import { stringify } from "xml";
import denoConfig from "../../deno.json" with { type: "json" };
import config from "../../fresh.config.ts";
import { Review } from "../../src/db/models/review.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    const latestReviews = Review.getAll({ pageSize: 20, pageNo: 1 });

    const rss = generateXML(latestReviews);
    console.log(Deno.inspect(config));

    return new Response(rss, { headers: { "content-type": "text/xml" } });
  },
};

function generateXML(reviews: Review[]): string {
  const entries = reviews.map((review) => {
    return {
      "@xml:lang": "en",
      title: review.title,
      author: {
        name: review.author.fullName,
        email: review.author.email,
        uri: review.author.url,
      },
      published: review.reviewDate.toISOString(),
      updated: review.reviewDate.toISOString(),
      link: {
        "@rel": "alternate",
        "@href": review.url,
        "@type": "text/html",
      },
      id: review.url,
      // TODO: Add `category`.
      content: {
        "@type": "html",
        "#text":
          `<p>Dice-roll: ${review.rating}<br><a href="${review.url}">Read more</a><br><img src="${review.coverArtUrl}" /></p>`,
      },
    };
  });
  const feedUrl = `https://${config.hostname}/feed.xml`;
  const feedXML = stringify({
    xml: {
      "@version": "1.0",
      "@encoding": "UTF-8",
    },
    feed: {
      "@xmlns": "http://www.w3.org/2005/Atom",
      "@xml:lang": "en",
      title: denoConfig.name,
      subtitle: "",
      link: [
        {
          "@href": feedUrl,
          "@rel": "self",
          "@type": "application/atom+xml",
        },
        {
          "@href": `https://${config.hostname}`,
        },
      ],
      updated: reviews[0].reviewDate.toISOString(),
      id: feedUrl,
      entry: entries,
    },
  });

  return feedXML;
}
