<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Presentation architecture
- Keep the imported presentation in a single typed slide registry with source file and original slide number, so content integrity can be audited independently of its rendering.
- Render all slide contexts through one 1920 × 1080 `ScaledSlide` and centralized `--slide-*` design tokens, so thumbnails, presentation and print share the same layout.
- Keep this presentation browser-only with no account or persistence service; its requested scope is viewing immutable uploaded content.
- Store extracted original figures through Lovable Assets pointers and keep import/conversion scripts outside the project, so binary media does not inflate source history.
- Derive chapter order and connections in the typed registry without mutating source data, so reordering remains auditable.
- Define each original slide's topic/subtopic hierarchy and composition in the source-indexed slide-design registry; never infer hierarchy from text length, so semantic decisions remain auditable without altering content.
- Use container-measured fitting for connected original diagrams and explicit gallery/paired compositions for independent figures, so source relationships and image proportions survive every viewing context.
- Show algorithm and use lists as independent framed boards, never as paired rows, because original slides do not establish algorithm-to-use mappings.
- Keep approved removals and BI text amendments explicit in the typed registry, separate from imported source files, and derive chapter bounds from source IDs so numbering remains correct when a cover or omission changes the deck.
- Mark user-requested replacement slides as added content and insert them at stable source-ID boundaries, so imported originals remain independently auditable after numbering changes.
- Import slides from a fourth source into their own typed registry, carrying that file's name and slide number, so the three original decks stay auditable and the added block can be removed in one place.
- Keep authored slide text out of the imported block and mark it with no source, so the only non-imported wording in the deck is identifiable.
- Render slide-level interactive controls only when the slide is on the stage; thumbnails and the print sheet wrap slides in a button, where nested interactive elements break hydration.
- List every title, body and destination change to an imported slide in one amendment registry, and make the integrity tests assert the originals match the source except for what is registered.
- Distinguish `interactive` (hover and click controls) from `linkable` (anchors are legal here): thumbnails and the overview wrap slides in a button, while the stage and the print sheet do not.
- Place authored BI material before the SAD definition it underpins, and give the closing slides their own section so the chapter footer does not claim them.
