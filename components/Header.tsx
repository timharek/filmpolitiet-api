export function Header() {
  const links = [
    {
      name: "Entries",
      path: "/entries",
    },
    {
      name: "Reviewers",
      path: "/reviewers",
    },
    {
      name: "Docs",
      path: "/docs",
    },
  ];
  return (
    <header class="bg-lime-500">
      <div class="max-w-screen-md mx-auto px-4 py-8 flex justify-between">
        <a href="/" class="text-lg font-semibold">
          Unoffical API for Filmpolitiet
        </a>
        <ul class="flex gap-4">
          {links.map((link) => (
            <li>
              <a href={link.path} class="underline">{link.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
