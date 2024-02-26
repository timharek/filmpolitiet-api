import { Head } from "$fresh/runtime.ts";
import { Handlers } from "$fresh/server.ts";
import { extract } from "$std/front_matter/toml.ts";
import { PageProps } from "$fresh/src/server/types.ts";
import { CSS, render } from "$gfm";
import "https://esm.sh/prismjs@1.29.0/components/prism-bash?no-check";

type Props = {
  body: string;
  attrs: Record<string, unknown>;
};
export const handler: Handlers<Props> = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug;

    const page = await getPage(slug);

    if (!page) {
      return await ctx.renderNotFound();
    }

    return await ctx.render(page);
  },
};

export default function Page({ data }: PageProps<Props>) {
  const title = data.attrs.title as string;
  return (
    <>
      <Head>
        <title>{title} - Filmpolitiet API</title>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <article
          data-color-mode="auto"
          data-light-theme="light"
          data-dark-theme="dark"
          class="markdown-body dark:(!bg-slate-900)"
        >
          <h1>{title}</h1>
          <div
            class=""
            dangerouslySetInnerHTML={{ __html: render(data?.body) }}
          />
        </article>
      </div>
    </>
  );
}

async function getPage(slug: string): Promise<Props | null> {
  try {
    const file = await Deno.readTextFile(
      new URL(`../docs/${slug}.md`, import.meta.url),
    );
    const { body, attrs } = extract(file);

    return { body, attrs };
  } catch (error) {
    console.error(error);
    return null;
  }
}
