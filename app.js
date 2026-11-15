/* Nodo — motor de lecciones estilo "aprende haciendo" */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const h = (tag, attrs = {}, ...kids) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'class') e.className = v; else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
    }
    for (const k of kids.flat()) if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(k));
    return e;
  };
  window.h = h;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  window.esc = esc;
  const ICON = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l10-6.5z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8z"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z M4 7.5l8 4.5 8-4.5 M12 12v9"/></svg>',
    flame: '<svg viewBox="0 0 24 24" fill="#F08A24"><path d="M12 2c1 4 5 5.5 5 11a5 5 0 01-10 0c0-2.5 1.2-4 2.2-5 .2 1.6 1 2.6 2 3-.6-3.4.2-6.6.8-9z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="#E3B008"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    left: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    cert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/></svg>'
  };
  window.ICON = ICON;

  /* ---------- Estado persistente (local) ---------- */
  const KEY = 'nodo.v1';
  let S = { done: {}, xp: 0, days: [], last: null, name: '' };
  try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const today = () => new Date().toISOString().slice(0, 10);
  const streak = () => {
    const set = new Set(S.days); let n = 0; const d = new Date();
    if (!set.has(today())) d.setDate(d.getDate() - 1);
    while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  };

  const C = () => window.COURSES || [];
  const course = id => C().find(c => c.id === id);
  const allLessons = c => c.units.flatMap(u => u.lessons);
  const findLesson = id => { for (const c of C()) for (const u of c.units) for (const l of u.lessons) if (l.id === id) return { c, u, l }; };
  const pct = c => { const ls = allLessons(c); return ls.length ? Math.round(100 * ls.filter(l => S.done[l.id]).length / ls.length) : 0; };
  const setColor = c => document.documentElement.style.setProperty('--c', `var(--${c ? c.color : 'sql'})`);

  /* ---------- SQL engine (sql.js) ---------- */
  const SQLE = { ready: false, bytes: {} };
  window.SQLE = SQLE;
  SQLE.init = async () => {
    if (SQLE.ready) return;
    SQLE.lib = await window.initSqlJs({});
    for (const [k, txt] of [['f1', window.F1_SQL], ['films', window.FILMS_SQL]]) {
      const db = new SQLE.lib.Database(); db.exec(txt); SQLE.bytes[k] = db.export(); db.close();
    }
    SQLE.ready = true;
  };
  SQLE.fresh = name => { const db = new SQLE.lib.Database(SQLE.bytes[name]); db.exec('PRAGMA foreign_keys = ON;'); return db; };
  SQLE.run = (name, sql, pre) => {
    const db = SQLE.fresh(name);
    try { if (pre) db.exec(pre); const r = db.exec(sql); return { r }; } catch (e) { return { err: e.message }; } finally { db.close(); }
  };
  const norm = v => v === null ? 'NULL' : typeof v === 'number' ? String(Math.round(v * 1000) / 1000) : String(v).trim();
  SQLE.same = (a, b, ordered) => {
    const A = a.length ? a[a.length - 1] : { columns: [], values: [] }, B = b.length ? b[b.length - 1] : { columns: [], values: [] };
    if (A.columns.length !== B.columns.length) return { ok: false, why: `Tu resultado tiene ${A.columns.length} columna(s); se esperaban ${B.columns.length}.` };
    if (A.values.length !== B.values.length) return { ok: false, why: `Tu consulta devuelve ${A.values.length} fila(s); se esperaban ${B.values.length}.` };
    let ra = A.values.map(r => r.map(norm).join('\u0001')), rb = B.values.map(r => r.map(norm).join('\u0001'));
    if (!ordered) { ra = ra.slice().sort(); rb = rb.slice().sort(); }
    for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) return { ok: false, why: ordered ? 'Mismas filas, pero el orden o algún valor no coincide.' : 'Tienes el número de filas correcto, pero algún valor no coincide.' };
    return { ok: true };
  };
  const table = res => {
    if (!res || !res.length) return h('div', { class: 'res' }, h('div', { class: 'empty' }, 'Sin filas. (Las sentencias que modifican datos no devuelven tabla.)'));
    const t = res[res.length - 1];
    const rows = t.values.slice(0, 60);
    return h('div', { class: 'res' }, h('table', {},
      h('thead', {}, h('tr', {}, t.columns.map(c => h('th', {}, c)))),
      h('tbody', {}, rows.map(r => h('tr', {}, r.map(v => h('td', {}, v === null ? 'NULL' : String(v))))))),
      t.values.length > 60 ? h('div', { class: 'empty' }, `… ${t.values.length - 60} filas más`) : null);
  };
  window.sqlTable = table;

  /* ---------- Python (Pyodide, carga perezosa) ---------- */
  const PY = { state: 'idle', cbs: [] };
  PY.load = () => new Promise(res => {
    if (PY.state === 'ready') return res(true);
    if (PY.state === 'fail') return res(false);
    PY.cbs.push(res);
    if (PY.state === 'loading') return;
    PY.state = 'loading';
    const done = ok => { PY.state = ok ? 'ready' : 'fail'; PY.cbs.splice(0).forEach(f => f(ok)); };
    const timer = setTimeout(() => done(false), 45000);
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
    s.onload = async () => { try { PY.py = await window.loadPyodide(); clearTimeout(timer); done(true); } catch (e) { clearTimeout(timer); done(false); } };
    s.onerror = () => { clearTimeout(timer); done(false); };
    document.head.append(s);
  });
  PY.run = async code => {
    let out = '';
    PY.py.setStdout({ batched: s => out += s + '\n' });
    PY.py.setStderr({ batched: () => {} });
    if (!PY.warnOff) { await PY.py.runPythonAsync('import warnings\nwarnings.filterwarnings("ignore")'); PY.warnOff = true; }
    try { if (/^\s*(import|from)\s+(numpy|pandas)/m.test(code)) await PY.py.loadPackagesFromImports(code); await PY.py.runPythonAsync(code); return { out }; }
    catch (e) { const m = String(e.message || e).split('\n').filter(Boolean); return { out, err: m.slice(-3).join('\n') }; }
  };

  /* ---------- Vistas ---------- */
  const app = $('#app');
  function topbar() {
    return h('header', { class: 'top' }, h('div', { class: 'wrap' },
      h('button', { class: 'logo', onclick: () => go('') , 'aria-label': 'Inicio' },
        h('span', { html: '<svg viewBox="0 0 32 32"><circle cx="8" cy="22" r="5" fill="var(--sql)"/><circle cx="24" cy="22" r="5" fill="var(--rust)"/><circle cx="16" cy="9" r="5" fill="var(--ia)"/><path d="M8 22L16 9l8 13" stroke="var(--ink)" stroke-width="2" fill="none" opacity=".35"/></svg>' }), 'nodo'),
      h('div', { class: 'spacer' }),
      h('span', { class: 'pill', title: 'Días seguidos aprendiendo', html: ICON.flame + streak() }),
      h('span', { class: 'pill', title: 'Puntos de experiencia', html: ICON.bolt + S.xp + ' XP' })));
  }

  function home() {
    setColor(null);
    const last = S.last && findLesson(S.last);
    let resume = null;
    if (last) {
      const ls = allLessons(last.c); const i = ls.findIndex(l => l.id === last.l.id);
      const next = S.done[last.l.id] ? (ls.slice(i + 1).find(l => !S.done[l.id]) || ls[i]) : last.l;
      resume = h('div', { class: 'resume', style: `--c:var(--${last.c.color})` },
        h('div', { class: 'dot', html: ICON.play }),
        h('div', { style: 'flex:1;min-width:0' }, h('small', {}, 'Continúa · ' + last.c.title), h('b', {}, next.title)),
        h('button', { class: 'btn sm', onclick: () => go(next.id) }, 'Seguir'));
    }
    app.replaceChildren(topbar(), h('main', { class: 'wrap' },
      h('section', { class: 'hero' },
        h('div', {}, h('h1', {}, 'Aprende haciendo, un paso cada vez.'),
          h('p', {}, 'Cuatro rutas con problemas interactivos, visualizaciones que puedes tocar y proyectos reales. Primero intentas, luego entiendes por qué.')),
        resume || h('div', { class: 'resume' }, h('div', { class: 'dot', html: ICON.star }), h('div', {}, h('small', {}, 'Empieza por aquí'), h('b', {}, 'SQL · Tu primera consulta')), h('button', { class: 'btn sm', onclick: () => go('sql-1') }, 'Empezar'))),
      h('section', { class: 'courses' }, C().map(c => {
        const p = pct(c), n = allLessons(c).length;
        const cv = h('canvas', { width: 600, height: 260, 'aria-hidden': 'true' });
        requestAnimationFrame(() => window.W && W.art && W.art(cv, c.id));
        return h('button', { class: 'ccard', style: `--c:var(--${c.color})`, onclick: () => go(c.id) },
          h('div', { class: 'art' }, cv),
          h('div', { class: 'info' }, h('span', { class: 'tag' }, c.tag), h('h3', {}, c.title), h('p', {}, c.tagline),
            h('div', { class: 'bar' }, h('i', { style: `width:${p}%` })),
            h('div', { class: 'meta' }, h('span', {}, `${n} lecciones`), h('span', {}, p + '%'))));
      })),
      h('section', { class: 'method' },
        h('div', {}, h('b', {}, 'Problema primero'), 'Cada idea empieza con algo que resolver, no con teoría.'),
        h('div', {}, h('b', {}, 'Visual y manipulable'), 'Deslizadores, tablas vivas y memoria que se ve.'),
        h('div', {}, h('b', {}, 'Feedback inmediato'), 'Sabes al momento si vas bien y por qué.'),
        h('div', {}, h('b', {}, 'Proyecto continuo'), 'Cada curso construye algo que puedes enseñar.'))));
  }

  function courseView(c) {
    setColor(c);
    const ls = allLessons(c); const nextL = ls.find(l => !S.done[l.id]);
    const p = pct(c); const R = 26, L = 2 * Math.PI * R;
    const allDone = ls.every(l => S.done[l.id]);
    app.replaceChildren(topbar(), h('main', { class: 'wrap' },
      h('section', { class: 'chead' },
        h('div', {}, h('button', { class: 'back', onclick: () => go(''), html: ICON.left + 'Cursos' }),
          h('span', { class: 'tag' }, c.tag), h('h1', {}, c.title), h('p', {}, c.desc)),
        nextL ? h('button', { class: 'btn', onclick: () => go(nextL.id) }, S.done[ls[0].id] ? 'Continuar' : 'Empezar curso') : null),
      h('section', { class: 'cbody' },
        h('div', {}, c.units.map((u, ui) => h('div', { class: 'unit' },
          h('div', { class: 'unit-h' }, h('div', {}, h('div', { class: 'n' }, 'Unidad ' + (ui + 1)), h('h2', {}, u.title), u.desc ? h('p', {}, u.desc) : null)),
          h('div', { class: 'path' }, u.lessons.map((l, i) => {
            const off = [0, 56, 96, 56][i % 4];
            const cls = 'node' + (S.done[l.id] ? ' done' : '') + (nextL && nextL.id === l.id ? ' next' : '') + (l.proj ? ' proj' : '');
            return h('button', { class: cls, style: `--off:${off}px`, onclick: () => go(l.id) },
              h('span', { class: 'disc', html: S.done[l.id] ? ICON.check : l.proj ? ICON.box : l.cert ? ICON.cert : ICON.star }),
              h('span', { class: 'lbl' }, h('b', {}, l.title), h('small', {}, (l.proj ? 'Proyecto · ' : l.cert ? 'Evaluación · ' : '') + (l.sub || `${l.steps.length} pasos`))));
          }))))),
        h('aside', { class: 'side', id: 'side' },
          h('div', { class: 'card' }, h('div', { class: 'ring' },
            h('span', { html: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="${R}" fill="none" stroke="var(--line)" stroke-width="7"/><circle cx="32" cy="32" r="${R}" fill="none" stroke="var(--c)" stroke-width="7" stroke-linecap="round" stroke-dasharray="${L * p / 100} ${L}" transform="rotate(-90 32 32)"/><text x="32" y="37" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)" font-family="Figtree, system-ui, sans-serif">${p}%</text></svg>` }),
            h('div', { style: 'flex:1' }, h('b', {}, `${ls.filter(l => S.done[l.id]).length} de ${ls.length} lecciones`), h('div', { style: 'color:var(--muted);font-size:14px' }, c.time || '')),
              h('button', { class: 'btn ghost sm mobinfo', onclick: e => { const s = $('#side'); s.classList.toggle('open'); e.target.textContent = s.classList.contains('open') ? 'Menos' : 'Detalles'; } }, 'Detalles'))),
          h('div', { class: 'card' }, h('h3', {}, 'Qué construirás'), h('ul', {}, c.builds.map(b => h('li', { html: b })))),
          h('div', { class: 'card cert' + (allDone ? ' on' : '') }, h('h3', {}, allDone ? 'Ruta completada' : 'Validación'),
            h('p', { style: 'margin:0;font-size:14px;color:var(--muted)', html: allDone ? c.certDone : c.cert })),
          h('div', { class: 'card' }, h('h3', {}, 'Fuentes y método'), h('ul', {}, c.sources.map(s => h('li', { html: s }))))))));
  }

  /* ---------- Reproductor de lecciones ---------- */
  let L = null; // estado de la lección en curso
  function lessonView(found) {
    const { c, l } = found;
    setColor(c);
    S.last = l.id; save();
    L = { c, l, i: 0, correct: 0, graded: 0, xp: 0, first: true };
    app.replaceChildren(h('div', { class: 'lesson' },
      h('div', { class: 'ltop' },
        h('button', { class: 'x', 'aria-label': 'Salir de la lección', html: ICON.x, onclick: () => go(c.id) }),
        h('div', { class: 'segs', id: 'segs' }, l.steps.map(() => h('i'))),
        h('span', { class: 'pill', id: 'lxp', html: ICON.bolt + '0' })),
      h('div', { class: 'stage', id: 'stage' }),
      h('div', { class: 'foot', id: 'foot' }, h('div', { class: 'in' }, h('div', { class: 'msg', id: 'msg' }), h('button', { class: 'btn', id: 'cta' }, 'Continuar')))));
    renderStep();
  }

  function setFoot(mode, title, text, label, fn, disabled) {
    const f = $('#foot'); f.className = 'foot' + (mode ? ' ' + mode : '');
    $('#msg').innerHTML = title ? `<b>${mode === 'good' ? ICON.check.replace('<svg', '<svg width="22" height="22"') : ''}${title}</b>${text ? `<p>${text}</p>` : ''}` : '';
    const b = $('#cta'); b.textContent = label; b.disabled = !!disabled; b.onclick = fn;
  }

  function renderStep() {
    const { l } = L; const st = l.steps[L.i];
    [...$('#segs').children].forEach((s, k) => s.className = k < L.i ? 'on' : k === L.i ? 'cur' : '');
    const stage = $('#stage');
    const box = h('div', { class: 'step' });
    if (st.k || st.t !== 'learn') box.append(h('div', { class: 'kicker' }, st.k || ({ mcq: 'Pregunta', fill: 'Completa', order: 'Ordena', clickline: 'Encuentra', sql: 'Escribe SQL', py: 'Escribe Python', code: 'Proyecto', check: 'Proyecto' }[st.t] || '')));
    if (st.h) box.append(h('h2', {}, st.h));
    if (st.body) box.append(h('div', { class: 'body', html: st.body }));
    stage.replaceChildren(box);
    window.scrollTo({ top: 0 });
    L.first = true; L.tries = 0;
    (TYPES[st.t] || TYPES.learn)(st, box);
  }

  window.__jump = i => { if (L) { L.i = i; renderStep(); } };
  function next() {
    L.i++;
    if (L.i >= L.l.steps.length) return finish();
    renderStep();
  }
  const cont = (label = 'Continuar') => setFoot('', '', '', label, next);
  const buzz = p => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
  function grade(ok, why, retry) {
    if (ok) { buzz(18);
      if (L.first) { L.correct++; L.xp += 10; S.xp += 10; save(); $('#lxp').innerHTML = ICON.bolt + L.xp; }
      L.graded++;
      setFoot('good', ['¡Correcto!', '¡Bien visto!', 'Exacto.', '¡Eso es!'][Math.floor(Math.random() * 4)], why || '', 'Continuar', next);
    } else {
      buzz([30, 60, 30]); L.first = false; L.tries++;
      const extra = L.tries >= 2 && why ? why : 'Revisa y vuelve a intentarlo.';
      setFoot('bad', 'Todavía no', extra, 'Reintentar', () => { retry && retry(); }, false);
    }
  }

  const TYPES = {
    learn(st, box) {
      if (st.w) {
        const host = h('div', { class: 'w' }); box.append(host);
        let solved = false; const stepNow = L.i;
        if (st.goal) { setFoot('', '', '', 'Completa la actividad', next, true); setTimeout(() => { if (!solved && L && L.i === stepNow && $('#cta')) setFoot('', '', '', 'Continuar sin completar', next); }, 40000); }
        else cont();
        W[st.w](host, st.o || {}, { solved: () => { if (st.goal && !solved) { solved = true; setFoot('good', '¡Conseguido!', st.goalWhy || '', 'Continuar', next); } } });
        if (st.after) box.append(h('div', { class: 'body', html: st.after }));
      } else cont();
      if (st.code) codeBlock(box, st.code, st.file);
    },
    mcq(st, box) {
      box.append(h('div', { class: 'q', html: st.q }));
      if (st.code) codeBlock(box, st.code, st.file);
      let sel = -1; const opts = h('div', { class: 'opts' });
      const btns = st.opts.map((o, i) => h('button', { class: 'opt', onclick: () => { if (btns[i].classList.contains('no')) return; sel = i; btns.forEach(b => b.classList.remove('sel')); btns[i].classList.add('sel'); setFoot('', '', '', 'Comprobar', check); } },
        h('span', { class: 'k' }, 'ABCDEF'[i]), h('span', { html: o })));
      opts.append(...btns); box.append(opts);
      setFoot('', '', '', 'Comprobar', null, true);
      function check() {
        if (sel === st.a) { btns.forEach(b => b.disabled = true); btns[sel].classList.add('ok'); grade(true, st.why); }
        else { btns[sel].classList.add('no'); btns[sel].classList.remove('sel'); grade(false, st.hint || st.why, () => { sel = -1; setFoot('', '', '', 'Comprobar', null, true); }); }
      }
    },
    fill(st, box) {
      if (st.q) box.append(h('div', { class: 'q', html: st.q }));
      const parts = st.code.split(/\[\[(\d+)\]\]/); const inputs = [];
      const pre = h('div', { class: 'fillcode' });
      parts.forEach((p, i) => {
        if (i % 2 === 0) pre.append(p);
        else { const ans = st.blanks[+p]; const w = Math.max(...[].concat(ans).map(a => a.length)) + 1;
          const inp = h('input', { type: 'text', 'aria-label': 'Hueco ' + (+p + 1), style: `width:${w + 1}ch`, autocapitalize: 'off', autocomplete: 'off', spellcheck: 'false' });
          inp.addEventListener('keydown', e => { if (e.key === 'Enter') $('#cta').click(); });
          inp.dataset.k = p; inputs.push(inp); pre.append(inp); }
      });
      box.append(pre);
      setFoot('', '', '', 'Comprobar', check);
      setTimeout(() => inputs[0] && inputs[0].focus({ preventScroll: true }), 50);
      function check() {
        let all = true;
        inputs.forEach(inp => {
          const acc = [].concat(st.blanks[+inp.dataset.k]); const v = inp.value.trim();
          const ok = acc.some(a => st.cs ? a === v : a.toLowerCase() === v.toLowerCase());
          inp.className = ok ? 'ok' : 'no'; if (!ok) all = false;
        });
        if (all) grade(true, st.why);
        else grade(false, (st.hint ? st.hint + '<br>' : '') + 'Solución: ' + inputs.map(i => '<code>' + esc([].concat(st.blanks[+i.dataset.k])[0]) + '</code>').join(' · '), () => setFoot('', '', '', 'Comprobar', check));
      }
    },
    order(st, box) {
      if (st.q) box.append(h('div', { class: 'q', html: st.q }));
      const ans = h('div', { class: 'orderbox', 'aria-label': 'Tu respuesta' }), pool = h('div', { class: 'orderbox pool' });
      const sh = st.lines.map((t, i) => ({ t, i })).sort(() => Math.random() - .5);
      if (sh.every((x, k) => x.i === k)) sh.reverse();
      const mk = it => { const b = h('button', { class: 'chip' }, it.t); b.onclick = () => { (b.parentNode === pool ? ans : pool).append(b); upd(); }; b._i = it.i; return b; };
      pool.append(...sh.map(mk)); box.append(ans, pool);
      box.append(h('div', { class: 'status' }, 'Toca las líneas en el orden correcto. Toca de nuevo para devolverlas.'));
      const upd = () => setFoot('', '', '', 'Comprobar', check, pool.children.length > 0);
      upd();
      function check() {
        const seq = [...ans.children].map(b => b._i);
        const ok = seq.every((v, k) => st.lines[v] === st.lines[k]);
        if (ok) grade(true, st.why); else grade(false, st.why || 'El orden no es correcto.', () => upd());
      }
    },
    clickline(st, box) {
      box.append(h('div', { class: 'q', html: st.q }));
      let sel = -1; const lines = h('div', { class: 'lines' });
      const bs = st.code.split('\n').map((t, i) => h('button', { onclick: () => { sel = i; bs.forEach(b => b.classList.remove('sel')); bs[i].classList.add('sel'); setFoot('', '', '', 'Comprobar', check); } }, h('span', { class: 'ln' }, String(i + 1)), h('span', {}, t || ' ')));
      lines.append(...bs); box.append(lines);
      setFoot('', '', '', 'Comprobar', null, true);
      function check() {
        if ([].concat(st.a).includes(sel)) { bs[sel].classList.add('ok'); grade(true, st.why); }
        else { bs[sel].classList.add('no'); grade(false, st.hint || st.why, () => { bs.forEach(b => b.classList.remove('no', 'sel')); setFoot('', '', '', 'Comprobar', null, true); }); }
      }
    },
    sql(st, box) {
      if (st.q) box.append(h('div', { class: 'q', html: st.q }));
      const db = st.db || 'f1'; const sch = db === 'f1' ? window.F1_SCHEMA : window.FILMS_SCHEMA;
      box.append(h('div', { class: 'schema' }, Object.entries(st.tables ? Object.fromEntries(st.tables.map(t => [t, sch[t]])) : sch).map(([t, c]) => h('span', { html: `<b>${t}</b>(${c})` }))));
      const ta = h('textarea', { spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off', autocomplete: 'off', 'aria-label': 'Editor SQL' }); ta.value = st.start || '';
      const out = h('div');
      const runBtn = h('button', { class: 'btn ghost sm', onclick: run }, 'Ejecutar');
      const solBtn = h('button', { class: 'btn ghost sm', style: 'display:none', onclick: () => { ta.value = st.sol; } }, 'Ver solución');
      box.append(h('div', { class: 'ed' }, kbd(ta, SQLK), ta, h('div', { class: 'edbar' }, runBtn, solBtn, h('span', { class: 'hint' }, matchMedia('(hover:hover)').matches ? 'Ctrl/⌘ + Enter ejecuta' : '')), out));
      ta.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
        if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('  ', s, ta.selectionEnd, 'end'); }
      });
      setFoot('', '', '', 'Comprobar', check);
      if (!SQLE.ready) { out.replaceChildren(h('div', { class: 'status' }, 'Preparando base de datos…')); SQLE.init().then(() => out.replaceChildren(h('div', { class: 'status' }, 'Base de datos lista: ' + (db === 'f1' ? 'Fórmula 1 (FIA)' : 'Películas')))); }
      else out.replaceChildren(h('div', { class: 'status' }, 'Base de datos: ' + (db === 'f1' ? 'Fórmula 1 (FIA)' : 'Películas')));
      async function run() {
        await SQLE.init();
        const sql = ta.value; const res = st.verify ? SQLE.run(db, sql + ';\n' + st.verify, st.pre) : SQLE.run(db, sql, st.pre);
        out.replaceChildren(res.err ? h('div', { class: 'err' }, 'Error: ' + res.err) : table(res.r));
        return res;
      }
      async function check() {
        const mine = await run();
        if (mine.err) return grade(false, 'Tu SQL tiene un error: lee el mensaje rojo.', () => setFoot('', '', '', 'Comprobar', check));
        const ref = st.verify ? SQLE.run(db, st.sol + ';\n' + st.verify, st.pre) : SQLE.run(db, st.sol, st.pre);
        if (st.verify && st.expectErr) { /* el trigger debe bloquear */ }
        const cmp = SQLE.same(mine.r, ref.r, st.ordered);
        if (cmp.ok) grade(true, st.why);
        else { if (L.tries >= 1) solBtn.style.display = ''; grade(false, cmp.why + (st.hint ? ' ' + st.hint : ''), () => setFoot('', '', '', 'Comprobar', check)); if (L.tries < 2) $('#msg p').innerHTML = cmp.why + (st.hint && L.tries >= 1 ? '<br>Pista: ' + st.hint : ''); }
      }
    },
    py(st, box) {
      if (st.q) box.append(h('div', { class: 'q', html: st.q }));
      const ta = h('textarea', { spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off', autocomplete: 'off', 'aria-label': 'Editor Python' }); ta.value = st.start || '';
      const con = h('div', { class: 'console' }, '▸ La salida aparecerá aquí');
      const stat = h('span', { class: 'status' }, 'Python se carga la primera vez (unos segundos)…');
      const solBtn = h('button', { class: 'btn ghost sm', style: 'display:none', onclick: () => { ta.value = st.sol; } }, 'Ver solución');
      box.append(h('div', { class: 'ed' }, kbd(ta, PYK), ta, h('div', { class: 'edbar' }, h('button', { class: 'btn ghost sm', onclick: run }, 'Ejecutar'), solBtn, stat), con));
      ta.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
        if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('    ', s, ta.selectionEnd, 'end'); }
      });
      setFoot('', '', '', 'Comprobar', check);
      PY.load().then(ok => { stat.textContent = ok ? 'Python 3 listo · Ctrl/⌘ + Enter ejecuta' : 'No se pudo cargar Python aquí. Compara tu código con la solución.'; if (!ok) solBtn.style.display = ''; });
      async function run() {
        const ok = await PY.load(); if (!ok) { con.textContent = 'Intérprete no disponible en este navegador.'; return null; }
        con.textContent = 'Ejecutando…'; const r = await PY.run(ta.value);
        con.textContent = (r.out || '') + (r.err ? '\n' + r.err : '') || '(sin salida)'; return r;
      }
      async function check() {
        if (PY.state === 'fail') { solBtn.style.display = ''; return grade(true, 'Sin intérprete disponible: revisa la solución y continúa. ' + (st.why || '')); }
        const r = await run(); if (!r) return;
        const got = (r.out || '').trim(), exp = String(st.expect).trim();
        const ok = !r.err && (st.re ? new RegExp(st.expect).test(got) : got === exp);
        if (ok) grade(true, st.why);
        else { solBtn.style.display = L.tries >= 1 ? '' : 'none'; grade(false, (r.err ? 'Hay un error de Python.' : 'Salida esperada:<br><code>' + esc(exp).replace(/\n/g, '<br>') + '</code>') + (st.hint ? '<br>Pista: ' + st.hint : ''), () => setFoot('', '', '', 'Comprobar', check)); }
      }
    },
    code(st, box) {
      (st.blocks || [{ file: st.file, code: st.code }]).forEach(b => { if (b.text) box.append(h('div', { class: 'body', html: b.text })); if (b.code) codeBlock(box, b.code, b.file); });
      if (st.after) box.append(h('div', { class: 'body', html: st.after }));
      if (st.checks) {
        const cs = st.checks.map(t => h('input', { type: 'checkbox' }));
        box.append(h('div', { class: 'checks' }, st.checks.map((t, i) => h('label', {}, cs[i], h('span', { html: t })))));
        const upd = () => setFoot('', cs.every(c => c.checked) ? '' : '', '', cs.every(c => c.checked) ? 'Continuar' : 'Marca cada hito al completarlo', next, !cs.every(c => c.checked));
        cs.forEach(c => c.addEventListener('change', upd)); upd();
      } else cont();
    }
  };
  TYPES.check = TYPES.code;

  function kbd(ta, keys) {
    return h('div', { class: 'kbd', 'aria-label': 'Atajos de teclado' }, keys.map(k => h('button', { type: 'button', onmousedown: e => e.preventDefault(), onclick: () => {
      const ins = k === '⇥' ? '    ' : k === '↵' ? '\n' : /^[A-Z][A-Z ]+$/.test(k) ? k + ' ' : k;
      ta.focus(); const s = ta.selectionStart; ta.setRangeText(ins, s, ta.selectionEnd, 'end'); ta.dispatchEvent(new Event('input'));
    } }, k)));
  }
  const SQLK = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'AND', 'GROUP BY', 'HAVING', 'ORDER BY', 'DESC', 'COUNT(', 'DISTINCT', 'IN', 'NOT', 'EXISTS', '*', '=', "'", ',', '.', '(', ')', ';', '↵'];
  const PYK = ['⇥', ':', '(', ')', '[', ']', '{', '}', '"', '=', '==', ',', '.', '+', '*', 'print(', 'for ', ' in ', 'if ', 'return ', 'def ', '_', '#', '↵'];
  function codeBlock(box, code, file) {
    const pre = h('pre', { class: 'code' }, h('code', {}, code.replace(/^\n/, '')));
    const cp = h('button', { class: 'copy', onclick: async () => { try { await navigator.clipboard.writeText(code.trim()); cp.textContent = 'Copiado'; } catch (e) { cp.textContent = 'Selecciona y copia'; } setTimeout(() => cp.textContent = 'Copiar', 1600); } }, 'Copiar');
    box.append(h('div', { class: 'codehead' }, h('span', {}, file || ''), cp), pre);
  }

  function finish() {
    const { c, l } = L;
    S.done[l.id] = true; if (!S.days.includes(today())) S.days.push(today()); S.xp += 20; save();
    const ls = allLessons(c); const nx = ls.slice(ls.findIndex(x => x.id === l.id) + 1).find(x => !S.done[x.id]);
    const acc = L.graded ? Math.round(100 * L.correct / L.graded) : 100;
    $('#foot').remove();
    $('#stage').replaceChildren(h('div', { class: 'finish step' },
      h('span', { html: `<svg width="96" height="96" viewBox="0 0 96 96"><circle cx="48" cy="48" r="44" fill="var(--c-soft)"/><circle cx="48" cy="48" r="30" fill="var(--c)"/><path d="M35 49l9 9 18-19" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>` }),
      h('h1', {}, l.proj ? 'Hito del proyecto completado' : l.cert ? 'Evaluación superada' : '¡Lección completada!'),
      h('p', { style: 'color:var(--muted)' }, l.title),
      h('div', { class: 'stats' }, h('div', {}, h('b', {}, '+' + (L.xp + 20)), h('small', {}, 'XP')), h('div', {}, h('b', {}, acc + '%'), h('small', {}, 'a la primera')), h('div', {}, h('b', {}, streak()), h('small', {}, 'días de racha'))),
      h('div', { style: 'display:flex;gap:10px;justify-content:center;flex-wrap:wrap' },
        h('button', { class: 'btn ghost', onclick: () => go(c.id) }, 'Ver ruta'),
        nx ? h('button', { class: 'btn', onclick: () => go(nx.id) }, 'Siguiente: ' + nx.title) : null)));
  }

  /* ---------- Router (hash simple) ---------- */
  function go(id) { if (location.hash.slice(1) === id) route(); else location.hash = id; }
  window.go = go;
  function route() {
    const id = location.hash.slice(1);
    if (!id) return home();
    const c = course(id); if (c) return courseView(c);
    const f = findLesson(id); if (f) return lessonView(f);
    home();
  }
  window.addEventListener('hashchange', route);
  route();
  // precarga del motor SQL
  setTimeout(() => SQLE.init().catch(() => {}), 300);
})();
