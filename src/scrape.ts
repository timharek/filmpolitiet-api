import "https://deno.land/std@0.191.0/dotenv/load.ts";
import PocketBase from "pb";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

export async function scrape(
  url: URL | string,
  rating = 1,
  inputType = "movie",
) {
  const pb = new PocketBase(Deno.env.get("PB_URL") || "http://127.0.0.1:8090");
  const username = Deno.env.get("PB_ADMIN_USERNAME")!;
  const password = Deno.env.get("PB_ADMIN_PASSWORD")!;
  await pb.admins.authWithPassword(username, password);
  console.log(pb.authStore.isValid);

  const site = await fetch(
    url,
  ).then((res) => res.text());
  const doc = new DOMParser().parseFromString(site, "text/html");

  if (doc) {
    const entries = doc.getElementsByTagName("article");

    for (const entry of entries) {
      const type = await pb.collection("type").getFirstListItem<App.Type>(
        `name="${inputType}"`,
      );
      const formData = new FormData();
      formData.set(
        "filmpolitietId",
        entry.attributes.getNamedItem("id")?.value as string,
      );
      formData.set(
        "name",
        entry.querySelector("header h2 a")?.textContent as string,
      );
      formData.set(
        "url",
        entry.querySelector("header h2 a")?.attributes.getNamedItem("href")
          ?.value as string,
      );
      formData.set("rating", String(rating));
      formData.set(
        "reviewDate",
        entry.querySelector("header time")?.attributes.getNamedItem("datetime")
          ?.value as string,
      );
      formData.set("type", type.id);
      try {
        await pb.collection("entry").create(formData);
      } catch (error) {
        try {
          console.error("could not create");
          const existingEntry = await pb.collection("entry").getFirstListItem<
            App.Entry
          >(`name="${formData.get("name")}"`);

          await pb.collection("entry").update(existingEntry.id, formData);
        } catch (error) {
          console.error("could not update");
        }
      }
    }
  }
}
