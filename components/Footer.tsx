import { CHANGELOG_URL, VERSION } from "../constants.ts";

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
          <a href={CHANGELOG_URL} target="_blank" class="underline">
            {VERSION}
          </a>
        </div>
      </div>
    </footer>
  );
}
