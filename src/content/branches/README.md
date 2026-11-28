# Branches

A branch grows sideways from one tier (see GLOSSARY.md). Each sits in its tier's folder, as `<tier>/<branch>.md`, and has the same seven parts as a tier's entry.

```markdown
---
name: "Stars"
order: 1
line: "One line, in the owner's words."
status: idea
leftMarkOn: [life]
readings: []
---

## The image

## Arising

## What's new

## Contested

## Stance

## Questions moved

## Sources
```

- `order` places the branch along its tier, from 1, with no two the same.
- `leftMarkOn` lists the other tiers this branch has left its mark on, by id (`alpha`, `matter`, `life`, `mind`, `culture`, `omega`). Leave it out if there are none.
- `status`, `published` and `updated` work as they do for a tier. A branch is published only once its tier is.

This file is not a branch: only files inside a tier's folder are.
