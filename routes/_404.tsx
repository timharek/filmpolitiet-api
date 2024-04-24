import { Head } from "$fresh/runtime.ts";

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Not found - Filmpolitiet API</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <article class="space-y-2">
          <h1 class="text-3xl font-semibold">404 Not found</h1>
          <p>The page doesn't exist.</p>
        </article>
      </div>
    </>
  );
}
