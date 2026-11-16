/* Apuntes: se generan del contenido de cada lección y crecen a medida que avanzas.
   Se pueden consultar dentro de la lección y descargar en PDF (imprimir → Guardar como PDF). */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const css = `
.nt-btn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:var(--surface);border-radius:12px;padding:8px 12px;font:600 13.5px var(--body);flex:none}
.nt-btn b{background:var(--c);color:#fff;border-radius:99px;font-size:11px;padding:1px 7px;font-variant-numeric:tabular-nums}
.nt-sheet{position:fixed;inset:0;z-index:60;background:rgba(10,15,20,.45);display:flex;align-items:flex-end;justify-content:center;animation:fadein .2s}
@keyframes fadein{from{opacity:0}to{opacity:1}}
.nt-panel{background:var(--bg);width:100%;max-width:760px;max-height:88vh;border-radius:22px 22px 0 0;display:flex;flex-direction:column;box-shadow:0 -10px 40px rgba(0,0,0,.2);animation:up .25s ease}
@keyframes up{from{transform:translateY(40px)}to{transform:none}}
.nt-head{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid var(--line)}
.nt-head h3{flex:1;font-size:18px}
.nt-scroll{overflow:auto;padding:6px 20px calc(24px + env(safe-area-inset-bottom))}
.nt{font-size:15.5px;line-height:1.6}
.nt h2{font-size:22px;margin:26px 0 6px;font-family:var(--display)}
.nt h3{font-size:17px;margin:18px 0 6px;font-family:var(--display)}
.nt p{margin:0 0 10px}
.nt pre{background:var(--surface2);border:1px solid var(--line);border-radius:10px;padding:10px 12px;font:12.5px/1.5 var(--mono);white-space:pre-wrap;word-break:break-word;margin:8px 0}
.nt code{background:var(--surface2);border:1px solid var(--line);padding:.05em .3em;border-radius:5px;font-size:.88em}
.nt .k{border-left:3px solid var(--c);padding:4px 0 4px 12px;margin:10px 0}
.nt .k b:first-child,.nt .q b:first-child,.nt .ex b:first-child{color:var(--c)}
.nt .q,.nt .ex{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin:10px 0}
.nt .sum{background:var(--c-soft);border-radius:14px;padding:12px 16px;margin:14px 0}
.nt .sum ul{margin:6px 0 0;padding-left:20px}
.nt .pend{color:var(--muted);font-style:italic}
.nt .lbl{font:700 11.5px var(--body);text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-top:10px}
.nv{max-width:780px;margin:0 auto;padding:16px 20px 80px}
.nv-cover{padding:24px 0 10px;border-bottom:2px solid var(--c);margin-bottom:8px}
.nv-cover small{color:var(--c);font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:12px}
.nv-cover h1{font-size:clamp(28px,4vw,40px);margin:6px 0}
.nv-bar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:14px 0}
.nv-toc{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:12px 16px;margin:14px 0}
.nv-toc ol{margin:6px 0 0;padding-left:22px}
.nv-toc li{margin:3px 0}
.nv-toc .st{color:var(--muted);font-size:13px}
@media print{
  @page{size:A4;margin:16mm 15mm}
  :root{--bg:#fff;--surface:#fff;--surface2:#f4f6f8;--ink:#111;--muted:#555;--line:#d8dde3;color-scheme:light}
  body{background:#fff!important;color:#111;font-size:11pt}
  .top,.no-print,.nt-sheet{display:none!important}
  .nv{padding:0;max-width:none}
  .nv-cover{min-height:auto;border-bottom-width:3px}
  .nt h2{break-before:page;font-size:17pt}
  .nt h2.first{break-before:auto}
  .nt pre,.nt .k,.nt .q,.nt .ex,.nt .sum{break-inside:avoid}
  .nt pre{font-size:8.5pt}
  a{color:inherit;text-decoration:none}
}`;
  document.head.append(Object.assign(document.createElement('style'), { textContent: css }));

  const fmtSQL = q => q.replace(/\s+/g, ' ').replace(/ (FROM|WHERE|JOIN|LEFT JOIN|GROUP BY|HAVING|ORDER BY|LIMIT|UNION ALL|UNION|AND|BEGIN|END;?) /g, (m, k) => (k === 'AND' ? '\n  AND ' : '\n' + k + ' ')).replace(/\bLEFT\n/g, 'LEFT ').trim();
  const strip = html => String(html || '').replace(/<pre[^>]*>/g, '<pre>');

  const N = window.NOTES = {};
  window.addEventListener('hashchange', () => document.querySelectorAll('.nt-sheet').forEach(s => s.remove()));
  N.total = l => (l.sections || []).length;
  N.reached = id => { const S = window.NODO.S; const f = window.NODO.findLesson(id); const t = f ? N.total(f.l) : 0; return S.done[id] ? t : Math.min(t, (S.reach || {})[id] || 0); };
  N.reach = (id, n) => { const S = window.NODO.S; S.reach = S.reach || {}; if (n > (S.reach[id] || 0)) { S.reach[id] = n; window.NODO.save(); } N.updBadge && N.updBadge(); };

  /* Apuntes de una sección */
  function section(s) {
    let out = '';
    if (s.h) out += `<h3>${s.h}</h3>`;
    if (s.text) out += strip(s.text);
    (s.blocks || (s.code ? [{ file: s.file, code: s.code }] : [])).forEach(b => { if (b.text) out += strip(b.text); if (b.code) out += (b.file ? `<div class="lbl">${esc(b.file)}</div>` : '') + `<pre>${esc(b.code.trim())}</pre>`; });
    if (s.after) out += strip(s.after);
    if (s.predict) { const p = s.predict; out += `<div class="q"><b>Pregunta.</b> ${p.q}<br><b>Respuesta:</b> ${p.opts[p.a]}. ${p.why}</div>`; }
    const o = s.o || {};
    if (s.fig === 'trace' && o.code) out += `<div class="lbl">Código de la traza</div><pre>${esc(o.code)}</pre>` + (o.states ? `<p>${o.states[o.states.length - 1].msg || ''}</p>` : '');
    if (s.try && (o.sol || o.goal)) {
      out += `<div class="ex"><b>Ejercicio.</b> ${s.try}</div>`;
      if (o.sol) out += `<div class="lbl">Solución de referencia</div><pre>${esc(o.sol.trim())}</pre>`;
      else out += `<div class="lbl">Solución de referencia (SQL)</div><pre>${esc(fmtSQL(o.goal))}</pre>`;
    } else if (s.fig === 'pylive' && o.start) out += `<pre>${esc(o.start.trim())}</pre>`;
    if (s.checks) out += `<div class="lbl">Hitos</div><ul>${s.checks.map(c => `<li>${c}</li>`).join('')}</ul>`;
    if (s.aha) out += `<div class="k"><b>Idea clave.</b> ${s.aha}</div>`;
    return out;
  }
  N.lessonHTML = (l, n, first) => {
    const t = N.total(l); n = Math.min(n, t);
    if (!n) return `<h2 class="first">${esc(l.title)}</h2><p class="pend">Aún no has empezado esta lección.</p>`;
    let out = `<h2 class="${first ? 'first' : ''}">${esc(l.title)}</h2>`;
    l.sections.slice(0, n).forEach(s => out += section(s));
    if (n >= t && l.keys) out += `<div class="sum"><b>${esc(l.keysTitle || 'Resumen')}</b><ul>${l.keys.map(k => `<li>${k}</li>`).join('')}</ul></div>`;
    else out += `<p class="pend">Los apuntes seguirán ampliándose a medida que avances (${n} de ${t} secciones).</p>`;
    return out;
  };

  /* Panel de apuntes dentro de la lección */
  N.button = (l) => {
    const badge = h('b', {}, '0');
    const b = h('button', { class: 'nt-btn', 'aria-label': 'Ver apuntes de esta lección', onclick: () => N.sheet(l) }, 'Apuntes', badge);
    N.updBadge = () => { badge.textContent = N.reached(l.id); };
    N.updBadge();
    return b;
  };
  N.sheet = (l) => {
    const n = N.reached(l.id);
    const close = () => sh.remove();
    const sh = h('div', { class: 'nt-sheet', onclick: e => { if (e.target === sh) close(); } },
      h('div', { class: 'nt-panel', role: 'dialog', 'aria-label': 'Apuntes' },
        h('div', { class: 'nt-head' }, h('h3', {}, 'Apuntes de la lección'), h('button', { class: 'x', 'aria-label': 'Cerrar', html: ICON.x, onclick: close })),
        h('div', { class: 'nt-scroll' }, h('div', { class: 'nt', html: n ? N.lessonHTML(l, n, true) : '<p class="pend">Completa la primera sección y aquí empezarán tus apuntes.</p>' }))));
    document.body.append(sh);
  };

  /* Vista de apuntes del curso completo, imprimible como PDF */
  N.view = (c) => {
    const ls = window.NODO.allLessons(c);
    const tot = ls.reduce((a, l) => a + N.total(l), 0), got = ls.reduce((a, l) => a + N.reached(l.id), 0);
    const complete = got >= tot;
    window.NODO.setColor(c);
    const S = window.NODO.S;
    const nameIn = h('input', { type: 'text', value: S.name || '', placeholder: 'Tu nombre (aparece en la portada)', 'aria-label': 'Tu nombre', style: 'font:inherit;font-size:16px;padding:9px 12px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--ink);min-width:0;flex:1' });
    const owner = h('div', { style: 'color:var(--muted);margin-top:6px' }, S.name ? 'Apuntes de ' + S.name : '');
    nameIn.addEventListener('input', () => { S.name = nameIn.value.trim(); window.NODO.save(); owner.textContent = S.name ? 'Apuntes de ' + S.name : ''; });
    const pdf = () => { try { window.print(); } catch (e) {} };
    document.getElementById('app').replaceChildren(
      h('header', { class: 'top' }, h('div', { class: 'wrap' }, h('button', { class: 'back', style: 'margin:0', onclick: () => go(c.id), html: ICON.left + c.title }))),
      h('main', { class: 'nv' },
        h('div', { class: 'nv-cover' }, h('small', {}, 'Nodo · Apuntes'), h('h1', {}, c.title), owner,
          h('div', { style: 'color:var(--muted);font-size:14px;margin-top:4px' }, `${complete ? 'Curso completo' : `${got} de ${tot} secciones estudiadas`} · ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`)),
        h('div', { class: 'nv-bar no-print' }, nameIn, h('button', { class: 'btn', onclick: pdf }, complete ? 'Descargar PDF completo' : 'Descargar PDF (hasta donde vas)')),
        h('p', { class: 'no-print', style: 'color:var(--muted);font-size:13.5px;margin:0' }, 'Se abre el diálogo de impresión: elige "Guardar como PDF". En iPhone, si usas Nodo instalado como app y no se abre, ábrelo en Safari.'),
        h('div', { class: 'nv-toc' }, h('b', {}, 'Índice'), h('ol', {}, ls.map(l => { const r = N.reached(l.id), t = N.total(l); return h('li', {}, l.title, ' ', h('span', { class: 'st' }, r >= t ? '· completa' : r ? `· ${r}/${t}` : '· pendiente')); }))),
        h('div', { class: 'nt', html: ls.map((l, i) => N.lessonHTML(l, N.reached(l.id), i === 0)).join('') }),
        c.certs ? h('div', { class: 'nt', html: '<h2>Certificaciones recomendadas</h2>' + c.certs.map(x => `<div class="q"><b>${esc(x.name)}</b> · ${esc(x.org)} · ${esc(x.cost)} · ${esc(x.time)}<br>${x.why}<br><span style="color:var(--muted)">${esc(x.url)}</span></div>`).join('') }) : ''));
    window.scrollTo({ top: 0 });
  };
})();
