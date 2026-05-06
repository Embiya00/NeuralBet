const matches = [
  { id:1, home:"Manchester City", away:"Arsenal", league:"Premier League", time:"21:00", signal:"strong",
    neural:{h:1.72, d:4.10, a:4.50}, market:{h:1.95, d:3.70, a:4.00},
    edge:12.8, conf:88, tip:"Ev sahibi kazanır", reason:"City son 8 iç sahada 7 galibiyet. Neural model piyasadan belirgin şekilde düşük oran veriyor." },
  { id:2, home:"Barcelona", away:"Real Madrid", league:"La Liga", time:"22:00", signal:"medium",
    neural:{h:2.10, d:3.40, a:3.20}, market:{h:2.30, d:3.30, a:3.10},
    edge:8.7, conf:74, tip:"Beraberlik", reason:"El Clasico historik baskı. Model beraberlik olasılığını piyasadan yüksek hesaplıyor." },
  { id:3, home:"Bayern Münih", away:"Dortmund", league:"Bundesliga", time:"18:30", signal:"strong",
    neural:{h:1.55, d:4.50, a:5.20}, market:{h:1.80, d:3.90, a:4.80},
    edge:16.1, conf:91, tip:"Ev sahibi kazanır", reason:"Bayern'in son 12 Alman derbisinden 10'unu kazandığını model ağırlıklı olarak hesaplıyor." },
  { id:4, home:"PSG", away:"Lyon", league:"Ligue 1", time:"20:45", signal:"low",
    neural:{h:1.35, d:5.00, a:7.50}, market:{h:1.40, d:4.80, a:7.00},
    edge:3.6, conf:69, tip:"Ev sahibi kazanır", reason:"Küçük edge mevcut, risk yönetimi önemli." },
  { id:5, home:"Inter Milan", away:"AC Milan", league:"Serie A", time:"19:45", signal:"skip",
    neural:{h:2.20, d:3.20, a:3.00}, market:{h:2.15, d:3.25, a:3.10},
    edge:-2.3, conf:52, tip:"—", reason:"Piyasa ile neredeyse aynı, belirgin value yok." },
  { id:6, home:"Galatasaray", away:"Fenerbahçe", league:"Süper Lig", time:"20:00", signal:"strong",
    neural:{h:2.00, d:3.30, a:3.50}, market:{h:2.35, d:3.20, a:3.10},
    edge:17.5, conf:83, tip:"Ev sahibi kazanır", reason:"GS iç saha performansı güçlü. Model uzun vadeli ev sahibi avantajını piyasadan çok daha belirgin hesaplıyor." },
  { id:7, home:"Tottenham", away:"Chelsea", league:"Premier League", time:"15:00", signal:"medium",
    neural:{h:2.45, d:3.40, a:2.80}, market:{h:2.60, d:3.30, a:2.70},
    edge:6.1, conf:71, tip:"Deplasman", reason:"Chelsea son deplasman formuna göre model hafif pozitif edge buluyor." },
  { id:8, home:"Ajax", away:"PSV", league:"Eredivisie", time:"18:00", signal:"low",
    neural:{h:1.90, d:3.60, a:3.80}, market:{h:1.95, d:3.55, a:3.75},
    edge:2.8, conf:65, tip:"Ev sahibi", reason:"Çok küçük edge, yüksek güven yok." },
];

function getSignalLabel(s) {
  if(s === 'strong') return '<span class="signal-badge signal-strong">Güçlü</span>';
  if(s === 'medium') return '<span class="signal-badge signal-medium">Orta</span>';
  if(s === 'low') return '<span class="signal-badge signal-low">Düşük</span>';
  return '<span class="signal-badge signal-skip">Pas</span>';
}

function getEdgeColor(e) {
  if(e > 10) return '#22c55e';
  if(e > 4) return '#eab308';
  if(e > 0) return '#3b82f6';
  return '#ef4444';
}

