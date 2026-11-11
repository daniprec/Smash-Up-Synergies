// Shared by the browser and the Node validation tests.
((root) => {
  function key(type, from, to) {
    const names = type === 'pair' ? [from, to].sort() : [from, to];
    return JSON.stringify([type, ...names]);
  }

  function build(factions, commentary = []) {
    const byName = new Map(factions.map(faction => [faction.name, faction]));
    const relationships = new Map();
    function add(type, from, to, explanation) {
      if (from === to || !byName.has(from) || !byName.has(to)) throw new Error(`Unknown relationship: ${from} / ${to}`);
      const id = key(type, from, to);
      if (!relationships.has(id)) relationships.set(id, { id, type, from, to, explanation:null });
      if (explanation) {
        if (relationships.get(id).explanation) throw new Error(`Duplicate commentary: ${id}`);
        relationships.get(id).explanation = explanation;
      }
    }
    for (const faction of factions) {
      for (const partner of faction.partners || []) add('pair', faction.name, partner);
      for (const counter of faction.counters || []) add('counter', counter, faction.name);
      for (const target of faction.counterTargets || []) add('counter', faction.name, target);
    }
    for (const entry of commentary) add(entry.type, ...entry.factions, entry);
    const connections = new Map(factions.map(faction => [faction.name, { partners:[], counters:[], counterTargets:[] }]));
    for (const relationship of relationships.values()) {
      if (relationship.type === 'pair') {
        connections.get(relationship.from).partners.push(relationship.to);
        connections.get(relationship.to).partners.push(relationship.from);
      } else {
        connections.get(relationship.from).counterTargets.push(relationship.to);
        connections.get(relationship.to).counters.push(relationship.from);
      }
    }
    for (const connection of connections.values()) {
      for (const values of Object.values(connection)) values.sort((a, b) => a.localeCompare(b, 'en'));
    }
    return { relationships, connections };
  }
  const api = { key, build };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.RelationshipModel = api;
})(typeof window === 'undefined' ? globalThis : window);
