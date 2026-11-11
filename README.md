# Smash Up Faction Atlas

Open `index.html` in a modern browser. It is a static site suitable for GitHub Pages. The graph works without a server; official-page and attribution links require internet access.

## Controls

- Click a faction to highlight its relationships and open its information panel. Click a pairing or counter chip to read its explanation, open the timestamped podcast source, or choose View faction to navigate. Escape, the close button, or the backdrop closes the dialogue.
- Black/white edges show bidirectional recommended pairings. Red arrows point from the countering faction toward the faction it counters.
- Drag nodes to rearrange them.
- Drag empty space to pan and use the mouse wheel to zoom.
- On phones and narrow screens (850px and below), browse a sortable list instead of the graph. Tap a faction to open the same information panel; Back to factions restores your search, sort order, and list position.
- Search filters faction names and playstyle tags as you type, ignoring case and punctuation. Try Swarm, Movement, play on base, or a combination such as “inca base”. On desktop, only matching nodes and connections between them remain visible. Press Enter on an exact faction name to open its details.
- Search suggestions autocomplete faction names.
- Use the Pairs and Counters buttons to show either relationship type independently.
- Use **Sort By** to choose Alphabetically (default), Overall ranking (best rank first, with unranked factions last), Synergies, Countered by, or They counter (highest counts first). All 106 factions remain in the list. Missing counts are zero, and ties are alphabetical. On desktop, changing Sort By opens the ordered list beside the graph; search filters both. Reset view restores alphabetical order and clears search.
- Card factions link to their AEG Smash Up Rulebook page when one exists. Licensed factions without an official page are identified in the detail panel.
- Smaller gray nodes and list captions marked **Not yet classified** indicate factions without a complete analysis. Existing connections are retained; missing analysis is not treated as a zero rating.
- Faction details show clickable playstyle tags. Clicking one returns to the list and shows all factions with that exact tag, preserving your sort order. The search field shows `tag:Play-on-base actions`, for example; clear it or use Reset view to browse everything again. Theme and expansion filters are not yet included.
- Analysis follows the podcast's 2026 two-player context, including rebalanced factions and Titans where applicable. Results may differ with older cards or without Titans.

## Relationship explanations

`relationship-data.js` contains an initial **116** short, original paraphrases drawn from all **eight** matching 2026 two-player tier-list episodes on Use The Fours. Other channel uploads (league reports, custom factions, showcase games, and the Munchkin overview) are excluded. Every summary has a timestamped source and optional version or matchup qualifications. These are summaries of auto-generated captions, not verbatim transcripts or independent rules rulings. Episode review is marked **partial**: a missing explanation is explicitly shown as pending rather than filled with a guessed reason.

`relationship-model.js` owns canonical relationship keys. A pairing has one shared record regardless of which faction is opened. A counter has a directed record from the countering faction to its target, shared between Countered by and Counter of. All original relationships and every faction are retained. Explicit, named recommendations from the captions can add connections, and runtime lists and the graph are derived from the same records.

The **12** editorial TODOs in `relationship-data.js` retain broader archetype suggestions, source timestamps, and proposed tags. They appear under Pairings to explore on the relevant faction and do not create graph edges. Speculative combinations and recommendations limited to another player count remain TODOs until reviewed. Adding tags does not automatically resolve these TODOs or create new pairings.

Run `node --test tests/relationships.test.cjs` to validate reciprocity, counter direction, original-data preservation, source coverage, and separation of TODOs from confirmed connections. `scripts/review_transcripts.py` helps inspect discussion windows from local caption exports; its local `transcript-workspace.json` manifest is ignored, and full transcripts are not shipped with the website.

## Playstyle tags and pending explanations

`tag-data.js` defines **42** tags and curated assignments for all **106** factions. These describe defining mechanics rather than every incidental card. Source links accompany each faction's tags. The official wiki's Mechanics and current card text are the main basis, supplemented by existing podcast analysis and the community wiki for licensed factions outside the official index. Assignments are editorial summaries, not an official classification or a guarantee of synergy. `scripts/review_wiki_tags.py` can collect mechanics for a new review; it never assigns tags automatically and its working extract is ignored.

`tag-model.js` owns tag search and clearly labeled fallback context. Existing podcast explanations always take priority. For a recorded pairing still awaiting commentary, shared tags can describe common mechanics, with an explicit note that the specific synergy has not been summarized. Unrelated counters do not receive this shared-tag text. A specific, sourced rule supplies Eliza's **one extra card per turn** restriction for existing Princesses counters against Swarm or Extra actions factions. This is card-and-tag context, not a claimed podcast summary. No tags create new graph edges.

Run `node --test tests/relationships.test.cjs tests/tags.test.cjs` to validate tag coverage, search aliases, exact tag filtering, reciprocal context, explanation priority, and directional Eliza context.

## Updating the data

`data.js` combines locally held analysis with official wiki metadata. Faction cover artwork is loaded from the wiki; no image files are bundled in the site.

Faction records are kept together in the generated `data.js` dataset instead of one file per node. For this small static graph, a single validated dataset prevents spelling variants and duplicated relationship nodes, keeps reciprocal-pair normalization deterministic, and avoids dozens of extra browser requests.

The catalogue includes every faction in the official wiki's **Faction Links**, plus all existing Disney, Marvel, and other factions. Special decks are not factions. `wiki-catalogue.json` records the wiki list, links, cover images, and retrieval date. The initial sync added **G.I. Gerald, Geeks, and Robots**, producing **106 factions**, including all **90** in the wiki index. “Superheroes” is displayed as the wiki's “Super Heroes”; its existing relationships are preserved.

Run `python scripts/sync_wiki.py` to refresh the official list and image links. This merges additions and preserves existing factions and analysis, including factions outside the wiki index. It does not invent synergy analysis. Run `python scripts/sync_wiki.py --check` for an offline check of wiki coverage, links, artwork metadata, duplicate names/IDs, and relationship targets.

## Attribution

The faction strengths, weaknesses, pair recommendations, and counters are sourced from and credited to the [Use The Fours Podcast YouTube channel](https://www.youtube.com/@UseTheFoursPodcast). Smash Up is a trademark of Alderac Entertainment Group. This independent fan project is not affiliated with or endorsed by AEG.

The official faction index, page links, and linked cover artwork come from the [AEG Smash Up Rulebook wiki](https://smashup-rulebook.alderac.com/wiki).
