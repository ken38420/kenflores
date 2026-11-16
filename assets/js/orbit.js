/* Ken Flores, portfolio · héros « Orbite » : maquettes 3D des projets qui tournent autour du nom au défilement.
   Aucune bibliothèque de scroll : la progression vient de la position du conteneur .orbit (étage sticky).
   Three.js r170 (MIT) est servi en local et importé seulement quand la vue Accueil est affichée.
   Repli : window.kfOrbitFail() (défini dans <head>) remet le héros classique. */
window.kfOrbitAlive = true;

const root = document.documentElement;
const orbitEl = document.querySelector('[data-orbit]');
const home = document.getElementById('accueil');
const mq = window.matchMedia('(min-height:560px) and (prefers-reduced-motion:no-preference)');
const fail = (why) => { if (window.console) console.warn('orbite : repli', why); if (window.kfOrbitFail) window.kfOrbitFail(); };

if (root.classList.contains('orbit') && orbitEl && home) {
  const start = () => {
    let done = false;
    const timer = setTimeout(() => { if (!done) fail('import trop long'); }, 6000);
    import('./vendor/three.module.min.js')
      .then((THREE) => { done = true; clearTimeout(timer); if (root.classList.contains('orbit')) build(THREE); })
      .catch((e) => { done = true; clearTimeout(timer); fail(e); });
  };
  /* Three.js n'est chargé que si l'Accueil est affiché ET que l'écran permet l'orbite (hauteur, pas de « réduire les animations ») */
  let started = false;
  const check = () => { if (!started && home.classList.contains('on') && mq.matches) { started = true; mo.disconnect(); mq.removeEventListener('change', check); start(); } };
  const mo = new MutationObserver(check);
  mo.observe(home, { attributes: true, attributeFilter: ['class'] });
  mq.addEventListener('change', check);
  check();
}

