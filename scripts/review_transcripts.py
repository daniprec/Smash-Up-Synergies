"""Print timestamped discussion windows from locally exported YouTube captions.

The local transcript-workspace.json and full captions are intentionally not published.
Use the extracts for editorial review; they never generate relationship claims.
"""
import json
from pathlib import Path
import re
import sys

def seconds(value):
    result = 0
    for part in value.split(':'):
        result = result * 60 + int(part)
    return result

manifest = json.loads(Path(__file__).with_name('transcript-workspace.json').read_text(encoding='utf-8'))
entries = {entry['videoId']: entry for entry in manifest['exports']}
pattern = re.compile(r'partners|good partner|pair well|pairs well|synerg|countered by|counter list|counters (?:are|here|on|to)|base.modifier|play.on.base', re.I)

if __name__ == '__main__':
    for video_id in sys.argv[1:]:
        lines = []
        for line in Path(entries[video_id]['path']).read_text(encoding='utf-8').splitlines():
            match = re.match(r'\[([\d:]+)\] (.*)', line)
            if match:
                lines.append((seconds(match[1]), line))
        intervals = []
        for time, line in lines:
            if pattern.search(line):
                start, end = max(0, time - 12), time + 65
                if intervals and start <= intervals[-1][1]:
                    intervals[-1][1] = max(end, intervals[-1][1])
                else:
                    intervals.append([start, end])
        print('\nVIDEO', video_id)
        for start, end in intervals:
            selected = [line for time, line in lines if start <= time <= end]
            print(' '.join(selected))
