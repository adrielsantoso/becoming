// Checks that every entry keeps its shape and the repo keeps its rules.
// The build checks each entry's front matter against src/content.config.ts.

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { marks } from "../src/lib/marks.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const DIR = join(ROOT, "src/content/entries");
const PARTS = ["The image", "Arising", "What's new", "Contested", "Stance", "Questions moved", "Sources"];
const TIERS = ["alpha", "matter", "life", "mind", "culture", "omega"];

const entries = readdirSync(DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const raw = readFileSync(join(DIR, f), "utf8");
    const [, front, body] = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];
    assert.ok(front, `${f} has no front matter`);
    const field = (k) => front.match(new RegExp(`^${k}: *"?([^"\\n]*)"?$`, "m"))?.[1];
    return { id: f.replace(/\.md$/, ""), body, order: Number(field("order")), status: field("status") };
  });

/** The body split into its h2 parts, by heading. */
const parts = (body) =>
  Object.fromEntries(
    body.split(/^## /m).slice(1).map((p) => {
      const [head, ...rest] = p.split("\n");
      return [head.trim(), rest.join("\n").trim()];
    }),
  );

test("one entry for each of the six tiers, in ladder order", () => {
  const byOrder = [...entries].sort((a, b) => a.order - b.order);
  assert.deepEqual(byOrder.map((e) => e.id), TIERS);
  assert.deepEqual(byOrder.map((e) => e.order), [1, 2, 3, 4, 5, 6]);
});

test("every entry has the seven parts, in order, and nothing else at that level", () => {
  for (const e of entries) {
    const heads = [...e.body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
    assert.deepEqual(heads, PARTS, `${e.id}: parts`);
  }
});

test("a published entry fills every part and cites at least one Source", () => {
  for (const e of entries.filter((e) => e.status === "published")) {
    const p = parts(e.body);
    for (const part of PARTS) assert.ok(p[part], `${e.id}: ${part} is empty`);
    assert.match(p.Sources, /^\s*[-*\d]/m, `${e.id}: Sources must be a list`);
    assert.doesNotMatch(p.Contested, /^$/, `${e.id}: Contested is empty`);
  }
});

test("a Contested claim is never placed under Stance", () => {
  for (const e of entries) {
    assert.doesNotMatch(parts(e.body).Stance ?? "", /\[!contested\]/i, `${e.id}: Contested inside Stance`);
  }
});

test("no em dashes in the writing", () => {
  const files = [
    ...readdirSync(ROOT).filter((f) => f.endsWith(".md")),
    ...readdirSync(DIR).map((f) => join("src/content/entries", f)),
    ...readdirSync(join(ROOT, "study"), { recursive: true })
      .filter((f) => f.endsWith(".md"))
      .map((f) => join("study", f)),
  ];
  for (const f of files) {
    assert.ok(!readFileSync(join(ROOT, f), "utf8").includes("—"), `em dash in ${f}`);
  }
});

test("every flashcard has a front and a back", () => {
  const files = readdirSync(join(ROOT, "study"), { recursive: true }).filter((f) => f.endsWith(".tsv"));
  for (const f of files) {
    readFileSync(join(ROOT, "study", f), "utf8")
      .split("\n")
      .filter((line) => line && !line.startsWith("#"))
      .forEach((line, i) => assert.equal(line.split("\t").length, 2, `${f}:${i + 1}`));
  }
});

test("the marks plugin turns [!contested] into an aside and wraps the Stance", () => {
  const p = (v) => ({ type: "element", tagName: "p", properties: {}, children: [{ type: "text", value: v }] });
  const h2 = (v) => ({ type: "element", tagName: "h2", properties: {}, children: [{ type: "text", value: v }] });
  const tree = {
    type: "root",
    children: [
      { type: "element", tagName: "blockquote", properties: {}, children: [p("[!contested] Becoming is real.")] },
      { type: "element", tagName: "blockquote", properties: {}, children: [p("A plain quote.")] },
      h2("Stance"),
      p("My reading."),
      h2("Questions moved"),
    ],
  };
  marks()(tree);
  const [aside, quote, stance, next] = tree.children;
  assert.equal(aside.tagName, "aside");
  assert.deepEqual(aside.properties.className, ["contested"]);
  assert.equal(aside.children[1].children[0].value, "Becoming is real.");
  assert.equal(quote.tagName, "blockquote");
  assert.equal(stance.tagName, "section");
  assert.equal(stance.children.length, 2);
  assert.equal(next.tagName, "h2");
});
