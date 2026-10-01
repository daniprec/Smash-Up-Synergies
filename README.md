# Smash Up Faction Atlas

Open `index.html` in a modern browser. It is a static site suitable for GitHub Pages. The graph works without a server; official-page and attribution links require internet access.

## Controls

- Click a faction to highlight its relationships and open its information panel.
- Black/white edges show bidirectional recommended pairings. Red arrows point from the countering faction toward the faction it counters.
- Drag nodes to rearrange them.
- Drag empty space to pan and use the mouse wheel to zoom.
- Search by faction name; an exact match opens that faction.
- Search suggestions autocomplete faction names.
- Use the Pairs and Counters buttons to show either relationship type independently.
- Open Rankings to list card factions by total good-pair connections, counters against them, or card factions they counter.
- Card factions link to their AEG Smash Up Rulebook page when one exists. Licensed factions without an official page are identified in the detail panel.
- Smaller gray nodes are factions referenced by a card but not represented by their own image in this folder.

## Updating the data

`data.js` was generated from locally held source material, but the published website contains no card images.

Faction records are kept together in the generated `data.js` dataset instead of one file per node. For this small static graph, a single validated dataset prevents spelling variants and duplicated relationship nodes, keeps reciprocal-pair normalization deterministic, and avoids dozens of extra browser requests.

## Attribution

The faction strengths, weaknesses, pair recommendations, and counters are sourced from and credited to the [Use The Fours Podcast YouTube channel](https://www.youtube.com/@UseTheFoursPodcast). Smash Up is a trademark of Alderac Entertainment Group. This independent fan project is not affiliated with or endorsed by AEG.
