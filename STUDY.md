# How an entry is made

Each month's entry is studied before it is written, using seven learning techniques, each placed where it helps. Claude prepares the material; I do the reading, the recall and all of the writing.

| Step | Technique | What happens | Who |
|---|---|---|---|
| 1. Chunk | Chunking | The tier is split into chunks, one reading each, small enough for one sitting. They are listed in the fact sheet. | Claude |
| 2. Ask | SQ3R: Survey, Question | Survey each chunk's summary in the fact sheet, then turn the seven parts of an entry into questions about this tier. | Me |
| 3. Read | SQ3R: Read | Read or watch one chunk at a time, hunting for answers to the questions. | Me |
| 4. Recall | Active recall, SQ3R: Recite | After each chunk, close it and answer its recall questions from memory before checking. | Me |
| 5. Explain | Feynman technique | With every source closed, draft the entry in plain words. Claude fact-checks it and marks where I got stuck or wrong, without rewriting it. I relearn those parts and draft again. | Me, then Claude |
| 6. Connect | Mapping connections | Fill in Questions moved, and link the entry to the tiers above and below it and to the open questions. The ladder and the Open questions page are the public map. | Me |
| 7. Keep | Flashcards, spaced repetition | The hard facts (names, numbers, definitions) are flashcards in `study/<tier>/cards.tsv`. Import them into Anki, which schedules the reviews. Before publishing, review the tier's cards once more. | Claude makes, I review |

## Files

- `study/<tier>/facts.md`: the fact sheet. Chunks, questions, cited facts marked Established or Contested, recall questions, connections, and anything not yet verified.
- `study/<tier>/cards.tsv`: flashcards, one per line as `front<TAB>back`. In Anki: File, Import, with "Fields separated by: Tab".

## A month, roughly

- **Week 1:** steps 1 and 2, and the first chunks.
- **Week 2:** the remaining chunks, with recall after each.
- **Week 3:** draft from memory, fact-check, relearn.
- **Week 4:** second draft, connections, card review, publish.

Fact sheets are study notes, not entries. Only claims from Sources that were actually opened go in, each with where in the Source it is.
