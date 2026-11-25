// Marks the two kinds of claim that are not plain cited fact (GLOSSARY.md).
//
// A Contested claim is written as a blockquote that starts with [!contested]:
//
//   > [!contested] Becoming may be real: ...
//
// and becomes <aside class="contested">. Plain text is Established.
// The "## Stance" heading and everything up to the next h2 become
// <section class="stance">, so the author's own reading stands apart.

const text = (node) =>
  node.type === "text" ? node.value : (node.children ?? []).map(text).join("");

const MARKER = /^\s*\[!contested\]\s*/i;

function contested(node) {
  if (node.type !== "element" || node.tagName !== "blockquote") return false;
  const first = node.children.find((c) => c.type === "element");
  const lead = first?.children?.[0];
  if (first?.tagName !== "p" || lead?.type !== "text" || !MARKER.test(lead.value)) return false;
  lead.value = lead.value.replace(MARKER, "");
  node.tagName = "aside";
  node.properties = { className: ["contested"] };
  node.children.unshift({
    type: "element",
    tagName: "p",
    properties: { className: ["mark"] },
    children: [{ type: "text", value: "Contested" }],
  });
  return true;
}

function walk(node) {
  for (const child of node.children ?? []) {
    if (!contested(child)) walk(child);
  }
}

function stance(tree) {
  const kids = tree.children;
  const start = kids.findIndex(
    (n) => n.type === "element" && n.tagName === "h2" && text(n).trim() === "Stance",
  );
  if (start < 0) return;
  let end = start + 1;
  while (end < kids.length && !(kids[end].type === "element" && kids[end].tagName === "h2")) end++;
  const section = {
    type: "element",
    tagName: "section",
    properties: { className: ["stance"] },
    children: kids.slice(start, end),
  };
  kids.splice(start, end - start, section);
}

export function marks() {
  return (tree) => {
    walk(tree);
    stance(tree);
  };
}
