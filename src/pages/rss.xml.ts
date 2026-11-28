import type { APIContext } from "astro";
import { branches, ladder } from "../lib/entries";

const changed = (e: { data: { published?: Date; updated?: Date } }) => e.data.updated ?? e.data.published!;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Published entries and branches, most recently changed first. An entry that grows reappears with its new date. Written by hand, so the site needs no RSS package. */
export async function GET(context: APIContext) {
  const home = new URL(import.meta.env.BASE_URL, context.site).href.replace(/\/?$/, "/");
  const tiers = await ladder();
  const name = new Map(tiers.map((e) => [e.id, e.data.name]));
  const all = [
    ...tiers.map((e) => ({ id: e.id, data: e.data, title: e.data.name })),
    ...[...(await branches())].flatMap(([tier, list]) =>
      list.map((b) => ({ id: b.id, data: b.data, title: `${b.data.name} · ${name.get(tier)}` })),
    ),
  ];
  const items = all
    .filter((e) => e.data.status === "published" && e.data.published)
    .sort((a, b) => changed(b).getTime() - changed(a).getTime())
    .map((e) => {
      const link = `${home}${e.id}/`;
      return `<item><title>${esc(e.title)}</title><link>${link}</link><guid isPermaLink="false">${link}#${changed(e).toISOString().slice(0, 10)}</guid><pubDate>${changed(e).toUTCString()}</pubDate><description>${esc(e.data.line)}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Becoming</title><link>${home}</link><description>The universe becoming, told tier by tier from Α to Ω.</description><language>en</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
