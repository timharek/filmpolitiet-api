import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Filmpolitiet API</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <h1 class="text-4xl font-semibold my-6">
          Filmpolitiets unofficial API
        </h1>
        <p class="my-6">
          Welcome to Filmpolitiets unofficial API. You can checkout what's been
          cached <a class="underline" href="/entries">here</a>.
        </p>
        <p class="my-6">
          Currently a work in progress, here be dragons.
        </p>
      </div>
    </>
  );
}
