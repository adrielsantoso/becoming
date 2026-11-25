import type { APIContext } from "astro";
import { ladder } from "../lib/entries";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Published entries, newest first. Written by hand, so the site needs no RSS package. */
export async function GET(context: APIContext) {
  const home = new URL(import.meta.env.BASE_URL, context.site).href.replace(/\/?$/, "/");
  const items = (await ladder())
    .filter((e) => e.data.status === "published" && e.data.published)
    .sort((a, b) => b.data.published!.getTime() - a.data.published!.getTime())
    .map((e) => {
      const link = `${home}${e.id}/`;
      return `<item><title>${esc(e.data.name)}</title><link>${link}</link><guid>${link}</guid><pubDate>${e.data.published!.toUTCString()}</pubDate><description>${esc(e.data.line)}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Becoming</title><link>${home}</link><description>The universe becoming, told tier by tier from Α to Ω.</description><language>en</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
