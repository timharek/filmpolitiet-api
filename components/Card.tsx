interface CardProps {
  entry: App.Entry;
}
export function Card({ entry }: CardProps) {
  return (
    <a href={entry.url.toString()} class="">
      <div class="h-[200px] max-w-1/3 bg-slate-500"></div>
      {entry.name} ({entry.rating})
    </a>
  );
}
