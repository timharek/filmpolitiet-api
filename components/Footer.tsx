import config from "../deno.json" assert { type: "json" };

export function Footer() {
  return (
    <footer class="bg-lime-200">
      <div class="max-w-screen-md mx-auto px-4 py-6">
        <div class="flex justify-between items-center gap-4 flex-wrap">
          <div>
            Made by{"  "}
            <a href="https://timharek.no" target="_blank" class="underline">
              Tim Hårek
            </a>
          </div>
          <a href={config.changelog} target="_blank" class="underline">
            v{config.version}
          </a>
        </div>
      </div>
    </footer>
  );
}
