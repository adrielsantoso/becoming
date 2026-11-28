# Becoming

The universe becoming, told tier by tier from Α to Ω, grounded in what we know. Read it at https://adrielsantoso.github.io/becoming/.

- [ROADMAP.md](ROADMAP.md): the first milestone, the ladder, and what comes after.
- [GLOSSARY.md](GLOSSARY.md): the words the project uses.
- [QUESTIONS.md](QUESTIONS.md) and [READING.md](READING.md): the open questions and the reading list.
- [STUDY.md](STUDY.md): how entries are read for, written and revised.
- `src/content/entries/`: one Markdown file for each tier.
- `src/content/branches/`: one folder per tier, one Markdown file for each branch.
- `study/`: fact sheets, one folder per tier, with a subfolder for each branch.

## Commands

```bash
npm ci          # install
npm run dev     # the site at http://localhost:4321/becoming/, drafts included
npm run check   # the entry checks and a full build; must pass before a commit
```

A push to `main` publishes the site through GitHub Pages.
