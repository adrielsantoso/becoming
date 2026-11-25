import { unified } from "@astrojs/markdown-remark";
import { defineConfig } from "astro/config";
import { marks } from "./src/lib/marks.mjs";

export default defineConfig({
  site: "https://adrielsantoso.github.io",
  base: "/becoming",
  trailingSlash: "always",
  // Every stylesheet is a file, so the Content Security Policy can forbid
  // inline styles.
  build: { inlineStylesheets: "never" },
  // Fonts stay files too, never inlined as data: URIs the policy would block.
  vite: { build: { assetsInlineLimit: 0 } },
  markdown: { processor: unified({ rehypePlugins: [marks] }) },
});