function renderTable(filter) {
  const tbody = document.getElementById('match-tbody');
  const empty = document.getElementById('empty-msg');
  const filtered = filter === 'tümü' ? matches : matches.filter(m => m.signal === filter);

  if(filtered.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = filtered.map(m => {
    const edgeColor = getEdgeColor(m.edge);
    const edgePct = Math.min(Math.abs(m.edge) / 20 * 100, 100);
    const isNeg = m.edge < 0;
    return `<tr class="clickable" onclick="openDetail(${m.id})">
      <td>
        <div class="match-name">${m.home} vs ${m.away}</div>
        <div class="match-meta">${m.time}</div>
      </td>
      <td><span class="league-badge">${m.league}</span></td>
      <td class="odd-cell odd-neural">${m.neural.h.toFixed(2)}</td>
      <td class="odd-cell odd-market">${m.market.h.toFixed(2)}</td>
      <td>
        <div class="edge-bar-wrap">
          <div class="edge-bar-bg">
            <div class="edge-bar-fill" style="width:${edgePct}%;background:${edgeColor}"></div>
          </div>
          <span class="edge-val" style="color:${edgeColor}">${isNeg ? '' : '+'}${m.edge.toFixed(1)}%</span>
        </div>
      </td>
      <td>${getSignalLabel(m.signal)}</td>
      <td style="text-align:right;color:var(--color-text-secondary)">›</td>
    </tr>`;
  }).join('');
}

function filterMatches(f, btn) {
  document.querySelectorAll('.nb-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  closeDetail();
  renderTable(f);
}

function openDetail(id) {
  const m = matches.find(x => x.id === id);
  if(!m) return;

  document.getElementById('det-match').textContent = m.home + ' vs ' + m.away;
  document.getElementById('det-meta').textContent = m.league + ' · ' + m.time;

  const oddsHtml = `
    <div class="nb-odds-col">
      <div class="nb-odds-col-label">Neural Ağ Oranı</div>
      <div class="nb-odds-row"><span class="nb-odds-row-label">Ev (1)</span><span class="nb-odds-row-val">${m.neural.h.toFixed(2)}</span></div>
      <div class="nb-odds-row"><span class="nb-odds-row-label">Beraberlik (X)</span><span class="nb-odds-row-val">${m.neural.d.toFixed(2)}</span></div>
      <div class="nb-odds-row"><span class="nb-odds-row-label">Deplasman (2)</span><span class="nb-odds-row-val">${m.neural.a.toFixed(2)}</span></div>
    </div>
    <div class="nb-odds-col">
      <div class="nb-odds-col-label">Piyasa Oranı</div>
      <div class="nb-odds-row"><span class="nb-odds-row-label">Ev (1)</span><span class="nb-odds-row-val">${m.market.h.toFixed(2)}</span></div>
      <div class="nb-odds-row"><span class="nb-odds-row-label">Beraberlik (X)</span><span class="nb-odds-row-val">${m.market.d.toFixed(2)}</span></div>
      <div class="nb-odds-row"><span class="nb-odds-row-label">Deplasman (2)</span><span class="nb-odds-row-val">${m.market.a.toFixed(2)}</span></div>
    </div>
    <div class="nb-odds-col">
      <div class="nb-odds-col-label">Edge Analizi</div>
      <div style="margin-bottom:8px">
        <span style="font-size:22px;font-weight:700;color:${getEdgeColor(m.edge)};font-family:'JetBrains Mono',monospace;letter-spacing:-1px">${m.edge > 0 ? '+' : ''}${m.edge.toFixed(1)}%</span>
      </div>
      <div style="font-size:11px;color:var(--color-text-secondary);font-family:'JetBrains Mono',monospace">
        Model güveni: ${m.conf}%
      </div>
    </div>
  `;

  document.getElementById('det-odds').innerHTML = oddsHtml;

  const recHtml = m.signal !== 'skip' ? `
    <div class="nb-rec-row">
      <div class="nb-rec-icon">🎯</div>
      <div class="nb-rec-text">
        <div class="nb-rec-title">Öneri: ${m.tip}</div>
        <div class="nb-rec-sub">${m.reason}</div>
      </div>
      <div class="nb-rec-odds">
        <div class="nb-rec-odd-big">${m.market.h.toFixed(2)}</div>
        <div class="nb-rec-odd-label">piyasa oranı</div>
      </div>
    </div>
  ` : `<div style="font-size:13px;color:var(--color-text-secondary);padding:12px 0">${m.reason}</div>`;

  document.getElementById('det-rec').innerHTML = recHtml;

  const panel = document.getElementById('detail-panel');
  panel.classList.add('open');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeDetail() {
  document.getElementById('detail-panel').classList.remove('open');
}

function updateTime() {
  const now = new Date();
  const t = now.toLocaleTimeString('tr-TR', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  document.getElementById('last-update').textContent = t;
  document.getElementById('scan-time').textContent = t;
}

function mountCharts() {
  if (!window.ApexCharts) return;

  const edgeOptions = {
    chart: { type: 'area', height: 220, toolbar: { show: false }, foreColor: '#94a3b8' },
    series: [{ name: 'Edge %', data: [6, 8, 10, 9, 11, 13, 9, 12, 14, 11, 15, 16, 14, 17] }],
    stroke: { curve: 'smooth', width: 3 },
    colors: ['#38bdf8'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 0.4, opacityFrom: 0.4, opacityTo: 0.05 } },
    xaxis: { categories: ['G-14','G-13','G-12','G-11','G-10','G-9','G-8','G-7','G-6','G-5','G-4','G-3','G-2','G-1'] }
  };

  const distOptions = {
    chart: { type: 'bar', height: 220, toolbar: { show: false }, foreColor: '#94a3b8' },
    series: [
      { name: 'Neural', data: [1.7, 2.3, 2.8, 3.6, 4.1] },
      { name: 'Market', data: [1.9, 2.4, 3.1, 3.7, 4.4] }
    ],
    colors: ['#3b82f6', '#64748b'],
    plotOptions: { bar: { columnWidth: '50%', borderRadius: 4 } },
    xaxis: { categories: ['1.5-2.0','2.0-2.5','2.5-3.0','3.0-3.5','3.5+'] }
  };

  new ApexCharts(document.querySelector('#edgeChart'), edgeOptions).render();
  new ApexCharts(document.querySelector('#distributionChart'), distOptions).render();
}

function sendPrompt(text) {
  alert(text + "\n\nBu alanı gerçek yapay zeka akışına bağlayabiliriz.");
}

renderTable('tümü');
updateTime();
setInterval(updateTime, 1000);
window.addEventListener('load', mountCharts);
