/* Formato "explorable": una lección es un texto vivo que se va desplegando.
   Cada sección = poca explicación + una figura que se toca. Las preguntas sirven para
   pensar antes de ver (predicción), nunca para puntuar. */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const E = window.EX = {};          // figuras del formato explorable
  const css = `
.xp-top{position:sticky;top:0;z-index:20;background:color-mix(in oklab,var(--bg) 90%,transparent);backdrop-filter:blur(10px);padding:calc(10px + env(safe-area-inset-top)) 16px 10px;border-bottom:1px solid var(--line)}
.xp-top .in{max-width:720px;margin:0 auto;display:flex;align-items:center;gap:12px}
.xp-top .t{flex:1;min-width:0}
.xp-top .t small{display:block;font-size:12px;color:var(--c);font-weight:700;letter-spacing:.05em;text-transform:uppercase}
.xp-top .t b{display:block;font:700 15px/1.25 var(--display);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.xp-prog{height:4px;background:var(--line);border-radius:9px;margin:8px auto 0;max-width:720px;overflow:hidden}
.xp-prog i{display:block;height:100%;background:var(--c);transition:width .5s}
.xp{max-width:720px;margin:0 auto;padding:8px 20px calc(120px + env(safe-area-inset-bottom))}
.xp-sec{padding:34px 0 8px;animation:in .45s ease both}
.xp-sec + .xp-sec{border-top:1px dashed var(--line)}
.xp-sec .n{font:700 12px var(--body);color:var(--c);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px}
.xp-sec h2{font-size:clamp(23px,3.4vw,30px);font-weight:800;letter-spacing:-.015em;margin-bottom:12px}
.xp-sec .txt{font-size:17.5px;line-height:1.7;max-width:64ch}
.xp-sec .txt p{margin:0 0 14px}
.xp-sec .txt b{font-weight:700}
.xp-fig{background:var(--surface);border:1px solid var(--line);border-radius:20px;box-shadow:var(--shadow);padding:16px;margin:18px 0}
.xp-fig .cap{font-size:13.5px;color:var(--muted);margin-top:10px}
.xp-try{display:flex;gap:10px;align-items:flex-start;background:var(--c-soft);border-radius:14px;padding:12px 14px;margin:14px 0 4px;font-size:15.5px}
.xp-try .ic{flex:none;width:22px;height:22px;border-radius:50%;border:2px solid var(--c);display:grid;place-items:center;margin-top:1px;transition:all .3s}
.xp-try.done .ic{background:var(--c);color:#fff}
.xp-try.done .ic::after{content:"";width:9px;height:5px;border:2.5px solid #fff;border-top:0;border-right:0;transform:rotate(-45deg) translate(1px,-1px)}
.xp-aha{border-left:4px solid var(--c);padding:6px 0 6px 16px;margin:16px 0;font-size:17px;line-height:1.65;animation:in .4s ease both}
.xp-aha b:first-child{display:block;font:800 13px var(--body);color:var(--c);letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px}
.xp-pred{display:grid;gap:8px;margin:14px 0}
.xp-pred .qq{font-weight:700;font-size:17px;margin-bottom:4px}
.xp-pred button{text-align:left;background:var(--surface);border:2px solid var(--line);border-radius:14px;padding:12px 14px;font-size:16px;transition:border-color .15s}
.xp-pred button:hover{border-color:color-mix(in oklab,var(--c) 45%,var(--line))}
.xp-pred button.pick{border-color:var(--c);background:var(--c-soft)}
.xp-pred.locked button:not(.pick){opacity:.5}
.xp-next{display:flex;justify-content:center;padding:18px 0 4px}
.xp-next .btn{min-width:200px}
.xp-key{background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:18px 20px;margin:20px 0}
.xp-key h3{font-size:18px;margin-bottom:8px}
.xp-key li{margin:6px 0}
.xp code{background:var(--surface2);border:1px solid var(--line);padding:.05em .35em;border-radius:6px;font-size:.88em}
.live{font-weight:700;color:var(--c);font-variant-numeric:tabular-nums;font-family:var(--mono);font-size:.95em}
/* tabla viva */
.ltab{overflow:auto;border:1px solid var(--line);border-radius:14px;max-height:360px}
.ltab table{border-collapse:collapse;width:100%;font:13px var(--mono);font-variant-numeric:tabular-nums}
.ltab th{position:sticky;top:0;background:var(--surface2);text-align:left;padding:7px 10px;color:var(--muted);font-weight:600;border-bottom:1px solid var(--line);white-space:nowrap}
.ltab td{padding:6px 10px;border-bottom:1px solid var(--line);white-space:nowrap;transition:opacity .35s,background .35s}
.ltab tr.out td{opacity:.18}
.ltab tr.in td{background:color-mix(in oklab,var(--c) 10%,transparent)}
.ltab th.out,.ltab td.cout{opacity:.18}
.chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.chips .lbl{font-size:13px;color:var(--muted);margin-right:2px}
.chip2{border:1.5px solid var(--line);background:var(--surface);border-radius:999px;padding:7px 12px;font:600 13.5px var(--mono);min-height:36px}
.chip2.on{border-color:var(--c);background:var(--c);color:#fff}
/* máquina de consultas */
.qm-stages{display:grid;gap:10px;margin-top:12px}
.qm-st{border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--surface)}
.qm-st > .hd{display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--surface2);cursor:pointer}
.qm-st .k{font:700 12.5px var(--mono);color:#fff;background:var(--c);border-radius:7px;padding:3px 8px}
.qm-st .d{flex:1;font:12.5px var(--mono);color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.qm-st .c{font:600 12.5px var(--body);color:var(--ink);font-variant-numeric:tabular-nums}
.qm-st.skip{opacity:.45}
.qm-st.skip .k{background:var(--muted)}
.qm-st .bd{padding:10px}
.qm-st .bd .ltab{max-height:200px}
.qm-arrow{height:14px;display:flex;justify-content:center;margin:-6px 0}
.qm-arrow::after{content:"";width:2px;height:100%;background:var(--line)}
.xp-ed textarea{width:100%;min-height:96px;resize:vertical;white-space:pre;overflow-wrap:normal;overflow-x:auto;font:15px/1.55 var(--mono);background:var(--surface2);color:var(--ink);border:2px solid var(--line);border-radius:14px;padding:12px 14px;outline:none}
.xp-ed textarea:focus{border-color:var(--c)}
.xp-err{color:var(--bad);font:13px var(--mono);background:var(--bad-bg);padding:9px 12px;border-radius:10px;margin-top:8px;white-space:pre-wrap}
/* neurona */
.nr{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:center}
.nr svg{width:100%;height:auto}
.nr .ctl{display:grid;gap:10px}
.nr label{display:grid;grid-template-columns:1fr auto;gap:2px 8px;font-size:14px;color:var(--muted)}
.nr label input{grid-column:1/3;accent-color:var(--c);width:100%;height:26px}
.nr label .v{font:600 13px var(--mono);color:var(--ink)}
.scen{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px}
.scen div{border:1.5px solid var(--line);border-radius:12px;padding:8px;text-align:center;font-size:13px;background:var(--surface2);transition:all .25s}
.scen div b{display:block;font-size:20px;line-height:1.2;margin-bottom:2px}
.scen div.ok{border-color:var(--good);background:var(--good-bg)}
.scen div.ko{border-color:var(--bad);background:var(--bad-bg)}
@media (max-width:600px){
  .xp{padding:4px 16px calc(110px + env(safe-area-inset-bottom))}
  .xp-sec{padding:26px 0 4px}
  .xp-sec .txt{font-size:16.5px}
  .xp-fig{padding:12px;margin:14px -6px;border-radius:16px}
  .nr{grid-template-columns:1fr}
  .scen{grid-template-columns:repeat(2,1fr)}
  .xp-ed textarea{font-size:16px}
  .xp-next .btn{width:100%}
}`;
  document.head.append(Object.assign(document.createElement('style'), { textContent: css }));

  /* ---------- Reproductor ---------- */
  window.EXPLORE = function ({ c, l }) {
    const N = window.NODO; const app = $('#app');
    const secs = l.sections; let shown = 0;
    const prog = h('i', { style: 'width:0' });
    const body = h('main', { class: 'xp' });
    app.replaceChildren(h('div', { class: 'xp-top' }, h('div', { class: 'in' },
      h('button', { class: 'x', 'aria-label': 'Salir', html: ICON.x, onclick: () => go(c.id) }),
      h('div', { class: 't' }, h('small', {}, c.title), h('b', {}, l.title))),
      h('div', { class: 'xp-prog' }, prog)), body);
    window.scrollTo({ top: 0 });
    const upd = () => prog.style.width = (100 * shown / secs.length) + '%';
    function show(i) {
      const s = secs[i]; shown = i + 1; upd();
      const sec = h('section', { class: 'xp-sec' });
      if (s.n !== false) sec.append(h('div', { class: 'n' }, s.n || `${i + 1} de ${secs.length}`));
      if (s.h) sec.append(h('h2', {}, s.h));
      if (s.text) sec.append(h('div', { class: 'txt', html: s.text }));
      (s.blocks || (s.code ? [{ file: s.file, code: s.code }] : [])).forEach(b => { if (b.text) sec.append(h('div', { class: 'txt', html: b.text })); if (b.code) N.codeBlock(sec, b.code, b.file); });
      if (s.after) sec.append(h('div', { class: 'txt', html: s.after }));
      body.append(sec);
      const next = h('div', { class: 'xp-next' });
      sec.append(next);
      let ended = false;
      const goOn = () => {
        next.replaceChildren();
        if (i + 1 < secs.length) { show(i + 1); setTimeout(() => body.lastChild.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); }
        else finish();
      };
      const end = () => {
        if (ended) return; ended = true;
        if (s.aha) sec.insertBefore(h('div', { class: 'xp-aha', html: '<b>La idea</b>' + s.aha }), next);
        next.replaceChildren(h('button', { class: 'btn', onclick: goOn }, i + 1 < secs.length ? 'Seguir' : 'Terminar lección'));
      };
      window.__xpEnd = end;
      const mountFig = () => {
        const fig = h('div', { class: 'xp-fig w' }); sec.insertBefore(fig, next);
        let tryEl = null;
        if (s.try) { tryEl = h('div', { class: 'xp-try' }, h('span', { class: 'ic' }), h('div', { html: s.try })); fig.after(tryEl); }
        let solved = false;
        E[s.fig](fig, s.o || {}, { done: () => { if (solved) return; solved = true; tryEl && tryEl.classList.add('done'); if (!s.checks) end(); } });
        if (s.cap) fig.append(h('div', { class: 'cap', html: s.cap }));
      };
      const mountChecks = () => {
        const cs = s.checks.map(() => h('input', { type: 'checkbox' }));
        const box = h('div', { class: 'checks' }, s.checks.map((t, k) => h('label', {}, cs[k], h('span', { html: t }))));
        sec.insertBefore(box, next);
        const st = h('div', { class: 'status', style: 'text-align:center;width:100%' }, 'Marca cada hito cuando lo tengas hecho en tu ordenador');
        next.replaceChildren(st);
        const upd2 = () => { if (cs.every(x => x.checked)) end(); };
        cs.forEach(x => x.addEventListener('change', upd2));
      };
      const reveal = () => {
        if (s.fig) mountFig();
        if (s.checks) mountChecks();
        else if (!(s.fig && s.try)) end();
      };
      if (s.predict) {
        const p = s.predict; const box = h('div', { class: 'xp-pred' }, h('div', { class: 'qq', html: p.q }));
        const bs = p.opts.map((o, k) => h('button', { html: o, onclick: () => {
          if (box.classList.contains('locked')) return;
          box.classList.add('locked'); bs[k].classList.add('pick');
          sec.insertBefore(h('div', { class: 'xp-aha', html: '<b>' + (k === p.a ? 'Bien pensado' : 'Lo que pasa en realidad') + '</b>' + (k === p.a ? '' : 'La respuesta es: <i>' + p.opts[p.a] + '</i>. ') + p.why }), next);
          reveal();
        } }));
        box.append(...bs); sec.insertBefore(box, next);
      } else reveal();
    }
    function finish() {
      N.S.done[l.id] = true; if (!N.S.days.includes(N.today())) N.S.days.push(N.today()); N.save();
      prog.style.width = '100%';
      const ls = N.allLessons(c); const nx = ls.slice(ls.findIndex(x => x.id === l.id) + 1).find(x => !N.S.done[x.id]);
      body.append(h('section', { class: 'xp-sec' },
        h('div', { class: 'n' }, 'Lección terminada'), h('h2', {}, l.keysTitle || 'Lo que ahora entiendes'),
        h('div', { class: 'xp-key' }, h('ul', {}, (l.keys || []).map(k => h('li', { html: k })))),
        h('div', { class: 'xp-next', style: 'gap:10px;flex-wrap:wrap' },
          h('button', { class: 'btn ghost', onclick: () => go(c.id) }, 'Volver a la ruta'),
          nx ? h('button', { class: 'btn', onclick: () => go(nx.id) }, 'Siguiente: ' + nx.title) : null)));
      setTimeout(() => body.lastChild.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    }
    show(0);
  };

  /* ---------- utilidades ---------- */
  const resolveC = () => { const d = document.createElement('i'); d.style.color = 'var(--c)'; document.body.append(d); const v = getComputedStyle(d).color; d.remove(); return v; };
  const rgba = (c, a) => { const m = c.match(/\d+(\.\d+)?/g); return m ? `rgba(${m[0]},${m[1]},${m[2]},${a})` : c; };
  const ltab = (cols, rows, rowCls, colOut) => h('div', { class: 'ltab' }, h('table', {},
    h('thead', {}, h('tr', {}, cols.map((c, j) => h('th', { class: colOut && colOut(j) ? 'out' : '' }, c)))),
    h('tbody', {}, rows.map((r, i) => h('tr', { class: rowCls ? rowCls(i) : '' }, r.map((v, j) => h('td', { class: colOut && colOut(j) ? 'cout' : '' }, v === null ? 'NULL' : String(v))))))));
  const q1 = (sql) => { const db = SQLE.fresh('f1'); try { return db.exec(sql)[0] || { columns: [], values: [] }; } finally { db.close(); } };
  const ready = async (el) => { if (!SQLE.ready) { el.replaceChildren(h('div', { class: 'status' }, 'Preparando la base de datos…')); await SQLE.init(); } };

  /* SQL · Colador: WHERE visual con chips (sin teclear) */
  E.sieve = async (fig, o, api) => {
    await ready(fig);
    const all = q1('SELECT forename, surname, nationality, dob FROM drivers ORDER BY driverId');
    const conds = { nat: null, born: null };
    const nats = ['Spanish', 'German', 'British', 'Finnish', 'Australian'];
    const out = h('div'); const live = h('div', { class: 'status', style: 'margin:10px 0 8px;font-size:14px' });
    const sqlEl = h('pre', { class: 'code', style: 'margin:10px 0 0' });
    const row1 = h('div', { class: 'chips' }, h('span', { class: 'lbl' }, 'nationality ='), ...nats.map(n => h('button', { class: 'chip2', onclick: e => { conds.nat = conds.nat === n ? null : n; draw(); } }, `'${n}'`)));
    const row2 = h('div', { class: 'chips', style: 'margin-top:8px' }, h('span', { class: 'lbl' }, 'dob >'), ...['1975', '1980', '1985', '1990'].map(y => h('button', { class: 'chip2', onclick: () => { conds.born = conds.born === y ? null : y; draw(); } }, `'${y}-01-01'`)));
    fig.replaceChildren(row1, row2, sqlEl, live, out);
    function draw() {
      [...row1.querySelectorAll('.chip2')].forEach((b, k) => b.classList.toggle('on', nats[k] === conds.nat));
      [...row2.querySelectorAll('.chip2')].forEach(b => b.classList.toggle('on', b.textContent.includes(conds.born || 'x')));
      const keep = all.values.map(r => (!conds.nat || r[2] === conds.nat) && (!conds.born || r[3] > conds.born));
      const w = [conds.nat && `nationality = '${conds.nat}'`, conds.born && `dob > '${conds.born}-01-01'`].filter(Boolean);
      sqlEl.textContent = 'SELECT * FROM drivers' + (w.length ? '\nWHERE ' + w.join('\n  AND ') : '') + ';';
      const n = keep.filter(Boolean).length;
      live.innerHTML = w.length ? `La condición se evalúa <b>fila a fila</b>: pasan <span class="live">${n}</span> de ${all.values.length}.` : `Sin WHERE pasan las <span class="live">${all.values.length}</span> filas.`;
      out.replaceChildren(ltab(all.columns, all.values, i => w.length ? (keep[i] ? 'in' : 'out') : ''));
      if (o.goalNat && conds.nat === o.goalNat && conds.born === o.goalBorn) api.done();
    }
    draw();
  };

  /* botón "Ver una solución" que aparece tras unos intentos */
  const solBtn = (onUse, after = 3) => { const b = h('button', { class: 'btn ghost sm', style: 'display:none' }, 'Ver una solución'); let n = 0; b.onclick = onUse; b.tick = () => { if (++n >= after) b.style.display = ''; }; setTimeout(() => b.style.display = '', 60000); return b; };

  /* SQL · Máquina de consultas: ejecuta por etapas y enseña cada tabla intermedia */
  E.qmachine = async (fig, o, api) => {
    await ready(fig);
    const ta = h('textarea', { spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off', 'aria-label': 'Consulta SQL' }); ta.value = o.start || '';
    const err = h('div'); const st = h('div', { class: 'qm-stages' });
    const sb = o.goal ? solBtn(() => { ta.value = o.goal; run(); }) : null;
    fig.replaceChildren(h('div', { class: 'xp-ed' }, window.NODO.kbd(ta, window.NODO.SQLK()), ta), sb ? h('div', { style: 'margin-top:6px' }, sb) : '', err, st);
    let open = o.open ?? 4, timer;
    ta.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { sb && sb.tick(); run(); }, 450); });
    function parse(sql) {
      const s = sql.replace(/--.*$/gm, '').replace(/;\s*$/, '').replace(/\s+/g, ' ').trim();
      const m = s.match(/^SELECT (.+?) FROM (.+?)(?: WHERE (.+?))?(?: GROUP BY (.+?))?(?: HAVING (.+?))?(?: ORDER BY (.+?))?(?: LIMIT (\d+))?$/i);
      return m && { sel: m[1], from: m[2], where: m[3], group: m[4], having: m[5], order: m[6], limit: m[7] };
    }
    function run() {
      const p = parse(ta.value);
      if (!p) { err.replaceChildren(h('div', { class: 'xp-err' }, 'La máquina entiende: SELECT … FROM … [WHERE …] [GROUP BY …] [HAVING …] [ORDER BY …] [LIMIT n]')); st.replaceChildren(); return; }
      const W = p.where ? ` WHERE ${p.where}` : '', G = p.group ? ` GROUP BY ${p.group}` : '', HV = p.having ? ` HAVING ${p.having}` : '', O = p.order ? ` ORDER BY ${p.order}` : '', Lm = p.limit ? ` LIMIT ${p.limit}` : '';
      const stages = [
        { k: 'FROM', d: p.from, sql: `SELECT * FROM ${p.from}` },
        { k: 'WHERE', d: p.where || '(sin filtro)', sql: `SELECT * FROM ${p.from}${W}`, skip: !p.where }];
      if (p.group) {
        stages.push({ k: 'GROUP BY', d: p.group, sql: `SELECT ${p.group}, COUNT(*) AS filas_del_grupo FROM ${p.from}${W}${G}` });
        stages.push({ k: 'HAVING', d: p.having || '(todos los grupos)', sql: `SELECT ${p.group}, COUNT(*) AS filas_del_grupo FROM ${p.from}${W}${G}${HV}`, skip: !p.having });
      }
      stages.push({ k: 'SELECT', d: p.sel, sql: `SELECT ${p.sel} FROM ${p.from}${W}${G}${HV}` },
        { k: 'ORDER BY', d: p.order || '(orden sin garantizar)', sql: `SELECT ${p.sel} FROM ${p.from}${W}${G}${HV}${O}`, skip: !p.order },
        { k: 'LIMIT', d: p.limit || '(todas)', sql: `SELECT ${p.sel} FROM ${p.from}${W}${G}${HV}${O}${Lm}`, skip: !p.limit });
      const res = []; let e = null;
      for (const s of stages) { try { res.push(q1(s.sql)); } catch (x) { e = `Falla en la etapa ${s.k}: ${x.message}`; break; } }
      err.replaceChildren(e ? h('div', { class: 'xp-err' }, e) : '');
      const op = open === 'last' ? res.length - 1 : open;
      st.replaceChildren(...res.flatMap((r, i) => {
        const s = stages[i];
        const card = h('div', { class: 'qm-st' + (s.skip ? ' skip' : '') },
          h('div', { class: 'hd', onclick: () => { open = op === i ? -1 : i; run(); } }, h('span', { class: 'k' }, (i + 1) + ' · ' + s.k), h('span', { class: 'd' }, s.d), h('span', { class: 'c' }, `${r.values.length} × ${r.columns.length}`)),
          op === i ? h('div', { class: 'bd' }, ltab(r.columns, r.values.slice(0, 40))) : null);
        return i ? [h('div', { class: 'qm-arrow' }), card] : [card];
      }));
      if (!e && o.goal) { try { const exp = q1(o.goal); const got = res[res.length - 1]; if (got && SQLE.same([got], [exp], !!o.ordered).ok) api.done(); } catch (x) {} }
    }
    run();
  };

  /* SQL · consola viva (cualquier sentencia, también DDL/DML/triggers/EXPLAIN) */
  E.sqllive = async (fig, o, api) => {
    await ready(fig);
    const db = o.db || 'f1'; const sch = db === 'f1' ? window.F1_SCHEMA : window.FILMS_SCHEMA;
    const ta = h('textarea', { spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off', 'aria-label': 'SQL' }); ta.value = o.start || '';
    const out = h('div', { style: 'margin-top:10px' });
    const sb = o.goal ? solBtn(() => { ta.value = o.goal; run(); }) : null;
    const chips = h('div', { class: 'schema' }, Object.entries(o.tables ? Object.fromEntries(o.tables.map(t => [t, sch[t]])) : sch).map(([t, c]) => h('span', { html: `<b>${t}</b>(${c})` })));
    fig.replaceChildren(chips, h('div', { class: 'xp-ed' }, window.NODO.kbd(ta, window.NODO.SQLK()), ta), sb ? h('div', { style: 'margin-top:6px' }, sb) : '', out);
    let timer; ta.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { sb && sb.tick(); run(); }, 500); });
    function exec(sql) { return SQLE.run(db, o.verify ? sql + ';\n' + o.verify : sql, o.pre); }
    function run() {
      const r = exec(ta.value);
      if (r.err) { out.replaceChildren(h('div', { class: 'xp-err' }, r.err)); return; }
      const t = r.r[r.r.length - 1];
      out.replaceChildren(o.verify ? h('div', { class: 'status', style: 'margin-bottom:6px' }, 'Comprobación: ' + o.verify.split(';').filter(x => x.trim()).pop().trim()) : '', t ? ltab(t.columns, t.values.slice(0, 60)) : h('div', { class: 'status' }, 'Hecho (sin filas que mostrar).'));
      if (o.goal) { const ref = exec(o.goal); if (!ref.err && SQLE.same(r.r, ref.r, !!o.ordered).ok) api.done(); }
    }
    run();
  };

  /* JS · laboratorio: construyes una pieza del motor con JavaScript */
  E.jslab = async (fig, o, api) => {
    const data = {};
    if (o.sql) { await ready(fig); for (const [k, q] of Object.entries(o.sql)) { const t = q1(q); data[k] = t.values.map(r => Object.fromEntries(t.columns.map((c, j) => [c, r[j]]))); } }
    Object.assign(data, o.data || {});
    const ta = h('textarea', { spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off', 'aria-label': 'Código JavaScript', style: 'min-height:' + (o.rows || 9) * 1.55 + 'em' }); ta.value = o.start;
    const out = h('div', { style: 'margin-top:10px' });
    const sb = o.sol ? solBtn(() => { ta.value = o.sol; run(); }) : null;
    fig.replaceChildren(h('div', { class: 'xp-ed' }, h('div', { class: 'status', style: 'margin-bottom:6px' }, o.label || 'JavaScript · se ejecuta mientras escribes'), ta), sb ? h('div', { style: 'margin-top:6px' }, sb) : '', out);
    let timer; ta.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { sb && sb.tick(); run(); }, 450); });
    ta.addEventListener('keydown', e => { if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('  ', s, ta.selectionEnd, 'end'); } });
    function run() {
      try {
        const names = Object.keys(data);
        const r = new Function(...names, ta.value + '\n;return (' + o.call + ');')(...names.map(k => JSON.parse(JSON.stringify(data[k]))));
        if (Array.isArray(r) && r.length && typeof r[0] === 'object' && r[0] !== null && !Array.isArray(r[0])) { const cols = Object.keys(r[0]); out.replaceChildren(h('div', { class: 'status', style: 'margin-bottom:6px' }, `${r.length} fila(s)`), ltab(cols, r.slice(0, 60).map(x => cols.map(k => typeof x[k] === 'object' ? JSON.stringify(x[k]) : x[k])))); }
        else out.replaceChildren(h('pre', { class: 'code', style: 'margin:0;white-space:pre-wrap' }, typeof r === 'string' ? r : JSON.stringify(r)));
        if (o.check(r, data)) api.done();
      } catch (e) { out.replaceChildren(h('div', { class: 'xp-err' }, String(e.message || e))); }
    }
    run();
  };
  E.minidb = (fig, o, api) => E.jslab(fig, Object.assign({ sql: { drivers: 'SELECT forename, surname, nationality, dob FROM drivers' }, call: 'consulta(drivers)', label: 'JavaScript · se ejecuta mientras escribes · `drivers` es un array de 18 objetos' }, o), api);

  /* IA · Una neurona que decide */
  E.decide = (fig, o, api) => {
    const S = { w1: 0.3, w2: 0.6, b: -0.2, x1: 1, x2: 0.4 };
    const sig = z => 1 / (1 + Math.exp(-z));
    const scen = [{ e: '🌧️', t: 'Llueve, frío', x1: 1, x2: 0.2, want: 0 }, { e: '🌦️', t: 'Llueve, templado', x1: 1, x2: 0.7, want: 0 }, { e: '⛅', t: 'Seco, frío', x1: 0, x2: 0.2, want: 1 }, { e: '☀️', t: 'Seco, templado', x1: 0, x2: 0.8, want: 1 }];
    const svg = h('div'); const sent = h('div', { class: 'txt', style: 'font-size:15.5px;margin-top:12px' });
    const mk = (k, label, min, max, step) => { const v = h('span', { class: 'v' }); const i = h('input', { type: 'range', min, max, step, value: S[k], 'aria-label': label }); i.oninput = () => { S[k] = +i.value; draw(); }; const l = h('label', {}, label, v, i); l._v = v; l._k = k; return l; };
    const ins = [mk('x1', 'lluvia (0 = nada, 1 = mucha)', 0, 1, 0.05), mk('x2', 'temperatura (0 = frío, 1 = calor)', 0, 1, 0.05)];
    const ws = [mk('w1', 'peso de la lluvia  w₁', -3, 3, 0.1), mk('w2', 'peso de la temperatura  w₂', -3, 3, 0.1), mk('b', 'sesgo  b', -3, 3, 0.1)];
    const sc = h('div', { class: 'scen' });
    fig.append(h('div', { class: 'nr' }, svg, h('div', { class: 'ctl' }, ...ins, h('hr', { style: 'border:0;border-top:1px solid var(--line);margin:2px 0' }), ...ws)), sent, h('div', { class: 'status', style: 'margin-top:12px' }, 'Banco de pruebas: ¿acierta la neurona en estos 4 días?'), sc);
    function draw() {
      const K = resolveC();
      [...ins, ...ws].forEach(l => l._v.textContent = S[l._k].toFixed(2));
      const z = S.w1 * S.x1 + S.w2 * S.x2 + S.b, y = sig(z);
      const lw = w => Math.max(1.5, Math.min(9, Math.abs(w) * 3)), lc = w => w >= 0 ? K : 'var(--rust)';
      svg.innerHTML = `<svg viewBox="0 0 300 200" role="img" aria-label="Diagrama de la neurona">
        <line x1="60" y1="55" x2="170" y2="100" stroke="${lc(S.w1)}" stroke-width="${lw(S.w1)}" stroke-linecap="round" opacity=".85"/>
        <line x1="60" y1="145" x2="170" y2="100" stroke="${lc(S.w2)}" stroke-width="${lw(S.w2)}" stroke-linecap="round" opacity=".85"/>
        <line x1="170" y1="100" x2="250" y2="100" stroke="var(--line)" stroke-width="3"/>
        <circle cx="45" cy="55" r="24" fill="var(--surface2)" stroke="var(--line)" stroke-width="2"/><text x="45" y="60" text-anchor="middle" font-size="15" fill="var(--ink)" font-family="JetBrains Mono, monospace">${S.x1.toFixed(1)}</text>
        <circle cx="45" cy="145" r="24" fill="var(--surface2)" stroke="var(--line)" stroke-width="2"/><text x="45" y="150" text-anchor="middle" font-size="15" fill="var(--ink)" font-family="JetBrains Mono, monospace">${S.x2.toFixed(1)}</text>
        <text x="45" y="22" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="Figtree, sans-serif">lluvia</text><text x="45" y="190" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="Figtree, sans-serif">temperatura</text>
        <circle cx="170" cy="100" r="34" fill="${rgba(K, .12 + .7 * y)}" stroke="${K}" stroke-width="2.5"/><text x="170" y="96" text-anchor="middle" font-size="11" fill="var(--ink)" font-family="Figtree, sans-serif">σ(z)</text><text x="170" y="114" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)" font-family="JetBrains Mono, monospace">${y.toFixed(2)}</text>
        <text x="275" y="94" text-anchor="middle" font-size="22">${y > .5 ? '🏃' : '🛋️'}</text><text x="275" y="122" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="Figtree, sans-serif">${y > .5 ? 'sale' : 'se queda'}</text></svg>`;
      sent.innerHTML = `z = <span class="live">${S.w1.toFixed(1)}</span>·${S.x1.toFixed(1)} + <span class="live">${S.w2.toFixed(1)}</span>·${S.x2.toFixed(1)} + (<span class="live">${S.b.toFixed(1)}</span>) = <b>${z.toFixed(2)}</b>. La sigmoide lo aplasta entre 0 y 1: <b>${(y * 100).toFixed(0)} %</b> de ganas de salir.`;
      let ok = 0;
      sc.replaceChildren(...scen.map(s => { const p = sig(S.w1 * s.x1 + S.w2 * s.x2 + S.b) > .5 ? 1 : 0; const good = p === s.want; ok += good; return h('div', { class: good ? 'ok' : 'ko' }, h('b', {}, s.e), s.t, h('div', { style: 'font-weight:700;margin-top:2px' }, p ? 'sale' : 'no sale')); }));
      if (ok === 4) api.done();
    }
    draw();
  };

  /* IA · Sigmoide: ¿qué hace multiplicar los pesos? */
  E.sigmoid = (fig, o, api) => {
    let k = 1; const c = h('canvas', { style: 'width:100%;height:220px;display:block;border-radius:12px;background:var(--surface2)' }); fig.append(c);
    const v = h('span', { class: 'readout' }); const inp = h('input', { type: 'range', min: 0.2, max: 6, step: 0.1, value: 1, 'aria-label': 'Multiplicador de pesos', style: 'flex:1;accent-color:var(--c)' });
    inp.oninput = () => { k = +inp.value; draw(); if (k >= 4) api.done(); };
    fig.append(h('div', { class: 'row', style: 'display:flex;gap:10px;align-items:center;margin-top:10px' }, h('span', { class: 'status' }, 'pesos ×'), inp, v));
    function draw() {
      const d = devicePixelRatio || 1, W = c.clientWidth, H = 220; c.width = W * d; c.height = H * d; const x = c.getContext('2d'); x.scale(d, d); const K = resolveC();
      v.textContent = '×' + k.toFixed(1);
      x.strokeStyle = 'rgba(128,128,128,.35)'; x.beginPath(); x.moveTo(0, H / 2); x.lineTo(W, H / 2); x.moveTo(W / 2, 10); x.lineTo(W / 2, H - 10); x.stroke();
      x.strokeStyle = K; x.lineWidth = 3; x.beginPath(); for (let i = 0; i <= W; i++) { const z = (i / W - .5) * 8; x.lineTo(i, H - 15 - (H - 30) / (1 + Math.exp(-k * z))); } x.stroke();
      x.fillStyle = getComputedStyle(document.body).color; x.font = '12px Figtree, sans-serif'; x.fillText('salida = σ(k·z)', 10, 18); x.fillText('z →', W - 30, H / 2 - 6);
    }
    requestAnimationFrame(draw);
  };

  /* reutilizar figuras del formato anterior (ajuste de recta, descenso de gradiente…) */
  ['neuron', 'gd', 'classify', 'conv', 'tokens', 'embed', 'attention', 'temperature', 'wave', 'clip', 'trace', 'txn', 'index', 'joinviz', 'groupby'].forEach(n => {
    E[n] = (fig, o, api) => window.W[n](fig, o, { solved: () => api.done() });
  });

  /* Python en vivo (Pyodide) con objetivo */
  E.pylive = (fig, o, api) => {
    const PY = window.NODO.PY;
    const ta = h('textarea', { spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off', 'aria-label': 'Código Python' }); ta.value = o.start;
    const con = h('div', { class: 'console', style: 'margin-top:10px' }, '▸ Cargando Python…');
    const runB = h('button', { class: 'btn sm', onclick: run }, 'Ejecutar');
    const sb = o.sol ? solBtn(() => { ta.value = o.sol; }, 2) : null;
    ta.style.minHeight = (o.rows || 10) * 1.55 + 'em';
    fig.append(h('div', { class: 'xp-ed' }, window.NODO.kbd(ta, window.NODO.PYK()), ta), h('div', { style: 'display:flex;gap:8px;margin-top:8px' }, runB, sb || ''), con);
    ta.addEventListener('keydown', e => { if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('    ', s, ta.selectionEnd, 'end'); } if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') run(); });
    PY.load().then(ok => con.textContent = ok ? '▸ Python listo. Pulsa Ejecutar.' : 'No se pudo cargar Python aquí. Lee el código y sigue.');
    async function run() {
      if (!(await PY.load())) { api.done(); return; }
      sb && sb.tick(); con.textContent = 'Ejecutando…'; const r = await PY.run(ta.value);
      con.textContent = (r.out || '') + (r.err ? '\n' + r.err : '') || '(sin salida)';
      if (!r.err && new RegExp(o.expect).test((r.out || '').trim())) api.done();
    }
  };
})();
