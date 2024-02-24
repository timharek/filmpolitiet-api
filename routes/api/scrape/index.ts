import "$std/dotenv/load.ts";
import { FreshContext, STATUS_CODE } from "$fresh/server.ts";
import { scrape } from "../../../src/scrape.ts";
import { ZodError } from "zod";

export const handler = async (
  req: Request,
  _ctx: FreshContext,
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
    let response: Record<string, unknown> = { message: "error" };
    let status: number = STATUS_CODE.BadRequest;
    if (error instanceof Error) {
      response = { message: error.message, cause: error.cause };
      status = STATUS_CODE.BadRequest;
    }
    if (error instanceof ZodError) {
      response = {
        name: error.name,
        issueCount: error.issues.length,
        issues: error.issues.map((issue) => ({
          code: issue.code,
          path: issue.path.map((path) => String(path)).join("."),
        })),
      };
      status = STATUS_CODE.BadRequest;
    }
    return new Response(JSON.stringify(response, null, 2), { status });
  }
};
