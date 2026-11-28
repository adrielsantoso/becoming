// Checks that every entry keeps its shape and the repo keeps its rules.
// The build checks each entry's front matter against src/content.config.ts.

import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { marks } from "../src/lib/marks.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const DIR = join(ROOT, "src/content/entries");
const BRANCHES = join(ROOT, "src/content/branches");
const PARTS = ["The image", "Arising", "What's new", "Contested", "Stance", "Questions moved", "Sources"];
const TIERS = ["alpha", "matter", "life", "mind", "culture", "omega"];

/** An entry's id, body and the front matter fields the checks need. */
function read(path, id) {
  const raw = readFileSync(path, "utf8");
  const [, front, body] = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];
  assert.ok(front, `${id} has no front matter`);
  const field = (k) => front.match(new RegExp(`^${k}: *"?([^"\\n]*)"?$`, "m"))?.[1];
  // A list field, written either inline ([a, b]) or one "- item" per line.
  const list = (k) => {
    const inline = field(k);
    if (inline?.startsWith("[")) return inline.slice(1, -1).split(",").map((v) => v.trim().replace(/^"|"$/g, "")).filter(Boolean);
    const block = front.match(new RegExp(`^${k}:\\s*\\n((?:\\s+- .*\\n?)*)`, "m"))?.[1] ?? "";
    return [...block.matchAll(/- *"?([^"\n]*)"?/g)].map((m) => m[1].trim());
  };
  return { id, body, order: Number(field("order")), status: field("status"), leftMarkOn: list("leftMarkOn") };
}

const entries = readdirSync(DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => read(join(DIR, f), f.replace(/\.md$/, "")));

// Branches sit one folder down, in their tier's folder. Files at the top (the README) are not branches.
const branchFiles = existsSync(BRANCHES)
  ? readdirSync(BRANCHES, { recursive: true }).filter((f) => f.endsWith(".md") && f.includes("/"))
  : [];
const branches = branchFiles.map((f) => ({ ...read(join(BRANCHES, f), f.replace(/\.md$/, "")), tier: f.split("/")[0] }));

/** Tier entries and branches: both are entries with the seven parts. */
const all = [...entries, ...branches];

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
  for (const e of all) {
    const heads = [...e.body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
    assert.deepEqual(heads, PARTS, `${e.id}: parts`);
  }
});

test("a published entry fills every part and cites at least one Source", () => {
  for (const e of all.filter((e) => e.status === "published")) {
    const p = parts(e.body);
    for (const part of PARTS) assert.ok(p[part], `${e.id}: ${part} is empty`);
    assert.match(p.Sources, /^\s*[-*\d]/m, `${e.id}: Sources must be a list`);
    assert.doesNotMatch(p.Contested, /^$/, `${e.id}: Contested is empty`);
  }
});

test("a Contested claim is never placed under Stance", () => {
  for (const e of all) {
    assert.doesNotMatch(parts(e.body).Stance ?? "", /\[!contested\]/i, `${e.id}: Contested inside Stance`);
  }
});

test("every branch sits in one tier's folder, in its own place along it", () => {
  for (const b of branches) {
    assert.ok(TIERS.includes(b.tier), `${b.id}: ${b.tier} is not a tier`);
    assert.equal(b.id.split("/").length, 2, `${b.id}: a branch sits directly in its tier's folder`);
  }
  for (const tier of TIERS) {
    const orders = branches.filter((b) => b.tier === tier).map((b) => b.order);
    assert.equal(new Set(orders).size, orders.length, `${tier}: two branches share an order`);
  }
});

test("a branch leaves its mark only on other tiers", () => {
  for (const b of branches) {
    for (const m of b.leftMarkOn) {
      assert.ok(TIERS.includes(m), `${b.id}: ${m} is not a tier`);
      assert.notEqual(m, b.tier, `${b.id}: marks its own tier`);
    }
  }
});

test("a branch is published only once its tier is", () => {
  const status = Object.fromEntries(entries.map((e) => [e.id, e.status]));
  for (const b of branches.filter((b) => b.status === "published")) {
    assert.equal(status[b.tier], "published", `${b.id}: ${b.tier} is not published yet`);
  }
});

test("no em dashes in the writing", () => {
  const files = [
    ...readdirSync(ROOT).filter((f) => f.endsWith(".md")),
    ...readdirSync(DIR).map((f) => join("src/content/entries", f)),
    ...readdirSync(BRANCHES, { recursive: true })
      .filter((f) => f.endsWith(".md"))
      .map((f) => join("src/content/branches", f)),
    ...readdirSync(join(ROOT, "study"), { recursive: true })
      .filter((f) => f.endsWith(".md"))
      .map((f) => join("study", f)),
  ];
  for (const f of files) {
    assert.ok(!readFileSync(join(ROOT, f), "utf8").includes("—"), `em dash in ${f}`);
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
