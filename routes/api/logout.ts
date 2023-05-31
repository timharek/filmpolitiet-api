import PocketBase from "pb";
import { HandlerContext, Status } from "$fresh/server.ts";

export const handler = (_req: Request, ctx: HandlerContext): Response => {
  const pb = ctx.state.data as PocketBase;
  pb.authStore.clear();

  return new Response("", {
    status: Status.SeeOther,
    headers: { Location: `/login` },
  });
};
