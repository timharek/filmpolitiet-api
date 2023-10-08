import config from "../deno.json" assert { type: "json" };

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
          <a href={config.changelog} target="_blank" class="underline">
            v{config.version}
          </a>
        </div>
      </div>
    </footer>
  );
}
