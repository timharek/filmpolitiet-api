import { decompress } from "https://deno.land/x/zip@v1.2.5/mod.ts";

async function downloadPocketBase() {
  const username = "pocketbase";
  const repository = "pocketbase";

  const isAarch64 = Deno.build.arch === "aarch64";

  const binaryName = isAarch64 ? "_arm64.zip" : `_${Deno.build.arch}.zip`;

  const response = await fetch(
    `https://api.github.com/repos/${username}/${repository}/releases/latest`,
  );
  const release = await response.json();
  const asset = release.assets.find((asset: { name: string }) =>
    asset.name.includes(binaryName)
  );

  if (!asset) {
    console.error(`Could not find binary for architecture: ${Deno.build.arch}`);
    Deno.exit(1);
  }

  const binaryUrl = asset.browser_download_url;
  const binaryResponse = await fetch(binaryUrl);
  const binary = await binaryResponse.arrayBuffer();
  const zipFilename = "pocketbase.zip";

  // Save the binary file to disk
  await Deno.writeFile(zipFilename, new Uint8Array(binary));

  // Extract the binary file from the zip archive
  const destDir = "pb";
  await decompress(zipFilename, destDir);

  // Delete the zip archive
  await Deno.remove(zipFilename);
}

await downloadPocketBase();
