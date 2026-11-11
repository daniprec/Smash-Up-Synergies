"""Collect wiki mechanics for editorial tagging; never assigns tags automatically."""
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from sync_wiki import fetch

ROOT = Path(__file__).resolve().parents[1]

class Text(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
    def handle_data(self, value):
        self.parts.append(value)

def section(html, name):
    marker = f'id="{name}"'
    if marker not in html:
        return ''
    after = re.split(r'</h[1-6]>', html.split(marker,1)[1], maxsplit=1)[1]
    fragment = re.split(r'<h[1-6]\b', after, maxsplit=1)[0]
    parser = Text()
    parser.feed(fragment)
    return ' '.join(' '.join(parser.parts).split())

def review(faction):
    html = fetch(faction['officialUrl'])
    return {'name':faction['name'],'url':faction['officialUrl'],
            'mechanics':section(html,'Mechanics'),'strategy':section(html,'Strategy')[:900]}

if __name__ == '__main__':
    catalogue = json.loads((ROOT/'wiki-catalogue.json').read_text(encoding='utf-8'))
    with ThreadPoolExecutor(max_workers=4) as pool:
        evidence = list(pool.map(review,catalogue['factions']))
    (ROOT/'scripts/wiki-tag-workspace.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Collected {len(evidence)} wiki mechanics sections for editorial review.')
