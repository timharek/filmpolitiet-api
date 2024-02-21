import { Entry } from "../src/db/models/entry.ts";
import { Dice } from "./Dice.tsx";

interface CardProps {
  entry: Entry;
}
export function Card({ entry }: CardProps) {
  const reviewDate = entry.reviewDate;
  return (
    <div>
      <a
        href={entry.url.toString()}
        class="block group relative h-[380px] max-w-1/3 bg-slate-500 overflow-hidden rounded"
      >
        <div class="absolute z-20 bg-red-500 rounded">
          <Dice
            side={entry.rating}
            className="w-16 h-16 text-white"
          />
        </div>
        <div class="absolute z-20 top-0 right-0 px-2 py-1 bg-primary text-black uppercase font-semibold rounded-bl">
          {entry.type}
        </div>
        {entry.coverArtUrl &&
          (
            <img
              src={entry.coverArtUrl.toString()}
              class="group-hover:scale-105 object-cover w-full h-full transition-all"
              alt=""
            />
          )}
      </a>
      <h2 class="font-semibold select-all">{entry.title}</h2>
      <time dateTime={reviewDate.toISOString()} class="italic">
        Reviewed: {reviewDate.toISOString().split("T")[0]}
      </time>
      <p class="">
        Author: <span class="select-all">{entry.author.fullName}</span>
      </p>
    </div>
  );
}
