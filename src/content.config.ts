import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One entry for each tier of the ladder. See GLOSSARY.md.
const entries = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/entries" }),
  schema: z
    .object({
      title: z.string(),
      name: z.string(),
      order: z.number().int().min(1).max(6),
      line: z.string(),
      openEnded: z.boolean().default(false),
      // idea: not written yet. draft: shown only by `npm run dev`.
      // published: on the site. Entries grow: `updated` records the latest revision.
      status: z.enum(["idea", "draft", "published"]),
      published: z.coerce.date().optional(),
      updated: z.coerce.date().optional(),
      readings: z.array(z.string()).default([]),
    })
    .refine((e) => e.status !== "published" || e.published, {
      message: "a published entry needs its published date",
    })
    .refine((e) => !e.updated || (e.published && e.updated >= e.published), {
      message: "updated must be on or after published",
    }),
});

export const collections = { entries };
