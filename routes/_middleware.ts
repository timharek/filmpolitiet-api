import "$std/dotenv/load.ts";
import PocketBase from "pb";
import { MiddlewareHandlerContext, Status } from "$fresh/server.ts";

export interface ServerState {
  data: PocketBase;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<ServerState>,
) {
  const pb = new PocketBase(Deno.env.get("PB_URL") || "http://127.0.0.1:8090");
  const reqURL = new URL(req.url);

  // load the store data from the request cookie string
  pb.authStore.loadFromCookie(req.headers.get("cookie") || "");

  if (!pb.authStore.isValid && Deno.env.get("ENVIRONMENT") === "dev") {
    const username = Deno.env.get("PB_USERNAME_ADMIN") ?? "";
    const password = Deno.env.get("PB_PASSWORD_ADMIN") ?? "";
    try {
      console.debug(
        "Automatically authenticating with admin from env as we are in dev",
      );
      await pb.admins.authWithPassword(username, password);
      pb.authStore.save(pb.authStore.token, pb.authStore.model);
    } catch (error) {
      console.log(error);
      pb.authStore.clear();
    }
  }

  if (!pb.authStore.isValid) {
    if (!reqURL.pathname.match("login|_frsh")) {
      console.log("Not logged in");
      return new Response(null, {
        status: Status.SeeOther,
        headers: {
          Location: `/login?redirect=${encodeURIComponent(reqURL.pathname)}`,
        },
      });
    }
  }

  if (pb.authStore.isValid && reqURL.pathname.includes("login")) {
    return new Response(null, {
      status: Status.SeeOther,
      headers: {
        Location: `/`,
      },
    });
  }

  ctx.state.data = pb;
  const resp = await ctx.next();

  // send back the default 'pb_auth' cookie to the client with the latest store state
  resp.headers.append("set-cookie", pb.authStore.exportToCookie());
  resp.headers.set("server", "fresh server");
  return resp;
}
