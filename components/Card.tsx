import { Review } from "../src/db/models/review.ts";
import { Dice } from "./Dice.tsx";

type CardProps = {
  review: Review;
};
const typeMap = {
  movie: "🎬 Movie",
  show: "📺 TV",
  game: "🎮 Game",
};
export function Card({ review }: CardProps) {
  const reviewDate = review.reviewDate;
  return (
    <div>
      <a
        href={review.url.toString()}
        class="block group relative h-[380px] max-w-1/3 bg-slate-500 overflow-hidden rounded"
      >
        <div class="absolute z-20 bg-red-500 rounded">
          <Dice
            side={review.rating}
            className="w-16 h-16 text-white"
          />
        </div>
        <div class="absolute z-20 top-0 right-0 px-2 py-1 bg-primary text-black uppercase font-semibold rounded-bl">
          {typeMap[review.type as keyof typeof typeMap]}
        </div>
        {review.coverArtUrl &&
          (
            <img
              src={review.coverArtUrl.toString()}
              class="group-hover:scale-105 object-cover w-full h-full transition-all"
              alt=""
            />
          )}
      </a>
      <h2 class="font-semibold select-all">{review.title}</h2>
      <time dateTime={reviewDate.toISOString()} class="italic">
        Reviewed: {reviewDate.toISOString().split("T")[0]}
      </time>
      <p class="">
        Author: <span class="select-all">{review.author.fullName}</span>
      </p>
    </div>
  );
}
