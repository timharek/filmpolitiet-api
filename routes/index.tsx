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
          Welcome to Filmpolitiets unofficial API.
        </p>
        <p class="my-6">
          This is currently a work in progress. There are probably some holes in
          the dateset from Filmpolitiets official archive.
        </p>
        <p class="my-6">
          This application checks their official RSS-feed every 5 minutes.
        </p>
        <p class="my-6">
          Want to contribute? Check out the
          <a href="https://sr.ht/~timharek/filmpolitiet-api/">source code</a>
          and our
          <a href="https://todo.sr.ht/~timharek/filmpolitiet-api">
            issue-tracker
          </a>.
        </p>
      </div>
    </>
  );
}
