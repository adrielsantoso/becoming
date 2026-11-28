import { getCollection, type CollectionEntry } from "astro:content";

export type Entry = CollectionEntry<"entries">;
export type Branch = CollectionEntry<"branches">;

/** Published entries and branches always; drafts only on the local dev server. */
export const shown = (e: Entry | Branch) =>
  e.data.status === "published" || (import.meta.env.DEV && e.data.status === "draft");

/** Every entry, Α first. */
export async function ladder(): Promise<Entry[]> {
  return (await getCollection("entries")).sort((a, b) => a.data.order - b.data.order);
}

/** The tier a branch grows from: the folder it sits in. */
export const tierOf = (b: Branch) => b.id.split("/")[0];

/** Every branch, grouped by tier id and in order along it. */
export async function branches(): Promise<Map<string, Branch[]>> {
  const tiers = new Set((await ladder()).map((e) => e.id));
  const byTier = new Map<string, Branch[]>();
  for (const b of await getCollection("branches")) {
    const tier = tierOf(b);
    if (!tiers.has(tier)) throw new Error(`branch ${b.id} is not in a tier's folder`);
    if (b.data.leftMarkOn.some((m) => m.id === tier)) throw new Error(`branch ${b.id} marks its own tier`);
    byTier.set(tier, [...(byTier.get(tier) ?? []), b]);
  }
  for (const list of byTier.values()) list.sort((a, b) => a.data.order - b.data.order);
  return byTier;
}

/** A path inside the site, under its base. */
export const url = (path = "") => `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path}`;
