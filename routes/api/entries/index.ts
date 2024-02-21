import "$std/dotenv/load.ts";
import { HandlerContext } from "$fresh/server.ts";
import { Entry } from "../../../src/db/models/entry.ts";

export const handler = async (
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  const reqUrl = new URL(req.url);
  const page = Number(reqUrl.searchParams.get("page")) ?? 1;
  const perPage = Number(reqUrl.searchParams.get("perPage")) ?? 50;
  const filter = reqUrl.searchParams.get("filter") as string;

  const headers = new Headers();
  headers.set("content-type", "application/json");
  try {
    const result = Entry.getAll();
    return new Response(JSON.stringify(result, null, 2), { headers });
  } catch (error) {
    console.error("/api/entries failed.");
    console.error(error);
    return new Response(JSON.stringify({ message: "error" }), { headers });
  }
};
