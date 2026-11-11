(() => {
  const svg = document.querySelector('#graph');
  const details = document.querySelector('#details');
  const search = document.querySelector('#search');
  const main = document.querySelector('main');
  const factionList = document.querySelector('#faction-list');
  const factionCount = document.querySelector('#faction-count');
  const noFactions = document.querySelector('#no-factions');
  const backButton = document.querySelector('#back-to-factions');
  const mobile = window.matchMedia('(max-width: 850px)');
  const factionOptions = document.querySelector('#faction-options');
  const filterButtons = [...document.querySelectorAll('.filter')];
  const sortBy = document.querySelector('#sort-by');
  const initialDetails = details.innerHTML;
  const artworkButton = document.querySelector('#artwork');
  const resetButton = document.querySelector('#reset');
  const relationshipDialog = document.querySelector('#relationship-dialog');
  const commentaryData = window.RELATIONSHIP_DATA;
  const NS = 'http://www.w3.org/2000/svg';
  const width = () => svg.clientWidth || 900;
  const height = () => svg.clientHeight || 700;
  const sources = window.FACTION_DATA;
  const references = window.FACTION_REFERENCE_DATA || [];
  const allFactions = [...sources, ...references];
  const relationshipModel = window.RelationshipModel.build(allFactions, commentaryData.entries);
  for (const faction of allFactions) Object.assign(faction, relationshipModel.connections.get(faction.name));
  const byName = new Map(allFactions.map((f) => [f.name, f]));
  const nodes = [
    ...sources.map((f, i) => ({ id:f.name, faction:f, source:true, x:width()/2+Math.cos(i)*120, y:height()/2+Math.sin(i)*120, vx:0, vy:0 })),
    ...references.map((f, i) => ({ id:f.name, faction:f, source:false, x:width()/2+Math.cos(i*.9)*280, y:height()/2+Math.sin(i*.9)*280, vx:0, vy:0 })),
  ];
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  factionOptions.innerHTML = nodes.map((node) => `<option value="${node.id}"></option>`).join('');
  const visibleEdgeTypes = new Set(['pair', 'counter']);
  const factionsCountered = new Map(allFactions.map((faction) => [faction.name, 0]));
  for (const faction of allFactions) {
    for (const counter of faction.counters) {
      if (factionsCountered.has(counter)) factionsCountered.set(counter, factionsCountered.get(counter) + 1);
    }
  }
  const edges = [...relationshipModel.relationships.values()].map(relationship => ({
    source:nodeById.get(relationship.from), target:nodeById.get(relationship.to),
    type:relationship.type, relationship,
  }));

  const defs = document.createElementNS(NS, 'defs');
  const marker = document.createElementNS(NS, 'marker');
  marker.setAttribute('id', 'counter-arrow'); marker.setAttribute('viewBox', '0 -5 10 10');
  marker.setAttribute('refX', '18'); marker.setAttribute('refY', '0'); marker.setAttribute('markerWidth', '7'); marker.setAttribute('markerHeight', '7'); marker.setAttribute('orient', 'auto');
  const arrowPath = document.createElementNS(NS, 'path'); arrowPath.setAttribute('d', 'M0,-5L10,0L0,5'); arrowPath.setAttribute('fill', '#f05252');
  marker.append(arrowPath); defs.append(marker); svg.append(defs);
  const viewport = document.createElementNS(NS, 'g');
  const edgeLayer = document.createElementNS(NS, 'g');
  const nodeLayer = document.createElementNS(NS, 'g');
  viewport.append(edgeLayer, nodeLayer); svg.append(viewport);
  for (const edge of edges) {
    const line = document.createElementNS(NS, 'line');
    line.classList.add('edge'); if (edge.type === 'counter') { line.classList.add('counter'); line.setAttribute('marker-end', 'url(#counter-arrow)'); }
    edge.el = line; edgeLayer.append(line);
    line.setAttribute('role', 'button');
    line.setAttribute('tabindex', '0');
    line.setAttribute('aria-label', edge.type === 'pair' ? `${edge.source.id} and ${edge.target.id}: why they pair` : `${edge.source.id} counters ${edge.target.id}: why`);
    line.addEventListener('pointerdown', event => event.stopPropagation());
    line.addEventListener('click', event => { event.stopPropagation(); showRelationship(edge.relationship); });
    line.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); showRelationship(edge.relationship); }
    });
  }
  for (const node of nodes) {
    const group = document.createElementNS(NS, 'g');
    group.classList.add('node', node.source ? 'source' : 'reference');
    const circle = document.createElementNS(NS, 'circle'); circle.setAttribute('r', node.source ? 9 : 5.5);
    const label = document.createElementNS(NS, 'text'); label.setAttribute('x', node.source ? 13 : 9); label.setAttribute('y', 4); label.textContent = node.id;
    group.append(circle, label); node.el = group; node.circle = circle; nodeLayer.append(group);
    group.addEventListener('pointerdown', (event) => startNodeDrag(event, node));
    group.addEventListener('click', (event) => { event.stopPropagation(); selectNode(node); });
  }

  let transform = { x:0, y:0, k:1 };
  let selected = null;
  let overviewOpen = false;
  let artworkEnabled = false;
  let artworkReady = false;
  let dragged = null;
  let pan = null;
  let listScroll = 0;
  let returnFocus = null;
  const alphabeticalNodes = [...nodes].sort((a, b) => a.id.localeCompare(b.id, 'en'));
  const rank = (faction) => Number.isFinite(faction.number) && faction.number > 0 ? faction.number : Infinity;
  const sortDefinitions = {
    alphabetical: { title:'Factions A–Z', description:'All factions in alphabetical order.' },
    overall: { title:'Overall ranking', description:'Best rank first (lowest number). Unranked factions appear last.', value:rank, label:(value)=>Number.isFinite(value) ? `Rank #${value}` : 'Unranked' },
    synergies: { title:'Synergies', description:'Most good-pair connections first. Missing counts are zero.', value:(f)=>f.partners?.length || 0, label:(value)=>`${value} ${value === 1 ? 'synergy' : 'synergies'}` },
    counteredBy: { title:'Countered by', description:'Most counters against a faction first. Missing counts are zero.', value:(f)=>f.counters?.length || 0, label:(value)=>`Countered by ${value}` },
    countersOthers: { title:'They counter', description:'Most factions they counter first. Missing counts are zero.', value:(f)=>factionsCountered.get(f.name) || 0, label:(value)=>`Counters ${value}` },
  };
  function sortedNodes() {
    const definition = sortDefinitions[sortBy.value];
    return [...nodes].sort((a, b) => {
      const nameOrder = a.id.localeCompare(b.id, 'en');
      if (!definition.value) return nameOrder;
      const difference = definition.value(a.faction) - definition.value(b.faction);
      return (sortBy.value === 'overall' ? difference : -difference) || nameOrder;
    });
  }
  function sortFactionList() {
    const definition = sortDefinitions[sortBy.value];
    for (const node of sortedNodes()) {
      const row = listRows.get(node);
      const classification = node.source ? 'Classified' : 'Not yet classified';
      row.querySelector('.faction-row-caption').textContent = definition.value
        ? `${definition.label(definition.value(node.faction))} · ${classification}`
        : `${classification} · View faction`;
      factionList.append(row);
    }
  }
  const listRows = new Map();
  for (const node of alphabeticalNodes) {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'faction-row';
    const name = document.createElement('span');
    name.className = 'faction-row-name';
    name.textContent = node.id;
    const caption = document.createElement('span');
    caption.className = 'faction-row-caption';
    caption.textContent = node.source ? 'Classified · View strengths, pairs & counters' : 'Not yet classified · View faction';
    const arrow = document.createElement('span');
    arrow.className = 'faction-row-arrow';
    arrow.textContent = '›';
    arrow.setAttribute('aria-hidden', 'true');
    button.append(name, caption, arrow);
    button.addEventListener('click', () => selectNode(node));
    li.append(button);
    factionList.append(li);
    listRows.set(node, li);
  }
  function matchesSearch(node) {
    const query = search.value.trim().toLocaleLowerCase();
    return !query || node.id.toLocaleLowerCase().includes(query);
  }
  function applySearch() {
    let count = 0;
    for (const node of nodes) {
      const matches = matchesSearch(node);
      node.el.classList.toggle('search-hidden', !matches);
      listRows.get(node).hidden = !matches;
      if (matches) count++;
    }
    factionCount.textContent = `${count} of ${nodes.length} factions`;
    noFactions.hidden = count !== 0;
    applyEdgeFilters();
    if (overviewOpen) showSortedOverview();
  }
  function openMobileDetails() {
    if (!mobile.matches) return;
    if (!main.classList.contains('detail-open')) {
      listScroll = window.scrollY;
      returnFocus = document.activeElement;
    }
    main.classList.add('detail-open');
    document.querySelector('#details-panel').scrollTop = 0;
    window.scrollTo(0, 0);
    backButton.focus({ preventScroll: true });
  }
  function backToFactions() {
    main.classList.remove('detail-open');
    if (mobile.matches) {
      window.scrollTo(0, listScroll);
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    }
  }
  backButton.addEventListener('click', backToFactions);
  const connected = (node) => new Set(edges.filter((e) => e.source===node || e.target===node).flatMap((e) => [e.source,e.target]));
  function render() {
    viewport.setAttribute('transform', `translate(${transform.x} ${transform.y}) scale(${transform.k})`);
    for (const edge of edges) {
      edge.el.setAttribute('x1', edge.source.x); edge.el.setAttribute('y1', edge.source.y);
      edge.el.setAttribute('x2', edge.target.x); edge.el.setAttribute('y2', edge.target.y);
    }
    for (const node of nodes) node.el.setAttribute('transform', `translate(${node.x} ${node.y})`);
  }

  let ticks = 0;
  function simulate() {
    if (mobile.matches) return;
    if (ticks++ < 620) {
      const charge = nodes.length > 120 ? 1300 : 1700;
      for (let i=0;i<nodes.length;i++) for (let j=i+1;j<nodes.length;j++) {
        const a=nodes[i], b=nodes[j], dx=a.x-b.x, dy=a.y-b.y, d2=Math.max(90,dx*dx+dy*dy), f=charge/d2;
        a.vx += dx*f*.015; a.vy += dy*f*.015; b.vx -= dx*f*.015; b.vy -= dy*f*.015;
      }
      for (const e of edges) {
        const dx=e.target.x-e.source.x, dy=e.target.y-e.source.y, d=Math.max(1,Math.hypot(dx,dy)), desired=e.type==='pair'?86:112, f=(d-desired)*.0025;
        e.source.vx += dx/d*f; e.source.vy += dy/d*f; e.target.vx -= dx/d*f; e.target.vy -= dy/d*f;
      }
      const cx=width()/2, cy=height()/2;
      for (const n of nodes) if (n!==dragged) {
        n.vx+=(cx-n.x)*.00035; n.vy+=(cy-n.y)*.00035; n.vx*=.88; n.vy*=.88; n.x+=n.vx; n.y+=n.vy;
      }
      render(); requestAnimationFrame(simulate);
    }
  }

  function selectNode(node) {
    selected = node;
    overviewOpen = false;
    const near = connected(node); near.add(node);
    for (const n of nodes) { n.el.classList.toggle('selected', n===node); n.el.classList.toggle('dim', !near.has(n)); }
    for (const e of edges) { const active=e.source===node||e.target===node; e.el.classList.toggle('active',active); e.el.classList.toggle('dim',!active); }
    const f=node.faction;
    const officialPage = f.officialUrl
      ? `<a class="official-link" href="${f.officialUrl}" target="_blank" rel="noopener noreferrer">See official page ↗</a>`
      : '<div class="official-link unavailable">No official page available</div>';
    const hero = f.imageUrl ? `<img class="faction-cover" src="${f.imageUrl}" alt="${escapeHtml(f.name)} cover artwork" loading="lazy">` : '';
    const number = node.source ? `CLASSIFIED · FACTION #${f.number}` : 'NOT YET CLASSIFIED';
    const analysis = node.source
      ? `${listSection('Strengths','strength',f.strengths)}${listSection('Weaknesses','weakness',f.weaknesses)}`
      : '<p class="classification-note">This faction has not yet been classified. Strengths, weaknesses, and a full synergy analysis are not yet available. Any connections below come from existing faction analyses.</p>';
    const emptyLabel = node.source ? '—' : 'Not yet recorded';
    const hasAnalysis = node.source || f.partners.length || f.counters.length || f.counterTargets?.length;
    const credit = hasAnalysis ? '<p class="detail-credit">Connections and analysis credited to <a href="https://www.youtube.com/@UseTheFoursPodcast" target="_blank" rel="noopener noreferrer">Use The Fours</a>.</p>' : '';
    const reviewTodos = commentaryData.todos.filter(todo => todo.faction === f.name);
    const reviewSection = reviewTodos.length ? `<section class="section review-notes"><h3>Pairings to explore</h3><p>Broad podcast recommendations awaiting tags and individual pairing review.</p><ul>${reviewTodos.map(todo=>`<li>${escapeHtml(todo.summary)} <a href="${sourceUrl(todo.source)}" target="_blank" rel="noopener noreferrer">Podcast source ↗</a></li>`).join('')}</ul></section>` : '';
    details.innerHTML = `${hero}<div class="detail-body"><span class="detail-number">${number}</span><h2>${escapeHtml(f.name)}</h2>${officialPage}${analysis}<p class="relationship-hint">Click any pairing or counter below to see a brief explanation of why. Explanations are being added; some are not yet available.</p>${chipSection('Good pairs','partner',f.partners,emptyLabel)}${chipSection('Countered by','counter',f.counters,emptyLabel,'counteredBy')}${chipSection('Counter of','counter',f.counterTargets || [], node.source ? 'Nothing' : emptyLabel,'counterTargets')}${reviewSection}${credit}</div>`;
    details.querySelector('.faction-cover')?.addEventListener('error', (event) => { event.currentTarget.hidden = true; });
    details.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => showRelationship(relationshipModel.relationships.get(decodeURIComponent(chip.dataset.relationship)))));
    openMobileDetails();
  }
  function listSection(title, cls, items) { return `<section class="section ${cls}"><h3>${title}</h3>${items.length ? `<ul>${items.map((x)=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>` : '<p class="empty-copy">—</p>'}</section>`; }
  function chipSection(title, cls, items, emptyLabel = '—', direction = 'pair') {
    return `<section class="section ${cls}"><h3>${title}</h3>${items.length ? `<div class="chips">${items.map(name => {
      const id = direction === 'pair' ? window.RelationshipModel.key('pair', selected.id, name)
        : window.RelationshipModel.key('counter', direction === 'counteredBy' ? name : selected.id, direction === 'counteredBy' ? selected.id : name);
      return `<button class="chip ${cls==='counter'?'counter':''}" data-relationship="${encodeURIComponent(id)}" aria-haspopup="dialog">${escapeHtml(name)}</button>`;
    }).join('')}</div>` : `<p class="empty-copy">${emptyLabel}</p>`}</section>`;
  }
  function escapeHtml(value) { const d=document.createElement('div'); d.textContent=value; return d.innerHTML.replace(/"/g, '&quot;'); }
  function sourceUrl(source) { return `https://www.youtube.com/watch?v=${encodeURIComponent(source.videoId)}&t=${source.startSeconds}s`; }
  function timeLabel(seconds) {
    const h = Math.floor(seconds/3600), m = Math.floor(seconds%3600/60), s = String(seconds%60).padStart(2,'0');
    return h ? `${h}:${String(m).padStart(2,'0')}:${s}` : `${m}:${s}`;
  }
  function showRelationship(relationship) {
    const isPair = relationship.type === 'pair';
    const names = isPair ? [relationship.from,relationship.to].sort((a,b)=>a.localeCompare(b,'en')) : [relationship.from,relationship.to];
    document.querySelector('#relationship-kind').textContent = isPair ? 'WHY THEY PAIR' : 'WHY THIS COUNTER WORKS';
    document.querySelector('#relationship-title').textContent = `${names[0]} ${isPair ? '+' : 'counters'} ${names[1]}`;
    const explanation = relationship.explanation;
    document.querySelector('#relationship-commentary').innerHTML = explanation
      ? `<p class="relationship-summary">${escapeHtml(explanation.summary)}</p>${explanation.conditions.length ? `<p class="relationship-conditions">${explanation.conditions.map(escapeHtml).join(' · ')}</p>` : ''}<div class="relationship-sources">${explanation.sources.map(source=>`<a href="${sourceUrl(source)}" target="_blank" rel="noopener noreferrer">Watch the explanation at ${timeLabel(source.startSeconds)} ↗</a>`).join('')}</div><p class="transcript-credit">Summary of Use The Fours’ discussion, based on auto-generated captions. Two-player games; rebalanced cards and Titans where applicable.</p>`
      : '<p class="relationship-summary">An explanation has not yet been added for this relationship.</p><p class="transcript-credit">The connection is recorded in the faction data. A timestamped podcast summary is still to come.</p>';
    const navigation = document.querySelector('#relationship-navigation');
    navigation.replaceChildren();
    for (const name of names) {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = `View ${name}`;
      button.addEventListener('click', () => { relationshipDialog.close(); selectNode(nodeById.get(name)); });
      navigation.append(button);
    }
    relationshipDialog.showModal();
    document.body.classList.add('dialog-open');
  }
  document.querySelector('#close-relationship').addEventListener('click', () => relationshipDialog.close());
  relationshipDialog.addEventListener('click', event => {
    if (event.target !== relationshipDialog) return;
    const rect = relationshipDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) relationshipDialog.close();
  });
  relationshipDialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  function showSortedOverview() {
    overviewOpen = true;
    clearSelection();
    const definition = sortDefinitions[sortBy.value];
    const ranked = sortedNodes().filter(matchesSearch);
    details.innerHTML = `<div class="rankings-body"><span class="detail-number">FACTION OVERVIEW</span><h2>${definition.title}</h2><p class="rankings-intro">${definition.description}</p><p class="rankings-intro">${ranked.length} of ${nodes.length} factions</p><ol class="ranking-list">${ranked.map((node,index)=>`<li><button class="ranking-row ${sortBy.value === 'overall' ? 'overall-rank' : ''}" data-name="${escapeHtml(node.id)}" type="button"><span class="ranking-position">${index+1}</span><span class="ranking-name">${escapeHtml(node.id)}</span><span class="ranking-count">${definition.value ? (sortBy.value === 'overall' ? (Number.isFinite(rank(node.faction)) ? `#${rank(node.faction)}` : 'Unranked') : definition.value(node.faction)) : '›'}</span></button></li>`).join('')}</ol>${ranked.length ? '' : '<p class="empty-copy">No factions match your search.</p>'}</div>`;
    details.querySelectorAll('.ranking-row').forEach((button)=>button.addEventListener('click',()=>selectNode(nodeById.get(button.dataset.name))));
  }

  function point(event) { const rect=svg.getBoundingClientRect(); return { x:(event.clientX-rect.left-transform.x)/transform.k, y:(event.clientY-rect.top-transform.y)/transform.k }; }
  function startNodeDrag(event,node) { event.preventDefault(); event.stopPropagation(); dragged=node; node.el.setPointerCapture(event.pointerId); const move=(e)=>{const p=point(e);node.x=p.x;node.y=p.y;node.vx=node.vy=0;render()}; const up=()=>{dragged=null;node.el.removeEventListener('pointermove',move);node.el.removeEventListener('pointerup',up)}; node.el.addEventListener('pointermove',move);node.el.addEventListener('pointerup',up); }
  svg.addEventListener('pointerdown',(e)=>{ if(e.target.closest?.('.node'))return; pan={x:e.clientX,y:e.clientY,tx:transform.x,ty:transform.y}; svg.setPointerCapture(e.pointerId); });
  svg.addEventListener('pointermove',(e)=>{if(pan){transform.x=pan.tx+e.clientX-pan.x;transform.y=pan.ty+e.clientY-pan.y;render()}});
  svg.addEventListener('pointerup',()=>pan=null);
  svg.addEventListener('wheel',(e)=>{e.preventDefault();const rect=svg.getBoundingClientRect(),mx=e.clientX-rect.left,my=e.clientY-rect.top,old=transform.k,next=Math.max(.25,Math.min(3,old*Math.exp(-e.deltaY*.001)));transform.x=mx-(mx-transform.x)*next/old;transform.y=my-(my-transform.y)*next/old;transform.k=next;render()},{passive:false});
  svg.addEventListener('click',()=>clearSelection());
  function clearSelection(){selected=null;for(const n of nodes)n.el.classList.remove('selected','dim');for(const e of edges)e.el.classList.remove('active','dim');}
  search.addEventListener('input', applySearch);
  search.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const exact = nodes.find((node) => node.id.toLocaleLowerCase() === search.value.trim().toLocaleLowerCase());
    if (exact) selectNode(exact);
  });
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const type = button.dataset.edgeType;
    if (visibleEdgeTypes.has(type)) visibleEdgeTypes.delete(type); else visibleEdgeTypes.add(type);
    button.classList.toggle('active', visibleEdgeTypes.has(type));
    button.setAttribute('aria-pressed', String(visibleEdgeTypes.has(type)));
    applyEdgeFilters();
  }));
  sortBy.addEventListener('change', () => {
    sortFactionList();
    if (!mobile.matches) showSortedOverview();
  });
  function ensureArtwork() {
    if (artworkReady) return;
    for (const [index, node] of nodes.entries()) {
      if (!node.faction.imageUrl) continue;
      const pattern = document.createElementNS(NS, 'pattern');
      pattern.setAttribute('id', `art-${index}`); pattern.setAttribute('patternUnits', 'userSpaceOnUse');
      pattern.setAttribute('x', '-12'); pattern.setAttribute('y', '-12'); pattern.setAttribute('width', '24'); pattern.setAttribute('height', '24');
      const image = document.createElementNS(NS, 'image'); image.setAttribute('href', node.faction.imageUrl);
      image.setAttribute('x', '-17'); image.setAttribute('y', '-17'); image.setAttribute('width', '34'); image.setAttribute('height', '34'); image.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      pattern.append(image); defs.append(pattern); node.artworkFill = `url(#art-${index})`;
    }
    artworkReady = true;
  }
  artworkButton.addEventListener('click', () => {
    artworkEnabled = !artworkEnabled;
    if (artworkEnabled) ensureArtwork();
    for (const node of nodes) node.circle.style.fill = artworkEnabled && node.artworkFill ? node.artworkFill : '';
    artworkButton.classList.toggle('active', artworkEnabled);
    artworkButton.setAttribute('aria-pressed', String(artworkEnabled));
  });
  function applyEdgeFilters() { for (const edge of edges) edge.el.style.display = visibleEdgeTypes.has(edge.type) && matchesSearch(edge.source) && matchesSearch(edge.target) ? '' : 'none'; }
  resetButton.addEventListener('click',()=>{transform={x:0,y:0,k:1};search.value='';clearSelection();overviewOpen=false;sortBy.value='alphabetical';sortFactionList();details.innerHTML=initialDetails;visibleEdgeTypes.clear();visibleEdgeTypes.add('pair');visibleEdgeTypes.add('counter');for(const button of filterButtons){button.classList.add('active');button.setAttribute('aria-pressed','true')}applyEdgeFilters();render()});
  resetButton.addEventListener('click', () => { applySearch(); backToFactions(); });
  mobile.addEventListener('change', () => {
    if (!mobile.matches) { main.classList.remove('detail-open'); simulate(); }
  });
  window.addEventListener('resize',render);
  sortFactionList(); applySearch(); render(); simulate();
})();
