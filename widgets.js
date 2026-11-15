/* Bloques interactivos (widgets) */
(function () {
  const W = window.W = {};
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const col = () => ({ c: css('--c') || '#0E8C83', ink: css('--ink'), muted: css('--muted'), line: css('--line'), s2: css('--surface2'), good: css('--good'), bad: css('--bad'), sql: css('--sql'), ia: css('--ia'), rust: css('--rust'), py: css('--py'), surf: css('--surface') });
  // color real de --c (es var(--x)): resolver vía elemento
  const resolveC = () => { const d = document.createElement('i'); d.style.color = 'var(--c)'; document.body.append(d); const v = getComputedStyle(d).color; d.remove(); return v; };
  function cv(host, hgt = 300) {
    const c = document.createElement('canvas'); host.append(c);
    const fit = () => { const w = c.clientWidth || 600, d = window.devicePixelRatio || 1; c.width = w * d; c.height = hgt * d; c.style.height = hgt + 'px'; const x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0); c._w = w; c._h = hgt; };
    fit(); c._fit = fit; return c;
  }
  const slider = (label, min, max, step, val, fn, fmt = v => v) => {
    const out = h('span', { class: 'readout' }, fmt(val));
    const inp = h('input', { type: 'range', min, max, step, value: val, 'aria-label': label });
    inp.addEventListener('input', () => { out.textContent = fmt(+inp.value); fn(+inp.value); });
    const el = h('label', {}, label, inp, out); el._inp = inp; el._out = out; return el;
  };
  const goal = (txt) => h('div', { class: 'goal' }, '◎ ' + txt);
  const setGoal = (g, ok, txt) => { g.className = 'goal' + (ok ? ' ok' : ''); g.textContent = (ok ? '✓ ' : '◎ ') + txt; };
  const rgba = (c, a) => { const m = c.match(/\d+(\.\d+)?/g); return m ? `rgba(${m[0]},${m[1]},${m[2]},${a})` : c; };

  /* Arte de las tarjetas */
  W.art = (c, id) => {
    const d = window.devicePixelRatio || 1, w = c.clientWidth || 300, hh = c.clientHeight || 130; c.width = w * d; c.height = hh * d;
    const x = c.getContext('2d'); x.scale(d, d); const k = resolveColor(`var(--${({ sql: 'sql', ia: 'ia', rust: 'rust', py: 'py' })[id]})`);
    x.clearRect(0, 0, w, hh);
    if (id === 'sql') { for (let r = 0; r < 4; r++) for (let q = 0; q < 6; q++) { x.fillStyle = rgba(k, r === 0 ? .55 : (q + r) % 3 ? .14 : .32); rr(x, 24 + q * (w - 48) / 6, 22 + r * 24, (w - 48) / 6 - 6, 18, 5); } x.strokeStyle = rgba(k, .8); x.lineWidth = 2; x.beginPath(); x.moveTo(w - 60, 112); x.lineTo(w - 30, 112); x.stroke(); }
    if (id === 'ia') { const L = [3, 5, 5, 2]; const pts = L.map((n, i) => Array.from({ length: n }, (_, j) => [40 + i * (w - 80) / 3, hh / 2 + (j - (n - 1) / 2) * 20])); x.strokeStyle = rgba(k, .25); for (let i = 0; i < 3; i++) for (const a of pts[i]) for (const b of pts[i + 1]) { x.beginPath(); x.moveTo(...a); x.lineTo(...b); x.stroke(); } pts.flat().forEach(([a, b], i) => { x.fillStyle = rgba(k, i % 4 ? .5 : .95); x.beginPath(); x.arc(a, b, 6, 0, 7); x.fill(); }); }
    if (id === 'rust') { x.lineWidth = Math.min(10, w / 22); x.lineCap = 'round'; for (let i = 0; i < 3; i++) { x.strokeStyle = rgba(k, .25 + i * .25); x.beginPath(); x.arc(w / 2 + (i - 1) * Math.min(56, w / 4.2), hh / 2 + 6, Math.min(26, w / 8.5), Math.PI * (0.15 + i * .1), Math.PI * (1.85 + i * .1)); x.stroke(); } }
    if (id === 'py') { for (let i = 0; i < 40; i++) { const t = i / 39; x.fillStyle = rgba(k, .2 + .6 * t); x.beginPath(); x.arc(24 + t * (w - 48), hh / 2 + Math.sin(t * 9) * 28 * (1 - t * .4), 4 + 4 * t, 0, 7); x.fill(); } }
  };
  function resolveColor(v) { const d = document.createElement('i'); d.style.color = v; document.body.append(d); const r = getComputedStyle(d).color; d.remove(); return r; }
  function rr(x, a, b, w, hh, r) { x.beginPath(); x.roundRect ? x.roundRect(a, b, w, hh, r) : x.rect(a, b, w, hh); x.fill(); }

  /* IA 1 — una neurona = recta: ajusta peso y sesgo */
  W.neuron = (host, o, api) => {
    const C = col(), K = resolveC();
    const pts = [[1, 3.1], [2, 4.2], [3, 6.3], [4, 7.1], [5, 9.4], [6, 10.2], [7, 12.6], [8, 13.1]];
    let w = 0.5, b = 1; const c = cv(host, 280);
    const g = goal('Baja el error (MSE) por debajo de 0,6');
    const loss = () => pts.reduce((s, [a, y]) => s + (w * a + b - y) ** 2, 0) / pts.length;
    host.append(h('div', { class: 'row' }, slider('peso w', -1, 3, 0.05, w, v => { w = v; draw(); }, v => v.toFixed(2)), slider('sesgo b', -4, 6, 0.1, b, v => { b = v; draw(); }, v => v.toFixed(1))), g);
    let solved = false;
    function draw() {
      const x = c.getContext('2d'), W_ = c._w, H = c._h, P = 36; x.clearRect(0, 0, W_, H);
      const X = a => P + a / 9 * (W_ - 2 * P), Y = v => H - P - v / 16 * (H - 2 * P);
      x.strokeStyle = C.line; x.lineWidth = 1; for (let i = 0; i <= 16; i += 4) { x.beginPath(); x.moveTo(P, Y(i)); x.lineTo(W_ - P, Y(i)); x.stroke(); }
      x.fillStyle = C.muted; x.font = '12px Figtree, system-ui, sans-serif'; x.fillText('horas de estudio →', W_ - P - 110, H - 10); x.fillText('nota', 6, P + 8);
      pts.forEach(([a, y]) => { const p = w * a + b; x.strokeStyle = rgba(resolveColor('var(--bad)'), .55); x.setLineDash([3, 3]); x.beginPath(); x.moveTo(X(a), Y(y)); x.lineTo(X(a), Y(p)); x.stroke(); x.setLineDash([]); });
      x.strokeStyle = K; x.lineWidth = 3; x.beginPath(); x.moveTo(X(0), Y(b)); x.lineTo(X(9), Y(w * 9 + b)); x.stroke();
      pts.forEach(([a, y]) => { x.fillStyle = C.ink; x.beginPath(); x.arc(X(a), Y(y), 5, 0, 7); x.fill(); });
      const L = loss(); x.fillStyle = C.ink; x.font = '600 14px JetBrains Mono, monospace'; x.fillText(`ŷ = ${w.toFixed(2)}·x + ${b.toFixed(1)}   MSE = ${L.toFixed(2)}`, P + 4, 18);
      if (L < 0.6 && !solved) { solved = true; setGoal(g, true, `¡Ajustado! MSE = ${L.toFixed(2)}. Acabas de "entrenar" a mano.`); api.solved(); }
    }
    draw();
  };

  /* IA 2 — descenso de gradiente */
  W.gd = (host, o, api) => {
    const C = col(), K = resolveC(); const f = x => 0.5 * (x - 1) ** 2 + 0.3 * Math.sin(3 * x) + 1, df = x => (x - 1) + 0.9 * Math.cos(3 * x);
    let x0 = -2.6, lr = 0.1, path = [x0]; const c = cv(host, 260);
    const g = goal('Llega al valle (pendiente casi 0) en 15 pasos o menos');
    const btn = h('button', { class: 'btn sm', onclick: step }, 'Dar un paso');
    const rst = h('button', { class: 'btn ghost sm', onclick: () => { path = [x0]; draw(); } }, 'Reiniciar');
    host.append(h('div', { class: 'row' }, slider('tasa de aprendizaje η', 0.02, 1.8, 0.02, lr, v => { lr = v; }, v => v.toFixed(2)), btn, rst), g);
    let solved = false;
    function step() { const x = path[path.length - 1]; path.push(Math.max(-3.5, Math.min(4.5, x - lr * df(x)))); draw(); }
    function draw() {
      const x = c.getContext('2d'), W_ = c._w, H = c._h, P = 30; x.clearRect(0, 0, W_, H);
      const X = v => P + (v + 3.5) / 8 * (W_ - 2 * P), Y = v => H - P - (v) / 9 * (H - 2 * P);
      x.strokeStyle = C.muted; x.lineWidth = 2; x.beginPath(); for (let v = -3.5; v <= 4.5; v += 0.02) x.lineTo(X(v), Y(f(v))); x.stroke();
      x.strokeStyle = rgba(K, .5); x.lineWidth = 1.5; x.beginPath(); path.forEach(v => x.lineTo(X(v), Y(f(v)))); x.stroke();
      path.forEach((v, i) => { x.fillStyle = i === path.length - 1 ? K : rgba(K, .35); x.beginPath(); x.arc(X(v), Y(f(v)), i === path.length - 1 ? 8 : 4, 0, 7); x.fill(); });
      const cur = path[path.length - 1]; x.fillStyle = C.ink; x.font = '600 13px JetBrains Mono, monospace';
      x.fillText(`paso ${path.length - 1}  x=${cur.toFixed(2)}  pérdida=${f(cur).toFixed(3)}  pendiente=${df(cur).toFixed(3)}`, P, 20);
      if (!solved && Math.abs(df(cur)) < 0.05 && path.length - 1 <= 15 && f(cur) < 1.2) { solved = true; setGoal(g, true, `Mínimo en ${path.length - 1} pasos. Con η muy grande rebotas; con η muy pequeño tardas una eternidad.`); api.solved(); }
    }
    draw();
  };

  /* IA 3 — clasificador: frontera de decisión, lineal vs capa oculta */
  W.classify = (host, o, api) => {
    const C = col(), K = resolveC(), B = resolveColor('var(--rust)');
    let data = 'lin', hidden = 0, net = null, epoch = 0, timer = null;
    const c = cv(host, 300); const g = goal('Consigue 100 % de acierto en el conjunto XOR');
    const mk = () => { const pts = []; let s = 3; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280; for (let i = 0; i < 80; i++) { const a = r() * 2 - 1, b = r() * 2 - 1; pts.push([a, b, data === 'lin' ? (a + b * 0.6 > 0.1 ? 1 : 0) : (a * b > 0 ? 1 : 0)]); } return pts; };
    let pts = mk();
    const init = () => { const H = hidden || 0; let s = 5; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280 - .5) * 2; net = H ? { W1: Array.from({ length: H }, () => [r(), r()]), b1: Array.from({ length: H }, r), W2: Array.from({ length: H }, r), b2: 0 } : { w: [r(), r()], b: 0 }; epoch = 0; };
    const sig = z => 1 / (1 + Math.exp(-z));
    const fwd = (a, b) => { if (!hidden) return { y: sig(net.w[0] * a + net.w[1] * b + net.b) }; const hh = net.W1.map((w, j) => Math.tanh(w[0] * a + w[1] * b + net.b1[j])); return { hh, y: sig(hh.reduce((s, v, j) => s + v * net.W2[j], net.b2)) }; };
    const train = () => { const lr = 0.5; for (const [a, b, t] of pts) { const { hh, y } = fwd(a, b); const e = y - t; if (!hidden) { net.w[0] -= lr * e * a; net.w[1] -= lr * e * b; net.b -= lr * e; } else { for (let j = 0; j < hidden; j++) { const gh = e * net.W2[j] * (1 - hh[j] ** 2); net.W2[j] -= lr * e * hh[j]; net.W1[j][0] -= lr * gh * a; net.W1[j][1] -= lr * gh * b; net.b1[j] -= lr * gh; } net.b2 -= lr * e; } } epoch++; };
    const acc = () => Math.round(100 * pts.filter(([a, b, t]) => (fwd(a, b).y > .5 ? 1 : 0) === t).length / pts.length);
    const seg = h('div', { class: 'seg' }, ...[['lin', 'Lineal'], ['xor', 'XOR']].map(([k, t]) => h('button', { class: k === data ? 'on' : '', onclick: e => { data = k; pts = mk(); init(); [...seg.children].forEach(b => b.classList.remove('on')); e.target.classList.add('on'); draw(); } }, t)));
    const hs = slider('neuronas ocultas', 0, 8, 1, 0, v => { hidden = v; init(); draw(); });
    const tb = h('button', { class: 'btn sm', onclick: () => { if (timer) { clearInterval(timer); timer = null; tb.textContent = 'Entrenar'; return; } tb.textContent = 'Pausa'; timer = setInterval(() => { for (let i = 0; i < 5; i++) train(); draw(); if (epoch > 600) { clearInterval(timer); timer = null; tb.textContent = 'Entrenar'; } }, 30); } }, 'Entrenar');
    host.append(h('div', { class: 'row' }, seg, hs, tb, h('button', { class: 'btn ghost sm', onclick: () => { init(); draw(); } }, 'Reiniciar pesos')), g);
    let solved = false; init();
    function draw() {
      const x = c.getContext('2d'), W_ = c._w, H = c._h; x.clearRect(0, 0, W_, H);
      const S = 10; for (let i = 0; i < W_; i += S) for (let j = 0; j < H; j += S) { const a = (i / W_) * 2 - 1, b = 1 - (j / H) * 2; const y = fwd(a, b).y; x.fillStyle = y > .5 ? rgba(K, .07 + .2 * (y - .5)) : rgba(B, .07 + .2 * (.5 - y)); x.fillRect(i, j, S, S); }
      pts.forEach(([a, b, t]) => { x.fillStyle = t ? K : B; x.beginPath(); x.arc((a + 1) / 2 * W_, (1 - b) / 2 * H, 5, 0, 7); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 1.5; x.stroke(); });
      const A = acc(); x.fillStyle = C.ink; x.font = '600 13px JetBrains Mono, monospace'; x.fillText(`época ${epoch}   acierto ${A}%`, 12, 20);
      if (!solved && data === 'xor' && A === 100) { solved = true; setGoal(g, true, '¡XOR resuelto! Una sola neurona solo traza rectas; la capa oculta dobla el espacio.'); api.solved(); }
    }
    draw();
  };

  /* IA 4 — convolución sobre píxeles */
  W.conv = (host, o, api) => {
    const N = 12; const img = Array.from({ length: N }, (_, r) => Array.from({ length: N }, (_, q) => (q >= 3 && q <= 8 && r >= 3 && r <= 8) ? 1 : 0));
    const K = { 'Bordes verticales': [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], 'Bordes horizontales': [[-1, -2, -1], [0, 0, 0], [1, 2, 1]], 'Desenfoque': [[1, 1, 1], [1, 1, 1], [1, 1, 1]].map(r => r.map(v => v / 9)), 'Enfocar': [[0, -1, 0], [-1, 5, -1], [0, -1, 0]] };
    let kname = 'Bordes verticales'; const c = cv(host, 260); let painting = false, val = 1;
    const sel = h('select', { 'aria-label': 'Filtro' }, Object.keys(K).map(k => h('option', {}, k))); sel.onchange = () => { kname = sel.value; draw(); };
    const kv = h('div', { class: 'readout', style: 'white-space:pre' });
    host.append(h('div', { class: 'row' }, h('label', {}, 'Filtro', sel), kv, h('button', { class: 'btn ghost sm', onclick: () => { img.forEach(r => r.fill(0)); draw(); } }, 'Borrar dibujo')), h('div', { class: 'goal' }, 'Pinta en la cuadrícula izquierda (clic y arrastra). La derecha es el mapa de activación.'));
    const cell = () => Math.min((c._w / 2 - 30) / N, (c._h - 20) / N);
    const hit = e => { const r = c.getBoundingClientRect(), s = cell(), q = Math.floor((e.clientX - r.left - 10) / s), w = Math.floor((e.clientY - r.top - 10) / s); return q >= 0 && q < N && w >= 0 && w < N ? [w, q] : null; };
    c.addEventListener('pointerdown', e => { const p = hit(e); if (!p) return; painting = true; val = img[p[0]][p[1]] ? 0 : 1; img[p[0]][p[1]] = val; draw(); });
    c.addEventListener('pointermove', e => { if (!painting) return; const p = hit(e); if (p) { img[p[0]][p[1]] = val; draw(); } });
    window.addEventListener('pointerup', () => painting = false);
    function draw() {
      const x = c.getContext('2d'), s = cell(), k = K[kname]; x.clearRect(0, 0, c._w, c._h); const Kc = resolveC(), C = col();
      kv.textContent = k.map(r => r.map(v => (Math.round(v * 100) / 100).toString().padStart(5)).join('')).join('\n');
      for (let r = 0; r < N; r++) for (let q = 0; q < N; q++) { x.fillStyle = img[r][q] ? C.ink : C.surf; x.fillRect(10 + q * s, 10 + r * s, s - 1, s - 1); }
      const ox = c._w / 2 + 10;
      for (let r = 0; r < N; r++) for (let q = 0; q < N; q++) { let v = 0; for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) { const a = r + i, b = q + j; if (a >= 0 && b >= 0 && a < N && b < N) v += img[a][b] * k[i + 1][j + 1]; } const m = Math.min(1, Math.abs(v) / 3); x.fillStyle = v >= 0 ? rgba(Kc, .08 + .9 * m) : rgba(resolveColor('var(--rust)'), .08 + .9 * m); x.fillRect(ox + q * s, 10 + r * s, s - 1, s - 1); }
      x.fillStyle = C.muted; x.font = '12px Figtree, system-ui, sans-serif'; x.fillText('entrada', 10, c._h - 4); x.fillText('salida (positivo / negativo)', ox, c._h - 4);
    }
    draw(); api.solved();
  };

  /* IA 5 — tokenización */
  W.tokens = (host, o, api) => {
    const vocab = ['ción', 'mente', 'ando', 'iendo', 'ado', 'ido', 'ar', 'er', 'ir', 'es', 'os', 'as', 'des', 'aprend', 'intelig', 'enc', 'ia', 'red', 'neur', 'onal', 'mod', 'elo', 'dat', 'texto', 'ima', 'gen', 'audio', 'el', 'la', 'los', 'las', 'un', 'una', 'de', 'que', 'en', 'y', 'con', 'por', 'para'];
    const tok = s => { const out = []; for (const w of s.match(/\s*[\wáéíóúñü]+|\s*[^\s\w]/gi) || []) { let rest = w; const sp = rest.startsWith(' '); rest = rest.trim(); let first = true; while (rest) { let m = vocab.filter(v => rest.toLowerCase().startsWith(v)).sort((a, b) => b.length - a.length)[0]; if (!m) m = rest.length <= 3 ? rest : rest.slice(0, 3); out.push((sp && first ? '▁' : '') + rest.slice(0, m.length)); rest = rest.slice(m.length); first = false; } } return out; };
    const id = t => [...t].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) % 50000, 7);
    const inp = h('input', { type: 'text', value: o.text || 'Las redes neuronales aprenden representaciones increíblemente útiles.', style: 'width:100%', 'aria-label': 'Texto a tokenizar' });
    const out = h('div', { class: 'toks' }), info = h('div', { class: 'goal' });
    host.append(inp, out, info);
    const hues = [0, 35, 160, 200, 260, 310];
    const draw = () => { const t = tok(inp.value); out.replaceChildren(...t.map((s, i) => h('span', { style: `background:hsla(${hues[i % 6]},70%,60%,.18)` }, s, h('small', {}, id(s))))); info.textContent = `${inp.value.length} caracteres → ${t.length} tokens. El modelo solo ve los números.`; };
    inp.addEventListener('input', draw); draw(); api.solved();
  };

  /* IA 6 — embeddings: aritmética de vectores */
  W.embed = (host, o, api) => {
    const E = { rey: [.8, .8], reina: [.8, .2], hombre: [.3, .85], mujer: [.3, .25], 'príncipe': [.65, .9], princesa: [.65, .3], perro: [-.6, -.3], gato: [-.7, -.45], cachorro: [-.45, -.15], 'París': [-.1, .55], 'Francia': [-.3, .45], 'Madrid': [.0, -.65], 'España': [-.2, -.75] };
    const words = Object.keys(E); const c = cv(host, 300);
    const mkSel = v => h('select', {}, words.map(w => h('option', { selected: w === v ? true : null }, w)));
    const a = mkSel('rey'), b = mkSel('hombre'), d = mkSel('mujer'); const res = h('span', { class: 'readout' });
    const g = goal('Encuentra: París − Francia + España ≈ ?');
    [a, b, d].forEach(s => s.onchange = draw);
    host.append(h('div', { class: 'row' }, a, ' − ', b, ' + ', d, ' = ', res), g);
    let solved = false;
    function draw() {
      const x = c.getContext('2d'), W_ = c._w, H = c._h, C = col(), K = resolveC(); x.clearRect(0, 0, W_, H);
      const X = v => W_ / 2 + v * W_ * .42, Y = v => H / 2 - v * H * .42;
      const A = E[a.value], Bv = E[b.value], D = E[d.value], T = [A[0] - Bv[0] + D[0], A[1] - Bv[1] + D[1]];
      const best = words.filter(w => ![a.value, b.value, d.value].includes(w)).sort((p, q) => dist(E[p], T) - dist(E[q], T))[0];
      words.forEach(w => { const [p, q] = E[w]; x.fillStyle = w === best ? K : C.muted; x.beginPath(); x.arc(X(p), Y(q), w === best ? 7 : 4, 0, 7); x.fill(); x.fillStyle = w === best ? K : C.ink; x.font = (w === best ? '700 ' : '') + '13px Figtree, system-ui, sans-serif'; x.fillText(w, X(p) + 8, Y(q) + 4); });
      arrow(x, X(Bv[0]), Y(Bv[1]), X(A[0]), Y(A[1]), rgba(K, .5)); arrow(x, X(D[0]), Y(D[1]), X(T[0]), Y(T[1]), K);
      x.strokeStyle = K; x.setLineDash([4, 4]); x.beginPath(); x.arc(X(T[0]), Y(T[1]), 12, 0, 7); x.stroke(); x.setLineDash([]);
      res.textContent = best;
      if (!solved && a.value === 'París' && b.value === 'Francia' && d.value === 'España' && best === 'Madrid') { solved = true; setGoal(g, true, '¡Madrid! La dirección "capital de" es la misma flecha en el espacio.'); api.solved(); }
    }
    const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
    draw();
  };
  function arrow(x, a, b, c, d, color) { x.strokeStyle = color; x.fillStyle = color; x.lineWidth = 2; x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.stroke(); const an = Math.atan2(d - b, c - a); x.beginPath(); x.moveTo(c, d); x.lineTo(c - 10 * Math.cos(an - .4), d - 10 * Math.sin(an - .4)); x.lineTo(c - 10 * Math.cos(an + .4), d - 10 * Math.sin(an + .4)); x.fill(); }

  /* IA 7 — atención */
  W.attention = (host, o, api) => {
    const words = ['El', 'gato', 'no', 'cruzó', 'la', 'calle', 'porque', 'estaba', 'cansado'];
    const A = { 7: [.02, .55, .03, .08, .01, .12, .04, .05, .1], 8: [.03, .62, .02, .05, .01, .1, .02, .1, .05], 1: [.3, .3, .05, .2, .02, .05, .02, .03, .03], 5: [.02, .1, .02, .35, .25, .2, .02, .02, .02], 3: [.03, .4, .15, .1, .03, .25, .01, .02, .01] };
    const def = i => words.map((_, j) => j === i ? .5 : .5 / (words.length - 1));
    let cur = 7; const row = h('div', { class: 'toks', style: 'font-size:18px;gap:8px' }); const g = goal('Toca "estaba": ¿a quién mira para saber quién estaba cansado?');
    host.append(row, h('div', { class: 'status', style: 'margin-top:8px' }, 'Toca cualquier palabra para ver hacia dónde reparte su atención (pesos tras softmax).'), g);
    let solved = false;
    function draw() {
      const w = A[cur] || def(cur), K = resolveC();
      row.replaceChildren(...words.map((t, j) => { const s = h('span', { style: `cursor:pointer;padding:8px 10px;border-radius:10px;font-family:Figtree;font-size:17px;background:${rgba(K, Math.min(.85, w[j] * 1.4))};${j === cur ? 'outline:2px solid ' + K : ''};color:${w[j] > .4 ? '#fff' : 'inherit'}`, onclick: () => { cur = j; draw(); if (j === 7 && !solved) { solved = true; setGoal(g, true, '"estaba" atiende sobre todo a "gato". Así el modelo resuelve referencias sin reglas escritas.'); api.solved(); } } }, t, h('small', {}, w[j].toFixed(2))); return s; }));
    }
    draw();
  };

  /* IA 8 — temperatura al muestrear */
  W.temperature = (host, o, api) => {
    const toks = ['café', 'té', 'agua', 'zumo', 'helado', 'gasolina'], logits = [3.2, 2.6, 2.0, 1.2, 0.3, -2.5];
    let T = 1; const c = cv(host, 230); const out = h('span', { class: 'readout' }, '—');
    host.append(h('div', { class: 'status' }, 'Contexto: "Por la mañana me gusta tomar un…"'), h('div', { class: 'row' }, slider('temperatura', 0.1, 3, 0.05, T, v => { T = v; draw(); }, v => v.toFixed(2)), h('button', { class: 'btn sm', onclick: sample }, 'Muestrear'), out));
    const probs = () => { const e = logits.map(l => Math.exp(l / T)); const s = e.reduce((a, b) => a + b); return e.map(v => v / s); };
    function sample() { const p = probs(); let r = Math.random(), i = 0; while (r > p[i] && i < p.length - 1) { r -= p[i]; i++; } out.textContent = toks[i]; }
    function draw() { const x = c.getContext('2d'), W_ = c._w, H = c._h, C = col(), K = resolveC(); x.clearRect(0, 0, W_, H); const p = probs(); const bw = (W_ - 40) / toks.length; p.forEach((v, i) => { const bh = v * (H - 50); x.fillStyle = K; x.globalAlpha = .25 + .75 * v / Math.max(...p); x.beginPath(); x.roundRect ? x.roundRect(20 + i * bw + 8, H - 28 - bh, bw - 16, bh, 6) : x.rect(20 + i * bw + 8, H - 28 - bh, bw - 16, bh); x.fill(); x.globalAlpha = 1; x.fillStyle = C.ink; x.font = '13px Figtree, system-ui, sans-serif'; x.textAlign = 'center'; x.fillText(toks[i], 20 + i * bw + bw / 2, H - 10); x.font = '600 12px JetBrains Mono, monospace'; x.fillText((v * 100).toFixed(1) + '%', 20 + i * bw + bw / 2, H - 34 - bh); x.textAlign = 'left'; }); }
    draw(); api.solved();
  };

  /* IA 9 — ondas y espectro */
  W.wave = (host, o, api) => {
    let f1 = 220, f2 = 660, a2 = 0.4; const c = cv(host, 260); const g = goal('Haz que el espectro muestre dos picos: uno en 330 Hz y otro en 880 Hz');
    host.append(h('div', { class: 'row' }, slider('tono 1 (Hz)', 110, 990, 10, f1, v => { f1 = v; draw(); }), slider('tono 2 (Hz)', 110, 990, 10, f2, v => { f2 = v; draw(); }), slider('volumen 2', 0, 1, 0.05, a2, v => { a2 = v; draw(); }, v => v.toFixed(2)),
      h('button', { class: 'btn ghost sm', onclick: play }, 'Escuchar')), g);
    let solved = false;
    function play() { try { const ac = new (window.AudioContext || window.webkitAudioContext)(); [[f1, .2], [f2, .2 * a2]].forEach(([f, v]) => { const os = ac.createOscillator(), gn = ac.createGain(); os.frequency.value = f; gn.gain.value = v; os.connect(gn).connect(ac.destination); os.start(); os.stop(ac.currentTime + .8); }); } catch (e) {} }
    function draw() {
      const x = c.getContext('2d'), W_ = c._w, H = c._h, C = col(), K = resolveC(); x.clearRect(0, 0, W_, H);
      const half = H / 2 - 10, sig = t => Math.sin(2 * Math.PI * f1 * t) + a2 * Math.sin(2 * Math.PI * f2 * t);
      x.fillStyle = C.muted; x.font = '12px Figtree, system-ui, sans-serif'; x.fillText('onda (tiempo, 20 ms)', 10, 16); x.fillText('espectro (frecuencia, 0–1000 Hz) — lo que "ve" un modelo de audio', 10, half + 34);
      x.strokeStyle = K; x.lineWidth = 2; x.beginPath(); for (let i = 0; i < W_; i++) { const t = i / W_ * 0.02; x.lineTo(i, 20 + half / 2 - sig(t) * half / 3.2); } x.stroke();
      const N = 100; for (let k = 0; k < N; k++) { const fr = k * 10; const m = Math.exp(-((fr - f1) ** 2) / 300) + a2 * Math.exp(-((fr - f2) ** 2) / 300); const bh = m * (half - 40); x.fillStyle = rgba(K, .25 + .7 * Math.min(1, m)); x.fillRect(10 + k * (W_ - 20) / N, H - 8 - bh, (W_ - 20) / N - 1, bh); }
      if (!solved && Math.abs(f1 - 330) <= 10 && Math.abs(f2 - 880) <= 10 && a2 > .1 || (!solved && Math.abs(f2 - 330) <= 10 && Math.abs(f1 - 880) <= 10)) { solved = true; setGoal(g, true, 'Eso es: la transformada de Fourier separa la mezcla en sus tonos. Un espectrograma es esto mismo repetido a lo largo del tiempo.'); api.solved(); }
    }
    draw();
  };

  /* IA 10 — espacio compartido imagen-texto (tipo CLIP) */
  W.clip = (host, o, api) => {
    const imgs = [{ n: 'foto-perro.jpg', e: '🐕', v: [.9, .2, .1] }, { n: 'playa.jpg', e: '🏖️', v: [.1, .9, .3] }, { n: 'pizza.jpg', e: '🍕', v: [.15, .2, .95] }];
    const caps = [{ t: 'un perro corriendo en el parque', v: [.85, .3, .05] }, { t: 'arena, mar y sombrillas', v: [.05, .95, .2] }, { t: 'una pizza recién horneada', v: [.2, .1, .9] }, { t: 'un gato durmiendo', v: [.6, .1, .2] }];
    const cos = (a, b) => { const d = a.reduce((s, v, i) => s + v * b[i], 0); return d / (Math.hypot(...a) * Math.hypot(...b)); };
    let cur = 0; const g = goal('Elige una imagen y observa qué texto queda más cerca'); const pics = h('div', { class: 'row' }); const list = h('div', { style: 'display:grid;gap:8px;margin-top:12px' });
    host.append(h('div', { class: 'status' }, 'Dos codificadores (imagen y texto) proyectan al MISMO espacio. Similitud = coseno entre vectores.'), pics, list, g);
    let seen = new Set();
    function draw() {
      const K = resolveC();
      pics.replaceChildren(...imgs.map((im, i) => h('button', { class: 'opt' + (i === cur ? ' sel' : ''), style: 'flex-direction:column;align-items:center;min-width:110px', onclick: () => { cur = i; seen.add(i); draw(); if (seen.size >= 2) { setGoal(g, true, 'Así funciona la búsqueda "texto → imagen" y la clasificación zero-shot: compara vectores.'); api.solved(); } } }, h('span', { style: 'font-size:38px' }, im.e), h('small', { class: 'mono' }, im.n))));
      const sc = caps.map(cp => ({ ...cp, s: cos(imgs[cur].v, cp.v) })).sort((a, b) => b.s - a.s);
      list.replaceChildren(...sc.map((cp, i) => h('div', { style: 'display:flex;gap:10px;align-items:center' }, h('div', { style: `flex:1;position:relative;background:var(--surface2);border-radius:10px;overflow:hidden;border:1px solid var(--line)` }, h('div', { style: `position:absolute;inset:0;width:${cp.s * 100}%;background:${rgba(K, i ? .15 : .35)}` }), h('div', { style: 'position:relative;padding:7px 10px;font-size:14.5px' }, cp.t)), h('span', { class: 'readout' }, cp.s.toFixed(2)))));
    }
    draw();
  };

  /* Traza de memoria genérica (Rust ownership / Python referencias) */
  W.trace = (host, o, api) => {
    const lines = o.code.split('\n'); let i = 0;
    const codeEl = h('div', { class: 'lines' }); const mem = h('div', { class: 'mem' }); const msg = h('div', { class: 'tmsg' });
    const prev = h('button', { class: 'btn ghost sm', onclick: () => { if (i > 0) { i--; draw(); } } }, '← Atrás');
    const nxt = h('button', { class: 'btn sm', onclick: () => { if (i < o.states.length - 1) { i++; draw(); } } }, 'Siguiente línea →');
    host.append(h('div', { class: 'trace' }, codeEl, mem), msg, h('div', { class: 'row' }, prev, nxt, h('span', { class: 'status', id: '' }, '')));
    function draw() {
      const s = o.states[i];
      codeEl.replaceChildren(...lines.map((t, k) => h('button', { class: k === s.line ? 'cur' : '', tabindex: -1 }, h('span', { class: 'ln' }, String(k + 1)), h('span', {}, t || ' '))));
      const st = h('div', {}, h('h4', {}, o.left || 'Pila (stack)'), ...(s.stack || []).map(v => { const e = h('div', { class: 'slot' + (v.dead ? ' dead' : '') + (v.hot ? ' hot' : '') }, h('b', {}, v.n), h('span', {}, v.v || '')); e.dataset.to = v.to || ''; return e; }));
      const hp = h('div', {}, h('h4', {}, o.right || 'Montón (heap)'), ...(s.heap || []).map(v => { const e = h('div', { class: 'slot' + (v.dead ? ' dead' : '') }, h('span', {}, v.v)); e.dataset.id = v.id; return e; }));
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'arrows');
      mem.replaceChildren(h('div', { class: 'cols' }, st, hp), svg);
      msg.className = 'tmsg' + (s.err ? ' err' : ''); msg.innerHTML = s.msg || '';
      prev.disabled = i === 0; nxt.disabled = i === o.states.length - 1;
      if (i === o.states.length - 1) api.solved();
      requestAnimationFrame(() => {
        const mr = mem.getBoundingClientRect(); const K = resolveC();
        svg.innerHTML = `<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8z" fill="${K}"/></marker></defs>`;
        st.querySelectorAll('.slot').forEach(sl => { const to = sl.dataset.to; if (!to) return; const tgt = [...hp.querySelectorAll('.slot'), ...st.querySelectorAll('.slot')].find(t => t.dataset.id === to || (t !== sl && t.querySelector('b') && t.querySelector('b').textContent === to)); if (!tgt) return; const a = sl.getBoundingClientRect(), b = tgt.getBoundingClientRect(); const sameCol = Math.abs(a.left - b.left) < 5; const x1 = (sameCol ? a.left : a.right) - mr.left, y1 = a.top + a.height / 2 - mr.top; const x2 = b.left - mr.left, y2 = b.top + b.height / 2 - mr.top; const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', sameCol ? `M${x1},${y1} C${x1 - 26},${y1} ${x2 - 26},${y2} ${x2 - 2},${y2}` : `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2 - 2},${y2}`); p.setAttribute('fill', 'none'); p.setAttribute('stroke', sl.classList.contains('dead') ? 'var(--muted)' : K); p.setAttribute('stroke-width', '2'); p.setAttribute('marker-end', 'url(#ah)'); if (sl.classList.contains('dead')) p.setAttribute('stroke-dasharray', '4 4'); svg.append(p); });
      });
    }
    draw();
  };

  /* SQL — simulador de transacciones (2 sesiones) */
  W.txn = (host, o, api) => {
    let committed = ['Alien', 'Matrix']; const S = { A: { open: false, pending: [], log: [] }, B: { open: false, pending: [], log: [] } };
    const g = goal('Objetivo: inserta "Pulp Fiction" en A, compruébalo desde B antes y después del COMMIT');
    const view = k => { let v = [...committed]; S[k].pending.forEach(p => { if (p.op === 'ins') v.push(p.t); if (p.op === 'del') v = v.filter(x => x !== p.t); }); return v; };
    let sawBefore = false, sawAfter = false, rolled = false;
    const act = (k, cmd) => {
      const s = S[k]; const log = (t, cls) => s.log.push([t, cls]);
      log('mysql> ' + cmd, 'cmd');
      if (cmd === 'START TRANSACTION;') { s.open = true; log('Transacción abierta.'); }
      else if (cmd.startsWith('INSERT')) { if (!s.open) { committed.push('Pulp Fiction'); log('1 fila insertada (autocommit: ya es permanente).'); } else { s.pending.push({ op: 'ins', t: 'Pulp Fiction' }); log('1 fila insertada (sin confirmar).'); } }
      else if (cmd.startsWith('DELETE')) { if (!s.open) { committed = committed.filter(x => x !== 'Pulp Fiction'); log('Borrado confirmado.'); } else { s.pending.push({ op: 'del', t: 'Pulp Fiction' }); log('1 fila borrada (sin confirmar).'); } }
      else if (cmd.startsWith('SELECT')) { const v = view(k); log(v.map(t => '| ' + t).join('\n') || '(vacío)'); const has = v.includes('Pulp Fiction'); if (k === 'B') { if (!has && S.A.pending.some(p => p.op === 'ins')) sawBefore = true; if (has && sawBefore) sawAfter = true; } }
      else if (cmd === 'COMMIT;') { const pend = S[k].pending; pend.forEach(p => { if (p.op === 'ins' && !committed.includes(p.t)) committed.push(p.t); if (p.op === 'del') committed = committed.filter(x => x !== p.t); }); s.pending = []; s.open = false; log('Cambios confirmados (Durabilidad).'); }
      else if (cmd === 'ROLLBACK;') { s.pending = []; s.open = false; rolled = true; log('Cambios descartados (Atomicidad).'); }
      draw();
      if (sawBefore && sawAfter) { setGoal(g, true, 'B no veía la fila "sucia" de A (Aislamiento) hasta el COMMIT. Prueba ahora DELETE + ROLLBACK.'); api.solved(); }
    };
    const cmds = ['START TRANSACTION;', "INSERT INTO film(title) VALUES ('Pulp Fiction');", "SELECT title FROM film;", "DELETE FROM film WHERE title='Pulp Fiction';", 'COMMIT;', 'ROLLBACK;'];
    const panes = {}; ['A', 'B'].forEach(k => { panes[k] = h('div', { class: 'sess' }); });
    host.append(h('div', { class: 'status', style: 'margin-bottom:10px' }, 'Dos pestañas de Workbench = dos conexiones. Fuera de START TRANSACTION cada sentencia se confirma sola (autocommit); dentro, nada es definitivo hasta COMMIT.'), h('div', { class: 'grid2' }, panes.A, panes.B), g);
    function draw() {
      ['A', 'B'].forEach(k => {
        const s = S[k]; const logEl = h('div', { class: 'log' }, ...s.log.slice(-14).map(([t, c]) => h('div', { style: c === 'cmd' ? 'color:var(--c);font-weight:600' : 'white-space:pre;color:var(--muted)' }, t)));
        panes[k].replaceChildren(h('h4', {}, 'Sesión ' + k, h('span', { class: 'badge' + (s.open ? ' open' : '') }, s.open ? 'transacción abierta' : 'sin transacción')), h('div', { class: 'acts' }, cmds.map(cm => h('button', { onclick: () => act(k, cm) }, cm.split(' ')[0] === 'INSERT' ? 'INSERT Pulp Fiction' : cm.split(' ')[0] === 'DELETE' ? 'DELETE Pulp Fiction' : cm.startsWith('SELECT') ? 'SELECT * FROM film' : cm.replace(';', '')))), logEl);
        requestAnimationFrame(() => logEl.scrollTop = 1e6);
      });
    }
    draw();
  };

  /* SQL — índices: escaneo completo vs búsqueda en árbol */
  W.index = (host, o, api) => {
    const names = ['Ana Ruiz', 'Bruno Vega', 'Carla Sanz', 'Diego Mora', 'Elena Gil', 'Fabio León', 'Greta Pardo', 'Hugo Rey', 'Irene Soto', 'Julio Cano', 'Karen Lara', 'Luis Nieto', 'Lonzo Bode', 'Marta Ortiz', 'Nora Prieto', 'Óscar Rivas', 'Paula Ruiz', 'Raúl Vega', 'Sara Sanz', 'Tomás Mora', 'Ana Gil', 'Bruno León', 'Carla Pardo', 'Diego Rey', 'Elena Soto', 'Fabio Cano', 'Greta Lara', 'Hugo Nieto', 'Irene Ortiz', 'Julio Prieto', 'Karen Rivas', 'Luis Ruiz'];
    const rows = names.map((n, i) => ({ id: i + 1, n })).sort((a, b) => ((a.id * 7) % 32) - ((b.id * 7) % 32));
    const sorted = [...rows].sort((a, b) => a.n.localeCompare(b.n, 'es'));
    let mode = 'scan', cmp = 0, found = false, timer = null, hi = new Set(), lohi = null;
    const grid = h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:5px;margin-top:12px' });
    const stat = h('span', { class: 'readout' }, 'comparaciones: 0'); const g = goal('Busca "Lonzo Bode" con y sin índice y compara el coste');
    const seg = h('div', { class: 'seg' }, h('button', { class: 'on', onclick: e => setMode('scan', e) }, 'Sin índice (Full Table Scan)'), h('button', { onclick: e => setMode('idx', e) }, 'Con índice (B-tree)'));
    const go = h('button', { class: 'btn sm', onclick: run }, 'Buscar "Lonzo Bode"');
    host.append(h('div', { class: 'row' }, seg, go, stat), grid, g);
    const done = { scan: 0, idx: 0 };
    function setMode(m, e) { mode = m; [...seg.children].forEach(b => b.classList.remove('on')); e.target.classList.add('on'); reset(); }
    function reset() { clearInterval(timer); cmp = 0; found = false; hi.clear(); lohi = null; draw(); }
    function run() {
      reset(); const list = mode === 'scan' ? rows : sorted; let i = 0, lo = 0, hiI = list.length - 1;
      timer = setInterval(() => {
        if (mode === 'scan') { cmp++; hi.add(list[i].id); if (list[i].n === 'Lonzo Bode') { found = list[i].id; clearInterval(timer); fin(); } i++; }
        else { const mid = (lo + hiI) >> 1; cmp++; hi.add(list[mid].id); lohi = [lo, hiI]; const c = list[mid].n.localeCompare('Lonzo Bode', 'es'); if (c === 0) { found = list[mid].id; clearInterval(timer); fin(); } else if (c < 0) lo = mid + 1; else hiI = mid - 1; }
        draw();
      }, mode === 'scan' ? 90 : 450);
    }
    function fin() { done[mode] = cmp; if (done.scan && done.idx) { setGoal(g, true, `Sin índice: ${done.scan} comparaciones. Con índice: ${done.idx}. Con un millón de filas: ~1.000.000 frente a ~20.`); api.solved(); } }
    function draw() {
      const list = mode === 'scan' ? rows : sorted; const K = resolveC();
      stat.textContent = 'comparaciones: ' + cmp + (found ? ' ✓' : '');
      grid.replaceChildren(...list.map((r, k) => h('div', { style: `font:12px var(--mono);padding:6px 8px;border-radius:8px;border:1px solid var(--line);background:${r.id === found ? rgba(K, .5) : hi.has(r.id) ? rgba(K, .15) : (lohi && (k < lohi[0] || k > lohi[1])) ? 'transparent' : 'var(--surface)'};opacity:${lohi && (k < lohi[0] || k > lohi[1]) && r.id !== found ? .35 : 1}` }, r.n)));
    }
    draw();
  };

  /* SQL — JOIN visual */
  W.joinviz = (host, o, api) => {
    const P = [[1, 'Alonso'], [3, 'Hamilton'], [7, 'Verstappen'], [11, 'Kubica']], V = [[3, 'Monaco GP'], [7, 'Spanish GP'], [3, 'Chinese GP'], [99, 'GP fantasma']];
    let t = 'INNER'; const seg = h('div', { class: 'seg' }, ['INNER', 'LEFT', 'RIGHT'].map(k => h('button', { class: k === t ? 'on' : '', onclick: e => { t = k; [...seg.children].forEach(b => b.classList.remove('on')); e.target.classList.add('on'); draw(); seen.add(k); if (seen.size === 3) { g.className = 'goal ok'; g.textContent = '✓ LEFT conserva todo lo de la izquierda (rellena NULL); INNER solo las coincidencias.'; api.solved(); } } }, k + ' JOIN')));
    const sqlEl = h('pre', { class: 'code', style: 'margin:12px 0' }); const out = h('div'); const g = goal('Prueba los tres tipos de JOIN'); const seen = new Set(['INNER']);
    const mini = (title, rows, cols) => h('div', {}, h('div', { class: 'status' }, title), sqlTable([{ columns: cols, values: rows }]));
    host.append(h('div', { class: 'grid2' }, mini('drivers (d)', P, ['driverId', 'surname']), mini('wins (w)', V, ['driverId', 'race'])), h('div', { class: 'row' }, seg), sqlEl, out, g);
    function draw() {
      sqlEl.textContent = `SELECT d.surname, w.race\nFROM drivers d ${t} JOIN wins w ON d.driverId = w.driverId;`;
      let rows = [];
      if (t !== 'RIGHT') P.forEach(([id, n]) => { const m = V.filter(v => v[0] === id); if (m.length) m.forEach(v => rows.push([n, v[1]])); else if (t === 'LEFT') rows.push([n, null]); });
      else V.forEach(([id, r]) => { const m = P.find(p => p[0] === id); rows.push([m ? m[1] : null, r]); });
      out.replaceChildren(sqlTable([{ columns: ['surname', 'race'], values: rows }]));
    }
    draw();
  };

  /* SQL — GROUP BY visual */
  W.groupby = (host, o, api) => {
    const rows = [['Hamilton', 'Mercedes', 25], ['Bottas', 'Mercedes', 18], ['Vettel', 'Ferrari', 15], ['Räikkönen', 'Ferrari', 12], ['Verstappen', 'Red Bull', 10], ['Ricciardo', 'Red Bull', 0], ['Pérez', 'Force India', 6]];
    let agg = 'SUM', grouped = false; const out = h('div'); const sqlEl = h('pre', { class: 'code' });
    const sel = h('select', { 'aria-label': 'Función de agregado' }, ['SUM', 'AVG', 'COUNT', 'MAX'].map(a => h('option', {}, a))); sel.onchange = () => { agg = sel.value; draw(); };
    const tg = h('button', { class: 'btn sm', onclick: () => { grouped = !grouped; tg.textContent = grouped ? 'Desagrupar' : 'Agrupar por equipo'; draw(); if (grouped) api.solved(); } }, 'Agrupar por equipo');
    host.append(h('div', { class: 'row' }, tg, h('label', {}, 'agregado', sel)), sqlEl, out);
    function draw() {
      const hue = { Mercedes: 170, Ferrari: 0, 'Red Bull': 230, 'Force India': 30 };
      if (!grouped) { sqlEl.textContent = 'SELECT surname, team, points FROM results_demo;'; out.replaceChildren(h('div', { style: 'display:grid;gap:4px' }, rows.map(r => h('div', { style: `display:flex;justify-content:space-between;font:13px var(--mono);padding:7px 10px;border-radius:9px;background:hsla(${hue[r[1]]},60%,55%,.15)` }, h('span', {}, r[0]), h('span', {}, r[1]), h('b', {}, r[2]))))); return; }
      sqlEl.textContent = `SELECT team, ${agg}(${agg === 'COUNT' ? '*' : 'points'})\nFROM results_demo\nGROUP BY team;`;
      const gs = {}; rows.forEach(r => (gs[r[1]] = gs[r[1]] || []).push(r[2]));
      const f = v => agg === 'SUM' ? v.reduce((a, b) => a + b) : agg === 'AVG' ? (v.reduce((a, b) => a + b) / v.length).toFixed(1) : agg === 'COUNT' ? v.length : Math.max(...v);
      out.replaceChildren(h('div', { style: 'display:grid;gap:6px' }, Object.entries(gs).map(([k, v]) => h('div', { style: `display:flex;justify-content:space-between;align-items:center;font:13px var(--mono);padding:10px 12px;border-radius:12px;background:hsla(${hue[k]},60%,55%,.18)` }, h('span', {}, k + '  ', h('span', { style: 'opacity:.6' }, `(${v.length} filas → 1)`)), h('b', { style: 'font-size:16px' }, String(f(v)))))));
    }
    draw();
  };
})();
