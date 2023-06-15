import { Dice } from "./Dice.tsx";

interface CardProps {
  entry: App.Entry;
}
export function Card({ entry }: CardProps) {
  return (
    <a href={entry.url.toString()} class="">
      <div class="relative h-[380px] max-w-1/3 bg-slate-500">
        <div class="absolute bg-red-500">
          <Dice
            side={entry.rating}
            className="w-16 h-16 text-white"
          />
        </div>
        <div class="absolute bottom-0 right-0 p-2 bg-black text-white uppercase">
          {entry.expand.type.name}
        </div>
        {entry.coverArt &&
          <img src={entry.coverArt} class="object-cover w-full h-full" />}
      </div>
      {entry.name}
    </a>
  );
}
