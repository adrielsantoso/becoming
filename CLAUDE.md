# Becoming

A public site that tells the universe's story tier by tier, from Α to Ω. Read [GLOSSARY.md](GLOSSARY.md) first and use its words in code, docs and commits. [ROADMAP.md](ROADMAP.md) has the current milestone.

## Who does what

- **The owner writes every entry.** Never write or rewrite an entry's prose, even when asked to "fix" it; point out the problem and suggest, and let the owner write.
- **Claude supplies:** cited fact sheets, fact-checks of drafts, diagrams, and the site, CI and checks.
- **The owner learns by reading and rethinking, not by drills.** No flashcards, quizzes or recall exercises unless asked. See [STUDY.md](STUDY.md). When fact-checking a draft, mark where it is wrong or thin and point to the fact sheet; never rewrite it.
- Ask before changing `GLOSSARY.md`, the seven parts of an entry, the open questions' numbering, or the licences.

## Rules that must not break

1. **Every claim cites a Source the owner opened.** A fact sheet lists only Sources that were actually opened, with where in them the claim is.
2. **Three kinds of claim, never blurred.** Plain text is Established. A Contested claim is a blockquote starting `[!contested]`, naming who disagrees. The owner's reading goes only under `## Stance`.
3. **Seven parts, in order, in every entry:** The image, Arising, What's new, Contested, Stance, Questions moved, Sources.
4. **No third-party requests and no tracking.** Fonts are self-hosted. The built site sets a Content Security Policy that allows only its own files.
5. **No em dashes in prose.**
6. **Diagrams, not fake photos.** No AI-generated image may pass as a photograph.

## Entries

`src/content/entries/<tier>.md` for a tier and `src/content/branches/<tier>/<branch>.md` for a branch, with `status` set to `idea`, `draft` (only `npm run dev` shows it) or `published` (needs a `published` date). Entries grow: when a published entry is revised, set `updated` to that day. Publishing an entry also means updating the "Moved by" list in `QUESTIONS.md`, and for a tier the table in `ROADMAP.md`. A branch has the same seven parts, belongs to one tier, and is published only once its tier is.

## Study files

`study/<tier>/facts.md` is the fact sheet, and `study/<tier>/<branch>/facts.md` a branch's. A fact sheet lists only Sources that were actually opened, says where in each Source a fact is, marks each fact E (Established) or C (Contested), and keeps a "Not yet verified" list. Its Detours section holds background the owner asked about while reading, one block per term, added only when asked, each checked against an opened Source.

## Commands

`npm run check` runs the entry checks in `tests/` and a full build. It must pass before every commit.

## Commits

Conventional Commits: `type(scope): summary`, lower case, no full stop. Types: `feat`, `fix`, `docs`, `test`, `ci`, `chore`, and `entry` for an entry's text, for example `entry(alpha): publish`. Push directly to main.
