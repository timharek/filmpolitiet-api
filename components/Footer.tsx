import config from "../deno.json" with { type: "json" };

const links = [
  {
    title: "RSS",
    url: "/feed.xml",
  },
  {
    title: `v${config.version}`,
    url: config.changelog,
  },
];
export function Footer() {
  return (
    <footer class="">
      <div class="max-w-screen-md mx-auto px-4 py-6">
        <div class="flex justify-between items-center gap-4 flex-wrap">
          <a
            href="https://timharek.no"
            target="_blank"
            class="underline"
            title="Made by Tim Hårek"
          >
            <span class="sr-only">Made by Tim Hårek</span>
            <img src="https://timharek.no/.well-known/logo" width="50" />
          </a>
          <ul class="flex items-center gap-4">
            {links.map((link) => (
              <li>
                <a class="underline" target="_blank" href={link.url}>
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
