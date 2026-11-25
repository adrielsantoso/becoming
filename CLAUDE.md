# Becoming

A public site that tells the universe's story tier by tier, from Α to Ω. Read [GLOSSARY.md](GLOSSARY.md) first and use its words in code, docs and commits. [ROADMAP.md](ROADMAP.md) has the current milestone.

## Who does what

- **The owner writes every entry.** Never write or rewrite an entry's prose, even when asked to "fix" it; point out the problem and suggest, and let the owner write.
- **Claude supplies:** cited fact sheets for an entry, fact-checks of drafts, diagrams, and the site, CI and checks.
- Ask before changing `GLOSSARY.md`, the seven parts of an entry, the open questions' numbering, or the licences.

## Rules that must not break

1. **Every claim cites a Source the owner opened.** A fact sheet lists only Sources that were actually opened, with where in them the claim is.
2. **Three kinds of claim, never blurred.** Plain text is Established. A Contested claim is a blockquote starting `[!contested]`, naming who disagrees. The owner's reading goes only under `## Stance`.
3. **Seven parts, in order, in every entry:** The image, Arising, What's new, Contested, Stance, Questions moved, Sources.
4. **No third-party requests and no tracking.** Fonts are self-hosted. The built site sets a Content Security Policy that allows only its own files.
5. **No em dashes in prose.**
6. **Diagrams, not fake photos.** No AI-generated image may pass as a photograph.

## Entries

`src/content/entries/<tier>.md`, with `status` set to `idea`, `draft` (only `npm run dev` shows it) or `published` (needs a `published` date). Publishing an entry also means updating the "Moved by" list in `QUESTIONS.md` and the table in `ROADMAP.md`.

## Commands

`npm run check` runs the entry checks in `tests/` and a full build. It must pass before every commit.

## Commits

Conventional Commits: `type(scope): summary`, lower case, no full stop. Types: `feat`, `fix`, `docs`, `test`, `ci`, `chore`, and `entry` for an entry's text, for example `entry(alpha): publish`. Push directly to main.
