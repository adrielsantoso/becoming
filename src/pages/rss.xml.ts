import type { APIContext } from "astro";
import { ladder } from "../lib/entries";

const changed = (e: { data: { published?: Date; updated?: Date } }) => e.data.updated ?? e.data.published!;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Published entries, most recently changed first. An entry that grows reappears with its new date. Written by hand, so the site needs no RSS package. */
export async function GET(context: APIContext) {
  const home = new URL(import.meta.env.BASE_URL, context.site).href.replace(/\/?$/, "/");
  const items = (await ladder())
    .filter((e) => e.data.status === "published" && e.data.published)
    .sort((a, b) => changed(b).getTime() - changed(a).getTime())
    .map((e) => {
      const link = `${home}${e.id}/`;
      return `<item><title>${esc(e.data.name)}</title><link>${link}</link><guid isPermaLink="false">${link}#${changed(e).toISOString().slice(0, 10)}</guid><pubDate>${changed(e).toUTCString()}</pubDate><description>${esc(e.data.line)}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Becoming</title><link>${home}</link><description>The universe becoming, told tier by tier from Α to Ω.</description><language>en</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
