import { Head } from "$fresh/runtime.ts";
import { Author } from "../src/db/models/author.ts";

export default function Reviewers() {
  const authors = Author.getAll();

  return (
    <>
      <Head>
        <title>Reviewers - Filmpolitiet API</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <h1 class="text-4xl font-semibold my-6">
          Filmpolitiet's reviewers
        </h1>
        {authors.length === 0 &&
          <p class="">No results. Check back later.</p>}
        {authors.length > 0 && (
          <ul class="columns-2 space-y-2 mb-4 list-disc pl-5">
            {authors.map((author) => (
              <li>
                <a href={`/reviews?author=${author.id}`} class="underline">
                  {author.fullName}
                </a>{" "}
                ({author.count})
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
