import PocketBase from "pb";
import { Handlers, Status } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/src/server/types.ts";
import { SITE_NAME } from "../constants.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const pb = ctx.state.data as PocketBase;
    const formData = await req.formData();
    try {
      await pb.collection("users").authWithPassword(
        formData.get("email"),
        formData.get("password"),
      );

      const url = new URL(req.url);

      if (url.searchParams.has("redirect")) {
        const redirectUrl = decodeURIComponent(
          url.searchParams.get("redirect") as string,
        );
        return new Response("", {
          status: Status.Found,
          headers: { Location: redirectUrl },
        });
      }
      return new Response("", {
        status: Status.SeeOther,
        headers: { Location: `/` },
      });
    } catch (error) {
      console.error(error);
      return ctx.render(`There was an error:\n${error}`);
    }
  },
};

export default function Login(props: PageProps) {
  const currentUrl = props.url.toString().replace(props.url.origin, "");
  const title = `Login - ${SITE_NAME}`;
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md space-y-4">
        <div class="flex justify-between items-center gap-8">
          <h1 class="text-2xl">Login</h1>
        </div>
        {props.data &&
          <p class="">{props.data}</p>}
        <form class="space-y-2" method="POST" action={currentUrl}>
          <div>
            <label class="flex gap-2">
              Username or e-mail
              <input type="text" name="email" autofocus />
            </label>
          </div>
          <div>
            <label class="flex gap-2">
              Password
              <input type="password" name="password" />
            </label>
          </div>
          <button type="submit">Log in</button>
        </form>
      </div>
    </>
  );
}
