const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const tagModel = require('../tag-model.js');
const relationshipModel = require('../relationship-model.js');
const context = {window:{}};
for (const file of ['data.js','tag-data.js','relationship-data.js']) vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
const data = context.window;
const factions = [...data.FACTION_DATA,...data.FACTION_REFERENCE_DATA];
const tags = tagModel.create(data.FACTION_TAG_DATA);
const graph = relationshipModel.build(factions,data.RELATIONSHIP_DATA.entries);

test('all 106 factions have valid, unique, sourced tags', () => {
  assert.equal(tags.assignments.size,106);
  assert.equal(tags.assignments.size,data.FACTION_TAG_DATA.assignments.length);
  assert.equal(tags.definitions.size,data.FACTION_TAG_DATA.definitions.length);
  const used = new Set();
  for (const faction of factions) {
    const record = tags.assignments.get(faction.name);
    assert.ok(record, faction.name);
    assert.ok(record.tagIds.length > 0 && record.tagIds.length <= 5);
    assert.equal(record.tagIds.length,new Set(record.tagIds).size);
    for (const id of record.tagIds) { assert.ok(tags.definitions.has(id),`${faction.name}: ${id}`); used.add(id); }
    for (const url of record.sourceUrls) assert.equal(new URL(url).protocol,'https:');
    assert.ok(record.sourceUrls.length);
  }
  assert.equal(used.size,tags.definitions.size);
});

test('search supports names, tags, punctuation, aliases, and combined terms', () => {
  assert.ok(tags.matches('Ancient Incas','play on base'));
  assert.ok(tags.matches('Dragons','PLAY-ON-BASE ACTIONS'));
  assert.ok(tags.matches('Robots','swarm'));
  assert.ok(tags.matches('Wizards','extra action plays'));
  assert.ok(tags.matches('Ancient Incas','inca base'));
  assert.ok(tags.matches('Cyborg Apes','minion modifiers'));
  assert.ok(tags.matches('Aliens','bounce'));
  assert.ok(!tags.matches('Robots','play on base'));
  assert.ok(!tags.matches('Luchadors','play on base'));
  assert.ok(!tags.matches('Action Heroes','play on base'));
  assert.ok(!tags.matches('Robots','zzzzz'));
});

test('clicking a tag can filter its exact members without accidental name matches', () => {
  for (const tag of tags.definitions.values()) {
    for (const faction of factions) assert.equal(tags.matches(faction.name,`tag:${tag.label}`),tags.assignments.get(faction.name).tagIds.includes(tag.id));
  }
});

test('pending Incas/Dragons pairing describes shared mechanics consistently', () => {
  const edge = graph.relationships.get(relationshipModel.key('pair','Ancient Incas','Dragons'));
  assert.equal(edge.explanation,null);
  const explanation = tags.contextFor(edge);
  assert.equal(explanation.kind,'shared-mechanics');
  assert.ok(explanation.tagIds.includes('base-actions'));
  assert.match(explanation.summary,/Both factions build around actions played on bases/);
  assert.match(explanation.note,/not yet been summarized/);
  assert.deepEqual(explanation,tags.contextFor({...edge,from:edge.to,to:edge.from}));
});

test('Eliza rule uses the actual limit and only the countering Princesses direction', () => {
  for (const to of ['Robots','Wizards']) {
    const explanation = tags.contextFor({type:'counter',from:'Princesses',to,explanation:null});
    assert.equal(explanation.kind,'card-mechanic');
    assert.match(explanation.summary,/one extra card play per turn/);
    assert.ok(explanation.sourceUrls[0].endsWith('#Eliza'));
    assert.equal(tags.contextFor({type:'counter',from:to,to:'Princesses',explanation:null}),null);
  }
  assert.equal(tags.contextFor({type:'counter',from:'Princesses',to:'Dinosaurs',explanation:null}),null);
});

test('podcast explanations take priority over all generated context', () => {
  for (const edge of graph.relationships.values()) if (edge.explanation) assert.equal(tags.contextFor(edge),null);
  const edge = graph.relationships.get(relationshipModel.key('pair','Luchadors','Tornados'));
  assert.ok(edge.explanation);
});

test('shared tags do not invent relationships or explain unrelated counters', () => {
  assert.equal(tags.contextFor({type:'counter',from:'Dragons',to:'Ancient Incas',explanation:null}),null);
  assert.equal(tags.contextFor({type:'pair',from:'Aliens',to:'G.I. Gerald',explanation:null}),null);
  const before = graph.relationships.size;
  for (const edge of graph.relationships.values()) tags.contextFor(edge);
  assert.equal(graph.relationships.size,before);
});

const contexts = [...graph.relationships.values()].map(edge=>tags.contextFor(edge)).filter(Boolean);
console.log(`${tags.definitions.size} tags across ${tags.assignments.size} factions; ${contexts.length} pending relationships have contextual notes (${contexts.filter(item=>item.kind==='card-mechanic').length} Eliza counters).`);
