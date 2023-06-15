interface CardProps {
  entry: App.Entry;
}
export function Card({ entry }: CardProps) {
  return (
    <a href={entry.url.toString()} class="">
      <div class="h-[380px] max-w-1/3 bg-slate-500">
        {entry.coverArt &&
          <img src={entry.coverArt} class="object-cover w-full h-full" />}
      </div>
      {entry.name} ({entry.rating})
    </a>
  );
}
