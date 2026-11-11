"""Refresh the catalogue from AEG's Faction Links; validate it offline with --check."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import urljoin
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
WIKI = 'https://smashup-rulebook.alderac.com/wiki'
ALIASES = {'Superheroes': 'Super Heroes'}
RELATIONS = ('partners', 'counters', 'counterTargets')


class Elements(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.images = [], []
        self.link = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a':
            self.link = [attrs.get('href', ''), '']
        if tag == 'img':
            self.images.append(attrs)

    def handle_data(self, data):
        if self.link is not None:
            self.link[1] += data

    def handle_endtag(self, tag):
        if tag == 'a' and self.link is not None:
            self.links.append(self.link)
            self.link = None


def fetch(url):
    request = Request(url, headers={'User-Agent': 'SmashUpSynergies/1.0 (faction catalogue sync)'})
    with urlopen(request, timeout=45) as response:
        return response.read().decode('utf-8')


def read_data():
    text = (ROOT / 'data.js').read_text(encoding='utf-8')
    decoder = json.JSONDecoder()
    return [decoder.raw_decode(text.split(f'window.{key} = ', 1)[1])[0]
            for key in ('FACTION_DATA', 'FACTION_REFERENCE_DATA')]


def validate(groups, snapshot):
    records = [f for group in groups for f in group]
    names = [f['name'] for f in records]
    expected = {f['name'] for f in snapshot['factions']}
    assert len(names) == len(set(names)), 'Duplicate faction names'
    assert len({f['id'] for f in records}) == len(records), 'Duplicate faction IDs'
    assert expected <= set(names), f'Missing wiki factions: {expected - set(names)}'
    wiki_by_name = {f['name']: f for f in snapshot['factions']}
    for faction in records:
        if faction['name'] in expected:
            assert faction['officialUrl'] == wiki_by_name[faction['name']]['officialUrl']
            assert faction['imageUrl'] == wiki_by_name[faction['name']]['imageUrl']
        for relation in RELATIONS:
            assert set(faction[relation]) <= set(names), (faction['name'], relation)
    print(f'Validated: {len(names)} total factions including all {len(expected)} wiki factions, unique IDs, official links, artwork metadata, and no dangling relationships.')


def refresh():
    page = fetch(WIKI)
    section = page.split('id="Faction_Links"', 1)[1].split('id="Special_Decks"', 1)[0]
    parser = Elements()
    parser.feed(section)
    factions = [{'name': name.strip(), 'officialUrl': urljoin(WIKI, href)}
                for href, name in parser.links if href.startswith('/wiki/')]
    assert len(factions) >= 80, 'Unexpectedly short wiki list; refusing to overwrite data'
    assert len({f['name'] for f in factions}) == len(factions), 'Duplicate wiki entries'

    def artwork(faction):
        parser = Elements()
        parser.feed(fetch(faction['officialUrl']))
        covers = [image['src'] for image in parser.images
                  if 'CoverPhoto' in image.get('src', '')]
        faction['imageUrl'] = urljoin(WIKI, covers[0]) if covers else None
        return faction

    with ThreadPoolExecutor(max_workers=4) as pool:
        factions = list(pool.map(artwork, factions))
    snapshot = {'sourceUrl': WIKI, 'section': 'Faction Links',
                'checkedAt': datetime.now(timezone.utc).isoformat(), 'factions': factions}
    merge(read_data(), snapshot)


def merge(groups, snapshot):
    factions = snapshot['factions']
    old = {ALIASES.get(f['name'], f['name']): (index, f)
           for index, group in enumerate(groups) for f in group}
    output = [[], []]
    added = []
    wiki_by_name = {f['name']: f for f in factions}
    for name in sorted(set(old) | set(wiki_by_name)):
        entry = wiki_by_name.get(name, {'name': name})
        name = entry['name']
        if name in old:
            index, record = old[name]
            record = dict(record)
        else:
            index = 1
            record = {'id': re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-'),
                      'number': None, 'strengths': [], 'weaknesses': [],
                      'partners': [], 'counters': [], 'counterTargets': []}
            added.append(name)
        record.update(entry)
        record['inWikiCatalogue'] = name in wiki_by_name
        record['classification'] = 'classified' if index == 0 else 'not-yet-classified'
        for relation in RELATIONS:
            record[relation] = sorted({ALIASES.get(value, value) for value in record.get(relation, [])})
        output[index].append(record)
    validate(output, snapshot)
    for group in output:
        group.sort(key=lambda f: f['name'].casefold())
    data = '\n'.join(f'window.{key} = {json.dumps(group, ensure_ascii=False, indent=2)};'
                     for key, group in zip(('FACTION_DATA', 'FACTION_REFERENCE_DATA'), output)) + '\n'
    (ROOT / 'data.js').write_text(data, encoding='utf-8')
    (ROOT / 'wiki-catalogue.json').write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('Added:', ', '.join(added) or 'none')
    print('Cover images:', sum(bool(f['imageUrl']) for f in factions), '/', len(factions))


if __name__ == '__main__':
    args = argparse.ArgumentParser(description=__doc__)
    args.add_argument('--check', action='store_true', help='Validate against saved wiki snapshot without network access')
    if args.parse_args().check:
        validate(read_data(), json.loads((ROOT / 'wiki-catalogue.json').read_text(encoding='utf-8')))
    else:
        refresh()
