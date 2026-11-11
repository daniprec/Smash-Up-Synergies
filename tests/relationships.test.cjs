const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const model = require('../relationship-model.js');
const context = { window:{} };
for (const filename of ['data.js','relationship-data.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',filename),'utf8'),context);
}
const data = context.window;
const factions = [...data.FACTION_DATA,...data.FACTION_REFERENCE_DATA];
const commentary = data.RELATIONSHIP_DATA;
const result = model.build(factions,commentary.entries);

test('pair explanations are the same object in either direction', () => {
  const forward = result.relationships.get(model.key('pair','Luchadors','Tornados'));
  const backward = result.relationships.get(model.key('pair','Tornados','Luchadors'));
  assert.equal(forward,backward);
  assert.ok(forward.explanation.summary);
  assert.ok(result.connections.get('Luchadors').partners.includes('Tornados'));
  assert.ok(result.connections.get('Tornados').partners.includes('Luchadors'));
});

test('counter explanations retain direction across both faction pages', () => {
  const counter = result.relationships.get(model.key('counter','Hydra','Luchadors'));
  assert.ok(counter.explanation);
  assert.ok(result.connections.get('Hydra').counterTargets.includes('Luchadors'));
  assert.ok(result.connections.get('Luchadors').counters.includes('Hydra'));
  assert.notEqual(counter,result.relationships.get(model.key('counter','Luchadors','Hydra')));
});

test('all original factions and connections remain available', () => {
  assert.equal(result.connections.size,106);
  for (const faction of factions) {
    const connection = result.connections.get(faction.name);
    for (const field of ['partners','counters','counterTargets']) {
      for (const name of faction[field]) assert.ok(connection[field].includes(name),`${faction.name}: ${field} ${name}`);
      assert.equal(connection[field].length,new Set(connection[field]).size);
    }
  }
});

test('summaries cite only selected ranking episodes with usable timestamps', () => {
  const episodes = new Map(commentary.episodes.map(episode=>[episode.videoId,episode]));
  assert.equal(episodes.size,8);
  const covered = new Set();
  for (const episode of episodes.values()) assert.match(episode.title,/2026 2-Player Tier List: [ABC]-Tier Part \d/);
  for (const entry of commentary.entries) {
    assert.ok(['pair','counter'].includes(entry.type));
    assert.ok(entry.summary.length > 30);
    assert.ok(entry.sources.length);
    for (const source of entry.sources) {
      assert.ok(episodes.has(source.videoId));
      assert.ok(Number.isInteger(source.startSeconds) && source.startSeconds >= 0);
      covered.add(source.videoId);
    }
  }
  assert.equal(covered.size,8);
});

test('unreviewed archetype suggestions are separate from confirmed edges', () => {
  for (const todo of commentary.todos) {
    assert.ok(result.connections.has(todo.faction));
    assert.equal(todo.status,'needs-tags-and-review');
    assert.ok(todo.proposedTag && todo.summary && todo.source);
  }
  const synthetic = [{name:'A',partners:[],counters:[],counterTargets:[]},{name:'B',partners:[],counters:[],counterTargets:[]}];
  assert.equal(model.build(synthetic,[]).relationships.size,0);
});

test('relationships without commentary have no invented summary', () => {
  const pending = [...result.relationships.values()].filter(item=>!item.explanation);
  assert.ok(pending.length > 0);
  for (const item of pending) assert.equal(item.explanation,null);
});

console.log(`${commentary.entries.length} explanations, ${commentary.todos.length} review TODOs, ${result.relationships.size} unique relationships.`);
