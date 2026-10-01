(() => {
  const svg = document.querySelector('#graph');
  const details = document.querySelector('#details');
  const search = document.querySelector('#search');
  const factionOptions = document.querySelector('#faction-options');
  const filterButtons = [...document.querySelectorAll('.filter')];
  const rankingsButton = document.querySelector('#rankings');
  const artworkButton = document.querySelector('#artwork');
  const resetButton = document.querySelector('#reset');
  const NS = 'http://www.w3.org/2000/svg';
  const width = () => svg.clientWidth;
  const height = () => svg.clientHeight;
  const sources = window.FACTION_DATA;
  const references = window.FACTION_REFERENCE_DATA || [];
  const allFactions = [...sources, ...references];
  const byName = new Map(allFactions.map((f) => [f.name, f]));
  const nodes = [
    ...sources.map((f, i) => ({ id:f.name, faction:f, source:true, x:width()/2+Math.cos(i)*120, y:height()/2+Math.sin(i)*120, vx:0, vy:0 })),
    ...references.map((f, i) => ({ id:f.name, faction:f, source:false, x:width()/2+Math.cos(i*.9)*280, y:height()/2+Math.sin(i*.9)*280, vx:0, vy:0 })),
  ];
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  factionOptions.innerHTML = nodes.map((node) => `<option value="${node.id}"></option>`).join('');
  const visibleEdgeTypes = new Set(['pair', 'counter']);
  const factionsCountered = new Map(sources.map((faction) => [faction.name, 0]));
  for (const faction of sources) {
    for (const counter of faction.counters) {
      if (factionsCountered.has(counter)) factionsCountered.set(counter, factionsCountered.get(counter) + 1);
    }
  }
  const edgeKey = (a,b,type) => type === 'pair' ? `${type}:${[a,b].sort().join('|')}` : `${type}:${a}>${b}`;
  const seen = new Set();
  const edges = [];
  for (const faction of sources) {
    for (const [type, names] of [['pair', faction.partners], ['counter', faction.counters]]) {
      for (const target of names) {
        if (!nodeById.has(target) || target === faction.name) continue;
        const key = edgeKey(faction.name, target, type);
        if (!seen.has(key)) {
          seen.add(key);
          // A card says it is "countered by" the named faction, so the arrow
          // runs from the counter to the countered faction.
          edges.push(type === 'counter'
            ? { source:nodeById.get(target), target:nodeById.get(faction.name), type }
            : { source:nodeById.get(faction.name), target:nodeById.get(target), type });
        }
      }
    }
  }

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
  let rankingMode = 'synergies';
  let artworkEnabled = false;
  let artworkReady = false;
  let dragged = null;
  let pan = null;
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
    rankingsButton.classList.remove('active');
    const near = connected(node); near.add(node);
    for (const n of nodes) { n.el.classList.toggle('selected', n===node); n.el.classList.toggle('dim', !near.has(n)); }
    for (const e of edges) { const active=e.source===node||e.target===node; e.el.classList.toggle('active',active); e.el.classList.toggle('dim',!active); }
    const f=node.faction;
    const officialPage = f.officialUrl
      ? `<a class="official-link" href="${f.officialUrl}" target="_blank" rel="noopener noreferrer">See official page ↗</a>`
      : '<div class="official-link unavailable">No official page available</div>';
    const hero = f.imageUrl ? `<img class="faction-cover" src="${f.imageUrl}" alt="${escapeHtml(f.name)} cover artwork" loading="lazy">` : '';
    const number = f.number ? `FACTION #${f.number}` : 'REFERENCED FACTION';
    details.innerHTML = `${hero}<div class="detail-body"><span class="detail-number">${number}</span><h2>${escapeHtml(f.name)}</h2>${officialPage}${listSection('Strengths','strength',f.strengths)}${listSection('Weaknesses','weakness',f.weaknesses)}${chipSection('Good pairs','partner',f.partners)}${chipSection('Countered by','counter',f.counters)}${chipSection('Counter of','counter',f.counterTargets || [], 'Nothing')}<p class="detail-credit">Based on the analysis done in Use The Fours. <a href="https://www.youtube.com/@UseTheFoursPodcast" target="_blank" rel="noopener noreferrer">Link here!</a></p></div>`;
    details.querySelectorAll('.chip').forEach((chip) => chip.addEventListener('click', () => selectNode(nodeById.get(chip.dataset.name))));
  }
  function listSection(title, cls, items) { return `<section class="section ${cls}"><h3>${title}</h3>${items.length ? `<ul>${items.map((x)=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>` : '<p class="empty-copy">—</p>'}</section>`; }
  function chipSection(title, cls, items, emptyLabel = '—') { return `<section class="section ${cls}"><h3>${title}</h3>${items.length ? `<div class="chips">${items.map((x)=>`<button class="chip ${cls==='counter'?'counter':''}" data-name="${escapeHtml(x)}">${escapeHtml(x)}</button>`).join('')}</div>` : `<p class="empty-copy">${emptyLabel}</p>`}</section>`; }
  function escapeHtml(value) { const d=document.createElement('div'); d.textContent=value; return d.innerHTML; }
  const rankingDefinitions = {
    synergies: { label:'Synergies', title:'Most good-pair connections', description:'Counts every unique recommended pairing shown for the faction.', value:(faction)=>faction.partners.length },
    counteredBy: { label:'Countered by', title:'Most counters against them', description:'Counts factions listed as counters to this faction.', value:(faction)=>faction.counters.length },
    countersOthers: { label:'They counter', title:'Most card factions they counter', description:'Counts detailed card factions that list this faction as a counter.', value:(faction)=>factionsCountered.get(faction.name) || 0 },
  };
  function showRankings(mode = rankingMode) {
    rankingMode = mode;
    selected = null;
    clearSelection();
    rankingsButton.classList.add('active');
    const definition = rankingDefinitions[mode];
    const ranked = [...sources].sort((a,b)=>definition.value(b)-definition.value(a) || a.name.localeCompare(b.name));
    details.innerHTML = `<div class="rankings-body"><span class="detail-number">FACTION OVERVIEW</span><h2>${definition.title}</h2><p class="rankings-intro">${definition.description}</p><div class="ranking-tabs">${Object.entries(rankingDefinitions).map(([key,item])=>`<button class="ranking-tab ${key===mode?'active':''}" data-ranking="${key}" type="button">${item.label}</button>`).join('')}</div><ol class="ranking-list">${ranked.map((faction,index)=>`<li><button class="ranking-row" data-name="${escapeHtml(faction.name)}" type="button"><span class="ranking-position">${index+1}</span><span class="ranking-name">${escapeHtml(faction.name)}</span><span class="ranking-count">${definition.value(faction)}</span></button></li>`).join('')}</ol></div>`;
    details.querySelectorAll('.ranking-tab').forEach((button)=>button.addEventListener('click',()=>showRankings(button.dataset.ranking)));
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
  search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();for(const n of nodes)n.el.classList.toggle('dim',q&&!n.id.toLowerCase().includes(q));const exact=nodes.find(n=>n.id.toLowerCase()===q);if(exact)selectNode(exact)});
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const type = button.dataset.edgeType;
    if (visibleEdgeTypes.has(type)) visibleEdgeTypes.delete(type); else visibleEdgeTypes.add(type);
    button.classList.toggle('active', visibleEdgeTypes.has(type));
    button.setAttribute('aria-pressed', String(visibleEdgeTypes.has(type)));
    applyEdgeFilters();
  }));
  rankingsButton.addEventListener('click', () => showRankings());
  function ensureArtwork() {
    if (artworkReady) return;
    for (const [index, node] of nodes.entries()) {
      if (!node.faction.imageUrl) continue;
      const pattern = document.createElementNS(NS, 'pattern');
      pattern.setAttribute('id', `art-${index}`); pattern.setAttribute('patternUnits', 'userSpaceOnUse');
      pattern.setAttribute('x', '-12'); pattern.setAttribute('y', '-12'); pattern.setAttribute('width', '24'); pattern.setAttribute('height', '24');
      const image = document.createElementNS(NS, 'image'); image.setAttribute('href', node.faction.imageUrl);
      image.setAttribute('x', '-12'); image.setAttribute('y', '-12'); image.setAttribute('width', '24'); image.setAttribute('height', '24'); image.setAttribute('preserveAspectRatio', 'xMidYMid slice');
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
  function applyEdgeFilters() { for (const edge of edges) edge.el.style.display = visibleEdgeTypes.has(edge.type) ? '' : 'none'; }
  resetButton.addEventListener('click',()=>{transform={x:0,y:0,k:1};search.value='';clearSelection();rankingsButton.classList.remove('active');visibleEdgeTypes.clear();visibleEdgeTypes.add('pair');visibleEdgeTypes.add('counter');for(const button of filterButtons){button.classList.add('active');button.setAttribute('aria-pressed','true')}applyEdgeFilters();render()});
  window.addEventListener('resize',render);
  render(); simulate();
})();
