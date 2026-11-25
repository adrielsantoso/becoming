import { getCollection, type CollectionEntry } from "astro:content";

export type Entry = CollectionEntry<"entries">;

/** Published entries always; drafts only on the local dev server. */
export const shown = (e: Entry) =>
  e.data.status === "published" || (import.meta.env.DEV && e.data.status === "draft");

/** Every entry, Α first. */
export async function ladder(): Promise<Entry[]> {
  return (await getCollection("entries")).sort((a, b) => a.data.order - b.data.order);
}

/** A path inside the site, under its base. */
export const url = (path = "") => `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path}`;
