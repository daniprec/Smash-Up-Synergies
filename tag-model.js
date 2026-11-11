((root) => {
  const normalize = text => String(text).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  function create(data) {
    const definitions = new Map(data.definitions.map(tag=>[tag.id,tag]));
    const assignments = new Map(data.assignments.map(faction=>[faction.name,faction]));
    const exactTagTerms = new Map();
    for (const tag of definitions.values()) {
      for (const term of [tag.id,tag.label,...tag.aliases]) {
        const normalized = normalize(term);
        if (!exactTagTerms.has(normalized)) exactTagTerms.set(normalized,new Set());
        exactTagTerms.get(normalized).add(tag.id);
      }
    }
    function tagsFor(name) {
      return (assignments.get(name)?.tagIds || []).map(id=>definitions.get(id));
    }
    function matches(name,query) {
      const tags = tagsFor(name);
      if (/^tag:/i.test(query.trim())) {
        const value = normalize(query.trim().slice(4));
        if (!value) return true;
        const exact = data.definitions.find(tag=>[tag.id,tag.label].some(text=>normalize(text)===value));
        if (exact) return tags.some(tag=>tag.id===exact.id);
        return tags.some(tag=>[tag.id,tag.label,...tag.aliases].some(text=>normalize(text).includes(value)));
      }
      const normalized = normalize(query);
      const exactTags = exactTagTerms.get(normalized);
      if (exactTags) return tags.some(tag=>exactTags.has(tag.id)) || normalize(name).includes(normalized);
      const tokens = normalized.split(' ').filter(Boolean);
      const text = normalize([name,...tags.flatMap(tag=>[tag.label,...tag.aliases])].join(' '));
      return tokens.every(token=>text.includes(token));
    }
    function contextFor(relationship) {
      if (relationship.explanation) return null;
      const fromTags = new Set(tagsFor(relationship.from).map(tag=>tag.id));
      const toTags = new Set(tagsFor(relationship.to).map(tag=>tag.id));
      if (relationship.type === 'counter') {
        if (relationship.from !== 'Princesses' || (!toTags.has('swarm') && !toTags.has('extra-actions'))) return null;
        const strategy = toTags.has('swarm') && toTags.has('extra-actions') ? 'extra minion and action plays'
          : toTags.has('swarm') ? 'extra minion plays' : 'extra action plays';
        return {
          kind:'card-mechanic',heading:'Eliza limits extra plays',tagIds:[],
          summary:`Eliza limits each other player to one extra card play per turn. This faction’s reliance on ${strategy} makes that restriction especially disruptive to its chains and burst turns.`,
          note:'Card-and-tag context for this recorded counter. A specific podcast explanation has not yet been added.',
          sourceUrls:['https://smashup-rulebook.alderac.com/wiki/Princesses#Eliza'],
        };
      }
      const shared = data.definitions.filter(tag=>fromTags.has(tag.id) && toTags.has(tag.id)).slice(0,3);
      if (!shared.length) return null;
      return {
        kind:'shared-mechanics',heading:'Shared mechanics',tagIds:shared.map(tag=>tag.id),
        summary:shared.map(tag=>`Both factions ${tag.sharedClause}.`).join(' '),
        note:'This describes their shared play styles. The specific reason for this pairing has not yet been summarized from the podcast.',
        sourceUrls:[...new Set([...(assignments.get(relationship.from)?.sourceUrls || []),...(assignments.get(relationship.to)?.sourceUrls || [])])].sort(),
      };
    }
    return {definitions,assignments,tagsFor,matches,contextFor};
  }
  const api = {create,normalize};
  if (typeof module !== 'undefined' && module.exports) module.exports=api;
  else root.FactionTagModel=api;
})(typeof window === 'undefined' ? globalThis : window);
