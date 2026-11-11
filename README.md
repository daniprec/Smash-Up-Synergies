# Smash Up Faction Atlas

Open `index.html` in a modern browser. It is a static site suitable for GitHub Pages. The graph works without a server; official-page and attribution links require internet access.

## Controls

- Click a faction to highlight its relationships and open its information panel.
- Black/white edges show bidirectional recommended pairings. Red arrows point from the countering faction toward the faction it counters.
- Drag nodes to rearrange them.
- Drag empty space to pan and use the mouse wheel to zoom.
- On phones and narrow screens (850px and below), browse a sortable list instead of the graph. Tap a faction to open the same information panel; Back to factions restores your search, sort order, and list position.
- Search filters faction names as you type, ignoring case. On desktop, only matching nodes and connections between them remain visible. Press Enter on an exact name to open its details.
- Search suggestions autocomplete faction names.
- Use the Pairs and Counters buttons to show either relationship type independently.
- Use **Sort By** to choose Alphabetically (default), Overall ranking (best rank first, with unranked factions last), Synergies, Countered by, or They counter (highest counts first). All 106 factions remain in the list. Missing counts are zero, and ties are alphabetical. On desktop, changing Sort By opens the ordered list beside the graph; search filters both. Reset view restores alphabetical order and clears search.
- Card factions link to their AEG Smash Up Rulebook page when one exists. Licensed factions without an official page are identified in the detail panel.
- Smaller gray nodes and list captions marked **Not yet classified** indicate factions without a complete analysis. Existing connections are retained; missing analysis is not treated as a zero rating.
- Category and expansion tags are not yet present in the dataset; search currently matches names.

## Updating the data

`data.js` combines locally held analysis with official wiki metadata. Faction cover artwork is loaded from the wiki; no image files are bundled in the site.

Faction records are kept together in the generated `data.js` dataset instead of one file per node. For this small static graph, a single validated dataset prevents spelling variants and duplicated relationship nodes, keeps reciprocal-pair normalization deterministic, and avoids dozens of extra browser requests.

The catalogue includes every faction in the official wiki's **Faction Links**, plus all existing Disney, Marvel, and other factions. Special decks are not factions. `wiki-catalogue.json` records the wiki list, links, cover images, and retrieval date. The initial sync added **G.I. Gerald, Geeks, and Robots**, producing **106 factions**, including all **90** in the wiki index. “Superheroes” is displayed as the wiki's “Super Heroes”; its existing relationships are preserved.

Run `python scripts/sync_wiki.py` to refresh the official list and image links. This merges additions and preserves existing factions and analysis, including factions outside the wiki index. It does not invent synergy analysis. Run `python scripts/sync_wiki.py --check` for an offline check of wiki coverage, links, artwork metadata, duplicate names/IDs, and relationship targets.

## Attribution

The faction strengths, weaknesses, pair recommendations, and counters are sourced from and credited to the [Use The Fours Podcast YouTube channel](https://www.youtube.com/@UseTheFoursPodcast). Smash Up is a trademark of Alderac Entertainment Group. This independent fan project is not affiliated with or endorsed by AEG.

The official faction index, page links, and linked cover artwork come from the [AEG Smash Up Rulebook wiki](https://smashup-rulebook.alderac.com/wiki).