function build(THREE) {
  const stage = orbitEl.querySelector('.hero');
  const canvas = orbitEl.querySelector('.orbit-canvas');
  const txt = orbitEl.querySelector('.hero-txt');
  const live = orbitEl.querySelectorAll('.status, .ctas');
  const css = getComputedStyle(root);
  const col = (n, d) => new THREE.Color((css.getPropertyValue(n) || d).trim());
  const INK = col('--on-night', '#F2F5FA'), FACE = col('--night-2', '#0D2340'), NIGHT = col('--night', '#071426');
  const SIGNAL = col('--signal-night', '#FF8A3D'), SKY = col('--sky', '#6CB6FF');

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) { fail(e); return; }
  renderer.setClearColor(0x000000, 0);
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); fail('contexte WebGL perdu'); });

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(NIGHT, 7, 15);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);

  /* --- matériaux : arêtes blanches, faces nuit qui masquent les traits cachés (comme une mise en plan) --- */
  const lineMat = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.92 });
  const thinMat = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.38 });
  const accMat = new THREE.LineBasicMaterial({ color: SIGNAL });
  const skyMat = new THREE.LineBasicMaterial({ color: SKY });
  const faceMat = new THREE.MeshBasicMaterial({ color: FACE, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });

  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const lines = (pts, mat = lineMat) => new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), mat);
  const ring = (r, y, mat = lineMat, n = 48) => {
    const p = [];
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, b = (i + 1) / n * Math.PI * 2; p.push(V(Math.cos(a) * r, y, Math.sin(a) * r), V(Math.cos(b) * r, y, Math.sin(b) * r)); }
    return lines(p, mat);
  };
  /* cylindre : faces + cercles haut/bas + génératrices (EdgesGeometry ne trace pas les silhouettes) */
  const cyl = (r, h, y, opt = {}) => {
    const g = new THREE.Group();
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 48, 1, !!opt.open), faceMat);
    m.position.y = y + h / 2; g.add(m);
    g.add(ring(r, y), ring(r, y + h));
    if (opt.inner) g.add(ring(opt.inner, y + h, thinMat));
    const gen = [], n = opt.gen || 10;
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; gen.push(V(Math.cos(a) * r, y, Math.sin(a) * r), V(Math.cos(a) * r, y + h, Math.sin(a) * r)); }
    g.add(lines(gen, thinMat));
    return g;
  };
  const box = (w, h, d, x, y, z) => {
    const geo = new THREE.BoxGeometry(w, h, d);
    const g = new THREE.Group();
    const m = new THREE.Mesh(geo, faceMat); g.add(m);
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), lineMat));
    g.position.set(x, y, z);
    return g;
  };

  /* --- maquettes, d'après les schémas et les cotes de la page --- */
  // GEM-GCR (PoliSpace) : cylindre ABS, isolant XPS, enveloppe aluminium, couvercle vissé et joint, vue éclatée
  const gem = () => {
    const g = new THREE.Group();
    g.add(cyl(0.80, 1.00, 0.00, { inner: 0.74 }));
    g.add(cyl(0.98, 1.06, 1.22, { inner: 0.86 }));
    g.add(cyl(1.06, 1.12, 2.50, { inner: 1.00 }));
    g.add(ring(1.00, 3.78, accMat));
    g.add(cyl(1.06, 0.12, 3.92, { gen: 16 }));
    const bolts = [];
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, x = Math.cos(a) * 0.96, z = Math.sin(a) * 0.96; bolts.push(V(x, 4.04, z), V(x, 4.16, z)); }
    g.add(lines(bolts));
    return g;
  };
  // Châssis tubulaire Formula Student : nœuds relevés sur le schéma de côté (640 × 320), symétrisés
  const chassis = () => {
    const g = new THREE.Group();
    const P = (x, y) => [(x - 325) / 100, (285 - y) / 100];
    const half = (x) => (x < 235 ? 0.30 : x < 405 ? 0.44 : 0.40);
    const segs = [[80,232,230,240],[230,240,400,238],[400,238,570,226],[88,188,240,128],[80,232,88,188],[570,226,560,170],
      [412,78,540,150],[540,150,570,226],[400,238,560,170],[88,188,230,240],[240,128,404,150],[404,150,560,170],[232,190,402,192]];
    const hoops = [[230,240,240,128],[400,238,412,78]];
    const pts = [], acc = [], cross = new Map();
    const node = (x, y) => { cross.set(x + ',' + y, [x, y]); };
    for (const [x1, y1, x2, y2] of segs) {
      const [a, b] = P(x1, y1), [c, d] = P(x2, y2);
      for (const s of [1, -1]) pts.push(V(a, b, s * half(x1)), V(c, d, s * half(x2)));
      node(x1, y1); node(x2, y2);
    }
    for (const [x1, y1, x2, y2] of hoops) {
      const [a, b] = P(x1, y1), [c, d] = P(x2, y2), top = half(x2) * 0.55;
      for (const s of [1, -1]) acc.push(V(a, b, s * half(x1)), V(c, d, s * top));
      acc.push(V(c, d, top), V(c, d, -top));
    }
    for (const [x, y] of cross.values()) { const [a, b] = P(x, y); pts.push(V(a, b, half(x)), V(a, b, -half(x))); }
    g.add(lines(pts));
    g.add(lines(acc, skyMat));
    for (const [cx, cy] of [[160, 243], [505, 243]]) {
      const [a, b] = P(cx, cy);
      for (const s of [1, -1]) { const w = ring(0.42, 0, thinMat); w.rotation.x = Math.PI / 2; w.position.set(a, b, s * 0.78); g.add(w); }
    }
    return g;
  };
  // Mât rotor d'hélicoptère : arbre creux Ø158, moyeu, quatre départs de pale, plateau cyclique, section critique
  const mast = () => {
    const g = new THREE.Group();
    g.add(cyl(0.62, 0.16, 0.00, { gen: 16 }));
    g.add(cyl(0.34, 3.00, 0.16, { inner: 0.24 }));
    const sw = ring(0.78, 1.15); g.add(sw); g.add(ring(0.60, 1.15, thinMat));
    g.add(ring(0.36, 2.05, accMat));
    g.add(cyl(0.72, 0.36, 3.16, { gen: 12 }));
    for (let i = 0; i < 4; i++) { const b = box(1.30, 0.12, 0.30, 0, 3.34, 0); b.children.forEach((c) => { c.position.x = 1.30; }); b.rotation.y = i * Math.PI / 2; g.add(b); }
    return g;
  };

  // Cabine de télécabine (Expleo pour Sigmacabin) : cabine arrondie, suspente au câble, quille tubulaire en V sous le plancher
  const cabin = () => {
    const g = new THREE.Group();
    g.add(box(1.7, 1.5, 1.3, 0, 0.75, 0));
    const win = [];
    for (const z of [0.651, -0.651]) win.push(V(-0.72, 0.85, z), V(0.72, 0.85, z), V(0.72, 0.85, z), V(0.72, 1.32, z), V(0.72, 1.32, z), V(-0.72, 1.32, z), V(-0.72, 1.32, z), V(-0.72, 0.85, z), V(0, 0.08, z), V(0, 1.32, z));
    g.add(lines(win, thinMat));
    g.add(box(0.5, 0.12, 0.5, 0, 1.56, 0));
    g.add(lines([V(0, 1.62, 0), V(0, 2.5, 0), V(-1.2, 2.62, 0), V(1.2, 2.5, 0)]));
    g.add(box(0.5, 0.22, 0.3, 0, 2.55, 0));
    const keel = [];
    for (const z of [0.42, -0.42]) keel.push(V(-0.7, 0, z), V(-0.15, -0.42, z), V(-0.15, -0.42, z), V(0.15, -0.42, z), V(0.15, -0.42, z), V(0.7, 0, z));
    keel.push(V(-0.15, -0.42, 0.42), V(-0.15, -0.42, -0.42), V(0.15, -0.42, 0.42), V(0.15, -0.42, -0.42));
    g.add(lines(keel, skyMat));
    for (const x of [-0.7, 0.7]) { const sb = ring(0.07, 0, accMat, 16); sb.rotation.x = Math.PI / 2; sb.position.set(x, 0, 0); g.add(sb); }
    return g;
  };
  // AuraFlow : robot cartésien fixé au plafond de la station, au-dessus du véhicule
  const gantry = () => {
    const g = new THREE.Group();
    for (const z of [0.9, -0.9]) g.add(box(3.2, 0.1, 0.12, 0, 2.4, z));
    g.add(box(0.14, 0.12, 1.9, 0.4, 2.28, 0));
    g.add(box(0.3, 0.22, 0.3, 0.4, 2.12, 0.25));
    g.add(box(0.1, 1.1, 0.1, 0.4, 1.46, 0.25));
    g.add(lines([V(0.4, 0.91, 0.25), V(0.62, 0.78, 0.25)], accMat));
    const car = box(2.4, 0.5, 1.1, -0.1, 0.42, 0); car.children[1].material = thinMat; g.add(car);
    g.add(box(1.3, 0.38, 1.0, -0.25, 0.86, 0));
    for (const x of [-0.9, 0.7]) for (const z of [0.56, -0.56]) { const w = ring(0.2, 0, thinMat, 24); w.rotation.x = Math.PI / 2; w.position.set(x, 0.18, z); g.add(w); }
    return g;
  };
  // Mât de brise-roche hydraulique (Fradem) : platine à 6 goujons, mât, passerelle, échelle à crinoline, bras
  const breaker = () => {
    const g = new THREE.Group();
    g.add(cyl(0.55, 0.08, 0, { gen: 6 }));
    const st = [];
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; st.push(V(Math.cos(a) * 0.45, 0.08, Math.sin(a) * 0.45), V(Math.cos(a) * 0.45, 0.2, Math.sin(a) * 0.45)); }
    g.add(lines(st, accMat));
    g.add(cyl(0.2, 3.0, 0.08, { gen: 8 }));
    g.add(box(1.1, 0.06, 1.1, 0, 3.1, 0));
    const rail = [];
    for (const [x, z] of [[-0.55, -0.55], [0.55, -0.55], [0.55, 0.55], [-0.55, 0.55]]) rail.push(V(x, 3.13, z), V(x, 3.55, z));
    rail.push(V(-0.55, 3.55, -0.55), V(0.55, 3.55, -0.55), V(0.55, 3.55, -0.55), V(0.55, 3.55, 0.55), V(0.55, 3.55, 0.55), V(-0.55, 3.55, 0.55));
    g.add(lines(rail, thinMat));
    const lad = [V(-0.12, 0.3, 0.32), V(-0.12, 3.1, 0.32), V(0.12, 0.3, 0.32), V(0.12, 3.1, 0.32)];
    for (let y = 0.5; y < 3.1; y += 0.25) lad.push(V(-0.12, y, 0.32), V(0.12, y, 0.32));
    g.add(lines(lad, thinMat));
    for (let y = 1.2; y < 3.1; y += 0.45) { const h = ring(0.3, y, thinMat, 24); h.position.z = 0.42; g.add(h); }
    g.add(lines([V(0, 2.9, 0), V(1.7, 2.3, 0), V(1.7, 2.3, 0), V(2.3, 1.2, 0)], skyMat));
    g.add(box(0.16, 0.5, 0.16, 2.3, 0.95, 0));
    return g;
  };
  // KBE : une pièce de construction métallique mise en plan, platine percée et goussets
  const bracket = () => {
    const g = new THREE.Group();
    g.add(box(2.2, 0.12, 1.4, 0, 0.06, 0));
    g.add(box(0.12, 1.4, 1.4, -1.04, 0.82, 0));
    const gus = [];
    for (const z of [0.45, -0.45]) gus.push(V(-0.98, 0.12, z), V(0.2, 0.12, z), V(0.2, 0.12, z), V(-0.98, 1.3, z), V(-0.98, 1.3, z), V(-0.98, 0.12, z));
    g.add(lines(gus, skyMat));
    for (const [x, z] of [[0.6, 0.45], [0.6, -0.45], [0.95, 0.45], [0.95, -0.45]]) { const h = ring(0.09, 0.121, lineMat, 20); h.position.set(x, 0, z); g.add(h); }
    for (const [y, z] of [[0.95, 0.4], [0.95, -0.4]]) { const h = ring(0.1, 0, accMat, 20); h.rotation.z = Math.PI / 2; h.position.set(-1.10, y, z); g.add(h); }
    return g;
  };

  const makers = [['gem-gcr', gem, 1.5], ['efst', chassis, 2.2], ['mat-rotor', mast, 1.7], ['expleo', cabin, 1.6], ['auraflow', gantry, 1.9], ['fradem', breaker, 1.8], ['kbe', bracket, 1.5]];
  const labels = document.createElement('div');
  labels.className = 'orbit-labels';
  stage.appendChild(labels);
  const models = makers.map(([id, make, k]) => {
    const inner = make();
    const bb = new THREE.Box3().setFromObject(inner), size = bb.getSize(V(0, 0, 0)), c = bb.getCenter(V(0, 0, 0));
    inner.position.sub(c);
    const s = k / Math.max(size.x, size.y, size.z);
    const holder = new THREE.Group(); holder.add(inner); holder.scale.setScalar(s); holder.userData.s = s;
    const t = document.querySelector('.tile a[href="#' + id + '"] .tile-t');
    const a = document.createElement('a');
    a.href = '#' + id; a.className = 'orbit-label'; a.textContent = t ? t.textContent : id;
    labels.appendChild(a); holder.userData.label = a;
    scene.add(holder);
    return holder;
  });

  /* --- étoiles : la « constellation » de l'état final --- */
  const starGeo = new THREE.BufferGeometry(), sp = [];
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 260; i++) { const a = rnd() * Math.PI * 2, b = Math.acos(2 * rnd() - 1), r = 14 + rnd() * 10; sp.push(r * Math.sin(b) * Math.cos(a), r * Math.cos(b) * 0.6, r * Math.sin(b) * Math.sin(a) - 4); }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  const starMat = new THREE.PointsMaterial({ color: INK, size: 2, sizeAttenuation: false, transparent: true, opacity: 0, fog: false });
  scene.add(new THREE.Points(starGeo, starMat));

  /* --- progression et rendu à la demande --- */
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  let W = 0, H = 0, R = 3.4, HW = 4, HH = 2.9, queued = false, active = true;

  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return false;
    if (w !== W || h !== H) {
      W = w; H = h;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(W, H, false);
      camera.aspect = W / H; camera.updateProjectionMatrix();
      HH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 9.5; HW = HH * camera.aspect;
      R = Math.min(clamp(2.4 + (W / H) * 1.6, 3.0, 5.4), HW * 0.86);
    }
    return true;
  };

  const progress = () => {
    const bar = parseFloat(css.getPropertyValue('--bar-h')) || 49;
    const run = orbitEl.offsetHeight - stage.offsetHeight;
    return run > 0 ? clamp((bar - orbitEl.getBoundingClientRect().top) / run) : 0;
  };

  const draw = () => {
    queued = false;
    if (!active || !home.classList.contains('on') || !resize()) return;
    const p = progress();
    /* 0 → 0,62 : l'anneau tourne autour du nom ; 0,62 → 0,78 : « boum », l'anneau éclate ;
       0,78 → 1 : les maquettes se rangent en ligne, comme une vitrine, juste avant la section Projets */
    const burst = smooth(0.62, 0.74, p) * (1 - smooth(0.74, 0.9, p));
    const line = smooth(0.72, 0.95, p);
    const turn = Math.min(p, 0.74) * Math.PI * 2.1;
    camera.position.set(0, 1.3 - line * 1.3, 9.5);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const n = models.length, tall = W < H;
    const cols = tall ? 2 : 4, rows = Math.ceil(n / cols);
    const gx = Math.min(HW * 1.7 / cols, 3.2), gy = Math.min(HH * 1.5 / rows, 2.3);
    const ry = tall ? HH * 0.62 : R * 0.17, fit = tall ? 0.42 : 0.85, small = tall ? 0.55 : 0.8;
    lineMat.opacity = tall ? 0.5 + 0.42 * line : 0.92; thinMat.opacity = lineMat.opacity * 0.42;
    const showLabels = line > 0.92;
    labels.classList.toggle('on', showLabels);
    models.forEach((m, i) => {
      const a = turn + i / n * Math.PI * 2 + 0.35;
      const r = (tall ? HW * 0.8 : R) * (1 + burst * 0.9);
      const ring = [Math.sin(a) * r, -Math.cos(a) * ry * (1 + burst * 0.9) + 0.15, Math.cos(a) * r * 0.62];
      const row = Math.floor(i / cols), inRow = Math.min(cols, n - row * cols), col = i % cols;
      const cell = [(col - (inRow - 1) / 2) * gx, ((rows - 1) / 2 - row) * gy + 0.25, 0];
      m.position.set(ring[0] + (cell[0] - ring[0]) * line, ring[1] + (cell[1] - ring[1]) * line, ring[2] + (cell[2] - ring[2]) * line);
      m.rotation.set(0.2 + p * 0.5, -a * 1.3 + p * 2.6, 0.05 * (1 - line));
      m.scale.setScalar(m.userData.s * (small + (fit - small) * line) * (1 + burst * 0.35));
      if (showLabels) {
        const v = m.position.clone(); v.y -= gy * 0.42; v.project(camera);
        m.userData.label.style.transform = 'translate(' + ((v.x + 1) / 2 * W).toFixed(1) + 'px,' + ((1 - v.y) / 2 * H).toFixed(1) + 'px) translate(-50%,0)';
      }
    });
    starMat.opacity = smooth(0.6, 0.8, p) * 0.7;
    const t = 1 - smooth(0.6, 0.72, p);
    stage.style.setProperty('--txt-o', t.toFixed(3));
    stage.style.setProperty('--txt-s', (1 + burst * 0.1).toFixed(3));
    const hide = t < 0.3;
    live.forEach((el) => { if (el.inert !== hide) el.inert = hide; });
    renderer.render(scene, camera);
  };
  const ask = () => { if (!queued) { queued = true; requestAnimationFrame(draw); } };

  window.addEventListener('scroll', ask, { passive: true });
  window.addEventListener('resize', ask);
  new MutationObserver(ask).observe(home, { attributes: true, attributeFilter: ['class'] });
  /* rotation de l'écran ou zoom : on suspend sans considérer que c'est un échec, et on reprend quand la condition revient */
  mq.addEventListener('change', () => { active = mq.matches; if (active) { W = H = 0; ask(); } });
  active = mq.matches;

  draw();
  root.classList.add('orbit-ready');
}
