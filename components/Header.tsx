export function Header() {
  const links = [
    {
      name: "Reviews",
      path: "/reviews",
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
    <header class="">
      <div class="max-w-screen-md mx-auto px-4 py-8 flex justify-between">
        <a href="/" class="text-lg font-semibold">
          🍿 Filmpolitiet API
        </a>
        <ul class="flex gap-4">
          {links.map((link) => (
            <li>
              <a href={link.path} class="underline font-semibold">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
