// =========================================================
// frmdp.js — UTN Facultad Regional Mar del Plata
// Rediseño SYSACAD: estética de plano técnico (blueprint + cajetín)
// Maneja: login (loginAlumno.asp) y menú principal (menuAlumno.asp)
// =========================================================

(function () {
  'use strict';

  const DARK_KEY = 'ms-frmdp-dark';
  const isDark = () => document.documentElement.classList.contains('dark');

  // Default oscuro; solo claro si el usuario lo eligió antes
  if (localStorage.getItem(DARK_KEY) !== '0') document.documentElement.classList.add('dark');

  function applyDark(on) {
    document.documentElement.classList.toggle('dark', on);
    localStorage.setItem(DARK_KEY, on ? '1' : '0');
    const btn = document.getElementById('frmdp-toggle');
    if (btn) btn.innerHTML = on ? ICON.sun : ICON.moon;
  }

  // ---------- Iconos (line icons, 24x24, stroke currentColor) ----------
  const svg = (inner) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
  const ICON = {
    moon: svg('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'),
    sun:  svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>'),
    plan: svg('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'),
    estado: svg('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'),
    notas: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
    examen: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>'),
    inscripcion: svg('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/>'),
    corr: svg('<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4v7a4 4 0 0 1-4 4H6"/>'),
    cert: svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>'),
    boleto: svg('<path d="M4 16V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10"/><path d="M4 16h16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2z"/><circle cx="8" cy="20" r="1"/><circle cx="16" cy="20" r="1"/><path d="M4 11h16"/>'),
    avisos: svg('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'),
    pass: svg('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
    salir: svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>'),
    link: svg('<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>')
  };

  // ---------- Mapeo de links del menú ----------
  // filename (sin id) -> { label, group, icon }
  const MENU_MAP = {
    'materiasplan':           { label: 'Materias del plan',     group: 'cursada',  icon: 'plan' },
    'estadoacademico':        { label: 'Estado académico',      group: 'cursada',  icon: 'estado' },
    'notasparciales':         { label: 'Cursado y notas',       group: 'cursada',  icon: 'notas' },
    'examenes':               { label: 'Exámenes',              group: 'examenes', icon: 'examen' },
    'materiasexamen':         { label: 'Inscripción a examen',  group: 'examenes', icon: 'inscripcion' },
    'correlatividadcursado':  { label: 'Correlativas: cursar',  group: 'examenes', icon: 'corr' },
    'correlatividadexamen':   { label: 'Correlativas: rendir',  group: 'examenes', icon: 'corr' },
    'menucertificados':       { label: 'Certificados',          group: 'tramites', icon: 'cert' },
    'boletoestudiantil':      { label: 'Boleto educativo',      group: 'tramites', icon: 'boleto' },
    'menuavisosalumnos':      { label: 'Avisos',                group: 'tramites', icon: 'avisos' },
    'cambiopassword':         { label: 'Cambiar contraseña',    group: 'tramites', icon: 'pass' }
  };
  const GROUP_ORDER = ['cursada', 'examenes', 'tramites'];
  const GROUP_TITLE = { cursada: 'Cursada', examenes: 'Exámenes', tramites: 'Trámites', otros: 'Opciones' };

  // Ícono según el nombre del archivo (para links no mapeados, ej. certificados)
  function iconForFile(file) {
    if (/cert/.test(file)) return 'cert';
    if (/actividad|academic/.test(file)) return 'estado';
    if (/aviso/.test(file)) return 'avisos';
    if (/boleto/.test(file)) return 'boleto';
    if (/examen/.test(file)) return 'examen';
    return 'link';
  }

  function getLogoUrl() {
    try {
      const u = chrome.runtime.getURL('icons/UTN_logo.png');
      if (u && !u.startsWith('undefined')) return u;
    } catch (e) {}
    try { return chrome.runtime.getURL('ModernSysacad/icons/UTN_logo.png'); }
    catch (e) { return ''; }
  }

  // ---------- Scaffolding compartido ----------
  function makeSheet(wide) {
    const sheet = document.createElement('div');
    sheet.className = 'frmdp-sheet' + (wide ? ' frmdp-sheet--wide' : '');
    const tr = document.createElement('span'); tr.className = 'frmdp-corner tr';
    const bl = document.createElement('span'); bl.className = 'frmdp-corner bl';
    sheet.appendChild(tr); sheet.appendChild(bl);
    return sheet;
  }

  function makeHead() {
    const head = document.createElement('div');
    head.className = 'frmdp-head';
    const logoUrl = getLogoUrl();
    let logoEl;
    if (logoUrl) {
      logoEl = document.createElement('img');
      logoEl.className = 'frmdp-logo';
      logoEl.src = logoUrl; logoEl.alt = 'UTN';
      logoEl.onerror = () => logoEl.replaceWith(logoFallback());
    } else { logoEl = logoFallback(); }
    const txt = document.createElement('div');
    txt.className = 'frmdp-head-txt';
    txt.innerHTML = '<span class="frmdp-eyebrow">UTN · FRMDP</span>' +
                    '<span class="frmdp-uni">Facultad Regional Mar del Plata</span>';
    head.appendChild(logoEl); head.appendChild(txt);
    return head;
  }

  function makeBlock(cells) {
    const block = document.createElement('div');
    block.className = 'frmdp-block';
    block.innerHTML = cells.map(c =>
      '<div class="frmdp-cell"><div class="frmdp-cell-k">' + c[0] +
      '</div><div class="frmdp-cell-v">' + c[1] + '</div></div>').join('');
    return block;
  }

  function makeToggle() {
    const t = document.createElement('button');
    t.id = 'frmdp-toggle'; t.className = 'frmdp-toggle'; t.type = 'button';
    t.setAttribute('aria-label', 'Cambiar tema');
    t.innerHTML = isDark() ? ICON.sun : ICON.moon;
    t.addEventListener('click', () => applyDark(!isDark()));
    return t;
  }

  function mount(stage, toggle) {
    document.body.innerHTML = '';
    document.body.appendChild(stage);
    document.body.appendChild(toggle);
    document.body.classList.remove('frmdp-loading');
    setCounters(document);
  }

  function logoFallback() {
    const d = document.createElement('div');
    d.className = 'frmdp-logo-fallback';
    d.textContent = 'UTN';
    return d;
  }

  // ---------- Utilidades de animación ----------
  function reducedMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }

  // Setea los valores numéricos (sin animación)
  function setCounters(root) {
    [...root.querySelectorAll('[data-count]')].forEach(el => {
      const target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      const dec = parseInt(el.getAttribute('data-dec') || '0', 10);
      const suf = el.getAttribute('data-suf') || '';
      el.textContent = target.toFixed(dec) + suf;
    });
  }

  // ---------- Vencimiento de regularidad (2 años) ----------
  const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  function parseCursa(raw) {
    // "Cursa en 01TUP2 Sede Central" → comisión + sede
    const m = (raw || '').match(/cursa\s+en\s+(\S+)\s*(.*)/i);
    if (!m) return null;
    return { com: m[1].trim(), sede: (m[2] || '').trim() };
  }

  function vencInfo(raw) {
    const m = (raw || '').match(/regular\s+en\s+(\d{4})\s*\((\d)\s*C\)/i);
    if (!m) return null;
    const year = parseInt(m[1], 10), cuat = parseInt(m[2], 10);
    // Fin de cursada aprox: 1C → 31 jul; 2C → 31 dic. Vence 2 años después.
    const vence = new Date(year + 2, cuat === 1 ? 6 : 11, 31);
    const today = new Date();
    const days = Math.round((vence - today) / 86400000);
    let cls = 'vig';
    if (days < 0) cls = 'venc';
    else if (days <= 150) cls = 'prox';
    const label = MESES[vence.getMonth()] + '. ' + vence.getFullYear();
    return { label, cls, days };
  }

  // =========================================================
  // LOGIN
  // =========================================================
  function buildLogin(form) {
    document.body.classList.add('frmdp-loading');

    const hidden = [...form.querySelectorAll('input[type="hidden"]')];
    const legajo = form.querySelector('input[name="legajo"]');
    const pass   = form.querySelector('input[name="password"]');
    const submit = form.querySelector('input[type="submit"]');
    const btnLabel = (submit && submit.value) ? submit.value : 'Ingresar';
    const btnName  = submit ? submit.name : 'loginbutton';

    form.innerHTML = '';
    hidden.forEach(h => form.appendChild(h));

    if (legajo) {
      legajo.removeAttribute('size'); legajo.className = 'frmdp-input';
      legajo.id = 'frmdp-legajo';
      legajo.setAttribute('placeholder', '000000');
      legajo.setAttribute('inputmode', 'numeric');
      legajo.setAttribute('autocomplete', 'username');
      form.appendChild(field('Legajo', legajo));
    }
    if (pass) {
      pass.removeAttribute('size'); pass.className = 'frmdp-input';
      pass.id = 'frmdp-pass';
      pass.setAttribute('placeholder', '••••••••');
      pass.setAttribute('autocomplete', 'current-password');
      form.appendChild(field('Contraseña', pass));
    }

    const btn = document.createElement('button');
    btn.type = 'submit'; btn.name = btnName; btn.className = 'frmdp-btn';
    btn.innerHTML = btnLabel + ' <span class="arrow">→</span>';
    form.appendChild(btn);

    const stage = document.createElement('div'); stage.className = 'frmdp-stage';
    const sheet = makeSheet(false);
    const body = document.createElement('div'); body.className = 'frmdp-body';

    const title = document.createElement('h1');
    title.className = 'frmdp-title'; title.textContent = 'Ingreso al sistema';

    const hint = document.createElement('p');
    hint.className = 'frmdp-hint';
    hint.innerHTML = 'Primer ingreso: usá tu <strong>legajo</strong> y tu <strong>DNI</strong> como contraseña.';

    body.appendChild(title); body.appendChild(form); body.appendChild(hint);
    sheet.appendChild(makeHead());
    sheet.appendChild(body);
    sheet.appendChild(makeBlock([['Sistema','SYSACAD'],['Módulo','Autogestión'],['Regional','FRMDP']]));
    stage.appendChild(sheet);

    mount(stage, makeToggle());
    if (legajo) setTimeout(() => legajo.focus(), 350);
  }

  function field(labelText, input) {
    const f = document.createElement('div'); f.className = 'frmdp-field';
    const l = document.createElement('label'); l.className = 'frmdp-lbl';
    l.setAttribute('for', input.id); l.textContent = labelText;
    f.appendChild(l); f.appendChild(input);
    return f;
  }

  // =========================================================
  // MENÚ PRINCIPAL
  // =========================================================
  function buildMenu(list) {
    document.body.classList.add('frmdp-loading');

    // Nombre del alumno (td.tituloTabla)
    let student = '';
    const nameCell = document.querySelector('td.tituloTabla, .tituloTabla');
    if (nameCell) student = nameCell.textContent.trim();

    // Recolectar links
    const anchors = [...list.querySelectorAll('a')];
    let exitHref = null;        // se setea solo si hay link real de "Salir"
    const groups = {};

    anchors.forEach(a => {
      const href = a.getAttribute('href') || '';
      const file = (href.split('?')[0].split('/').pop() || '').toLowerCase().replace('.asp', '');
      const txt = a.textContent.trim();

      if (file === 'loginalumno' || /salir/i.test(txt)) { exitHref = href; return; }
      // Link de "volver al menú" en sub-páginas: se ignora (lo reemplaza el botón Volver)
      if (file === 'menualumno' || /volver a men/i.test(txt)) return;

      const meta = MENU_MAP[file] || { label: txt, group: 'otros', icon: iconForFile(file) };
      (groups[meta.group] = groups[meta.group] || []).push({ href, label: meta.label, icon: meta.icon });
    });

    // Menú principal = tiene link de Salir. Si no, es un sub-menú (ej: Certificados)
    const isSub = !exitHref;
    const id = getSessionId();

    // Construir
    const stage = document.createElement('div'); stage.className = 'frmdp-stage';
    const sheet = makeSheet(true);
    const body = document.createElement('div'); body.className = 'frmdp-body';

    if (isSub) {
      // Sub-menú: botón volver arriba + título de la página
      body.appendChild(makeBack(id, 'top'));
    } else if (student) {
      const greet = document.createElement('div');
      greet.className = 'frmdp-greet'; greet.textContent = 'Sesión activa';
      body.appendChild(greet);
    }
    const title = document.createElement('h1');
    title.className = 'frmdp-title';
    title.textContent = isSub ? (document.title || 'Opciones') : (student || 'Menú principal');
    body.appendChild(title);

    const order = GROUP_ORDER.concat(Object.keys(groups).filter(g => GROUP_ORDER.indexOf(g) === -1));
    order.forEach(gKey => {
      const items = groups[gKey];
      if (!items || !items.length) return;
      const group = document.createElement('div'); group.className = 'frmdp-group';
      if (!isSub) {
        const lbl = document.createElement('div'); lbl.className = 'frmdp-group-lbl';
        lbl.textContent = GROUP_TITLE[gKey] || gKey;
        group.appendChild(lbl);
      }

      const grid = document.createElement('div'); grid.className = 'frmdp-grid';
      items.forEach((it, i) => {
        const a = document.createElement('a');
        a.className = 'frmdp-tile'; a.href = it.href;
        a.setAttribute('data-g', gKey);
        a.style.setProperty('--i', i);
        a.innerHTML =
          '<span class="ic">' + (ICON[it.icon] || ICON.link) + '</span>' +
          '<span class="lbl">' + it.label + '</span>' +
          '<span class="go">→</span>';
        grid.appendChild(a);
      });
      group.appendChild(grid);
      body.appendChild(group);
    });

    if (isSub) {
      // Sub-menú: volver al menú abajo (sin "Cerrar sesión")
      body.appendChild(makeBack(id));
    } else {
      const exit = document.createElement('a');
      exit.className = 'frmdp-exit'; exit.href = exitHref;
      exit.innerHTML = ICON.salir + ' Cerrar sesión';
      body.appendChild(exit);
    }

    sheet.appendChild(makeHead());
    sheet.appendChild(body);
    sheet.appendChild(makeBlock([
      ['Sistema','SYSACAD'],
      ['Módulo', isSub ? (document.title || 'Autogestión') : 'Autogestión'],
      ['Regional','FRMDP']
    ]));
    stage.appendChild(sheet);

    mount(stage, makeToggle());
  }

  // =========================================================
  // MATERIAS DEL PLAN
  // =========================================================
  function directRows(table) {
    return [...table.querySelectorAll(':scope > tbody > tr, :scope > tr')];
  }
  function directCells(tr, tag) {
    return [...tr.children].filter(c => c.tagName === tag);
  }

  function findMateriasTable() {
    const tables = [...document.querySelectorAll('table')];
    return tables.find(t => {
      const first = directRows(t)[0];
      if (!first) return false;
      const ths = directCells(first, 'TH').map(c => c.textContent.trim().toLowerCase());
      return ths.includes('materia') && ths.some(h => h.indexOf('cursa') !== -1);
    }) || null;
  }

  function getSessionId() {
    const m = window.location.search.match(/id=([^&]+)/);
    return m ? m[1] : '';
  }

  function makeBack(id, cls) {
    const a = document.createElement('a');
    a.className = 'frmdp-back' + (cls ? ' ' + cls : '');
    a.href = 'menuAlumno.asp' + (id ? '?id=' + id : '');
    a.innerHTML = '<span class="bk-arrow">←</span> Volver al menú';
    return a;
  }

  function buildMaterias(table) {
    document.body.classList.add('frmdp-loading');

    // Nombre del plan (tituloTabla)
    let planName = '';
    const titleCell = document.querySelector('td.tituloTabla, .tituloTabla');
    if (titleCell) planName = titleCell.textContent.trim();

    // Parsear filas (solo celdas directas, evita tablas anidadas)
    const rows = directRows(table).filter(tr => directCells(tr, 'TD').length > 0);
    const mats = rows.map(tr => {
      const td = directCells(tr, 'TD').map(c => c.textContent.trim());
      return { anio: td[0] || '?', dic: td[1] || '', name: td[2] || '', cursa: /si/i.test(td[3] || ''), rinde: /si/i.test(td[4] || '') };
    }).filter(m => m.name);

    // Métricas
    const total = mats.length;
    const years = [...new Set(mats.map(m => m.anio))];
    const seCursan = mats.filter(m => m.cursa).length;
    const seRinden = mats.filter(m => m.rinde).length;

    // Agrupar por año (preserva orden)
    const byYear = {};
    mats.forEach(m => { (byYear[m.anio] = byYear[m.anio] || []).push(m); });

    // ---- Render ----
    const stage = document.createElement('div'); stage.className = 'frmdp-stage';
    const sheet = makeSheet(true);
    const body = document.createElement('div'); body.className = 'frmdp-body';

    const id = getSessionId();
    body.appendChild(makeBack(id, 'top'));

    const title = document.createElement('h1');
    title.className = 'frmdp-title'; title.textContent = 'Materias del plan';
    body.appendChild(title);

    if (planName) {
      const sub = document.createElement('p');
      sub.className = 'frmdp-sub'; sub.textContent = planName;
      body.appendChild(sub);
    }

    // Métricas
    const metrics = document.createElement('div');
    metrics.className = 'frmdp-metrics';
    metrics.innerHTML =
      metric(total, 'Materias', 0) +
      metric(years.length, years.length === 1 ? 'Año' : 'Años', 1) +
      metric(seCursan, 'Se cursan', 2) +
      metric(seRinden, 'Se rinden', 3);
    body.appendChild(metrics);

    // Secciones por año
    years.forEach(yr => {
      const items = byYear[yr];
      const sec = document.createElement('div'); sec.className = 'frmdp-year';
      const hd = document.createElement('div'); hd.className = 'frmdp-year-hd';
      hd.innerHTML = '<span class="yr">Año ' + yr + '</span>' +
                     '<span class="cnt">' + items.length + ' materias</span>';
      sec.appendChild(hd);

      const grid = document.createElement('div'); grid.className = 'frmdp-mat-grid';
      items.forEach((m, i) => {
        const row = document.createElement('div'); row.className = 'frmdp-mat';
        row.style.setProperty('--i', i);
        const pills =
          (m.dic ? '<span class="frmdp-pill reg">' + m.dic + '</span>' : '') +
          '<span class="frmdp-pill ' + (m.cursa ? 'on' : 'off') + '">Cursa</span>' +
          '<span class="frmdp-pill ' + (m.rinde ? 'on' : 'off') + '">Rinde</span>';
        row.innerHTML = '<span class="frmdp-mat-name">' + m.name + '</span>' +
                        '<span class="frmdp-pills">' + pills + '</span>';
        grid.appendChild(row);
      });
      sec.appendChild(grid);
      body.appendChild(sec);
    });

    body.appendChild(makeBack(id));

    sheet.appendChild(makeHead());
    sheet.appendChild(body);
    sheet.appendChild(makeBlock([
      ['Materias', String(total)],
      ['Años', String(years.length)],
      ['Regional', 'FRMDP']
    ]));
    stage.appendChild(sheet);

    mount(stage, makeToggle());
  }

  function metric(n, k, i) {
    return '<div class="frmdp-metric" style="--i:' + (i || 0) + '">' +
           '<div class="frmdp-metric-n" data-count="' + n + '">' + n + '</div>' +
           '<div class="frmdp-metric-k">' + k + '</div></div>';
  }

  // =========================================================
  // ESTADO ACADÉMICO (dashboard)
  // =========================================================
  function findEstadoTable() {
    const tables = [...document.querySelectorAll('table')];
    return tables.find(t => {
      const first = directRows(t)[0];
      if (!first) return false;
      const ths = directCells(first, 'TH').map(c => c.textContent.trim().toLowerCase());
      return ths.includes('materia') && ths.includes('estado');
    }) || null;
  }

  function classify(raw) {
    const s = (raw || '').replace(/ /g, ' ').trim();
    if (/aprobada/i.test(s)) {
      const m = s.match(/aprobada\s+con\s+(\d+)/i);
      return { state: 'aprobada', label: 'Aprobada', grade: m ? parseInt(m[1], 10) : null };
    }
    if (/regular/i.test(s))  return { state: 'regular',  label: 'Regular', grade: null };
    if (/cursa/i.test(s))    return { state: 'cursando', label: 'Cursando', grade: null };
    return { state: 'pendiente', label: 'Pendiente', grade: null };
  }

  const ST_ORDER = ['aprobada', 'regular', 'cursando', 'pendiente'];
  const ST_NAME  = { aprobada: 'Aprobadas', regular: 'Regulares', cursando: 'Cursando', pendiente: 'Pendientes' };
  const ST_SEG   = { aprobada: 'seg-aprob', regular: 'seg-reg', cursando: 'seg-curs', pendiente: 'seg-pend' };

  function buildEstado(table) {
    document.body.classList.add('frmdp-loading');

    // Encabezado (nombre + fecha de corte)
    let student = '', fecha = '';
    const titleCell = document.querySelector('td.tituloTabla, .tituloTabla');
    if (titleCell) {
      const t = titleCell.textContent.trim();
      const m = t.match(/de\s+(.+?)\s+al\s+(.+)$/i);
      if (m) { student = m[1].trim(); fecha = m[2].trim(); }
      else student = t;
    }

    // Parsear filas
    const rows = directRows(table).filter(tr => directCells(tr, 'TD').length > 0);
    const mats = rows.map(tr => {
      const td = directCells(tr, 'TD').map(c => c.textContent.trim());
      const c = classify(td[2]);
      return { anio: td[0] || '?', name: td[1] || '', raw: td[2] || '', state: c.state, label: c.label, grade: c.grade };
    }).filter(m => m.name);

    const total = mats.length;
    const counts = { aprobada: 0, regular: 0, cursando: 0, pendiente: 0 };
    const grades = [];
    mats.forEach(m => {
      counts[m.state] = (counts[m.state] || 0) + 1;
      if (m.state === 'aprobada' && typeof m.grade === 'number') grades.push(m.grade);
    });
    const aprob = counts.aprobada;
    const pct = total ? Math.round((aprob / total) * 100) : 0;
    const prom = grades.length ? (grades.reduce((a, b) => a + b, 0) / grades.length) : null;

    // ---- Render ----
    const stage = document.createElement('div'); stage.className = 'frmdp-stage';
    const sheet = makeSheet(true);
    const body = document.createElement('div'); body.className = 'frmdp-body';

    const id = getSessionId();
    body.appendChild(makeBack(id, 'top'));

    const title = document.createElement('h1');
    title.className = 'frmdp-title'; title.textContent = 'Estado académico';
    body.appendChild(title);

    if (student) {
      const sub = document.createElement('p');
      sub.className = 'frmdp-sub';
      sub.textContent = student + (fecha ? ' · al ' + fecha : '');
      body.appendChild(sub);
    }

    // Hero: anillo de avance + promedio
    const hero = document.createElement('div'); hero.className = 'frmdp-hero';

    const R = 41, C = 2 * Math.PI * R;
    const off = C * (1 - pct / 100);
    const ringCard = document.createElement('div'); ringCard.className = 'frmdp-statcard';
    ringCard.style.setProperty('--i', 0);
    ringCard.innerHTML =
      '<div class="frmdp-ring-wrap">' +
        '<svg class="frmdp-ring" viewBox="0 0 92 92" style="--circ:' + C.toFixed(1) + ';--off:' + off.toFixed(1) + '">' +
          '<circle class="track" cx="46" cy="46" r="' + R + '"/>' +
          '<circle class="prog" cx="46" cy="46" r="' + R + '"/>' +
        '</svg>' +
        '<div class="frmdp-ring-txt"><span class="frmdp-ring-pct" data-count="' + pct + '" data-suf="%">0%</span>' +
        '<span class="frmdp-ring-sub">AVANCE</span></div>' +
      '</div>' +
      '<div class="frmdp-card-txt"><div class="k">Aprobadas</div>' +
      '<div class="v">' + aprob + ' / ' + total + '</div></div>';
    hero.appendChild(ringCard);

    const promCard = document.createElement('div'); promCard.className = 'frmdp-statcard';
    promCard.style.setProperty('--i', 1);
    promCard.innerHTML =
      '<div><div class="frmdp-big"' + (prom !== null ? ' data-count="' + prom.toFixed(2) + '" data-dec="2"' : '') + '>' +
      (prom !== null ? '0.00' : '—') + '</div>' +
      '<div class="frmdp-big-k">Promedio (' + grades.length + ' finales)</div></div>';
    hero.appendChild(promCard);
    body.appendChild(hero);

    // Estado de materias — tarjetas
    const stSec = document.createElement('div'); stSec.className = 'frmdp-dash';
    stSec.appendChild(dashLbl('Estado de materias'));
    const stgrid = document.createElement('div'); stgrid.className = 'frmdp-stgrid';
    ST_ORDER.forEach((st, i) => {
      const card = document.createElement('div');
      card.className = 'frmdp-stcard ' + st;
      card.style.setProperty('--i', i);
      card.innerHTML = '<div class="n" data-count="' + counts[st] + '">' + counts[st] + '</div>' +
                       '<div class="k">' + ST_NAME[st] + '</div>';
      stgrid.appendChild(card);
    });
    stSec.appendChild(stgrid);
    body.appendChild(stSec);

    // Nota sobre vencimiento (si hay regulares)
    if (counts.regular) {
      const note = document.createElement('div'); note.className = 'frmdp-note';
      note.innerHTML = 'Las materias <b>Regulares</b> vencen a los <b>2 años</b>. ' +
        'Pasado ese plazo podés pedir prórroga para rendir el final o volver a cursar. ' +
        'El vencimiento estimado figura junto a cada materia.';
      body.appendChild(note);
    }

    // Lista de materias por año con estado
    const byYear = {};
    mats.forEach(m => { (byYear[m.anio] = byYear[m.anio] || []).push(m); });
    Object.keys(byYear).forEach(yr => {
      const items = byYear[yr];
      const sec = document.createElement('div'); sec.className = 'frmdp-year';
      const hd = document.createElement('div'); hd.className = 'frmdp-year-hd';
      hd.innerHTML = '<span class="yr">Año ' + yr + '</span>' +
                     '<span class="cnt">' + items.length + ' materias</span>';
      sec.appendChild(hd);
      const grid = document.createElement('div'); grid.className = 'frmdp-mat-grid';
      items.forEach((m, i) => {
        const row = document.createElement('div'); row.className = 'frmdp-mat';
        row.style.setProperty('--i', i);
        const stTxt = m.label + (m.grade !== null ? ' · ' + m.grade : '');
        let pills = '<span class="frmdp-st ' + m.state + '">' + stTxt + '</span>';
        if (m.state === 'regular') {
          const v = vencInfo(m.raw);
          if (v) {
            const txt = v.cls === 'venc' ? 'Vencida ' + v.label : 'Vence ' + v.label;
            const warn = v.cls === 'prox' ? ' ⚠' : '';
            pills += '<span class="frmdp-venc ' + v.cls + '">' + txt + warn + '</span>';
          }
        }
        if (m.state === 'cursando') {
          const cur = parseCursa(m.raw);
          if (cur) {
            pills += '<span class="frmdp-com" title="Comisión y sede">' +
                     '<b>' + cur.com + '</b>' + (cur.sede ? ' · ' + cur.sede : '') + '</span>';
          }
        }
        row.innerHTML = '<span class="frmdp-mat-name">' + m.name + '</span>' +
                        '<span class="frmdp-pills">' + pills + '</span>';
        grid.appendChild(row);
      });
      sec.appendChild(grid);
      body.appendChild(sec);
    });

    body.appendChild(makeBack(id));

    sheet.appendChild(makeHead());
    sheet.appendChild(body);
    sheet.appendChild(makeBlock([
      ['Avance', pct + '%'],
      ['Promedio', prom !== null ? prom.toFixed(2) : '—'],
      ['Regional', 'FRMDP']
    ]));
    stage.appendChild(sheet);

    mount(stage, makeToggle());
  }

  function dashLbl(txt) {
    const d = document.createElement('div'); d.className = 'frmdp-dash-lbl';
    d.textContent = txt;
    return d;
  }

  // =========================================================
  // CURSADO Y NOTAS
  // =========================================================
  const DAYS = [
    { re: /^lun/i, ab: 'Lun', full: 'Lunes' },
    { re: /^mar/i, ab: 'Mar', full: 'Martes' },
    { re: /^mi[eé]r/i, ab: 'Mié', full: 'Miércoles' },
    { re: /^jue/i, ab: 'Jue', full: 'Jueves' },
    { re: /^vie/i, ab: 'Vie', full: 'Viernes' },
    { re: /^s[áa]b/i, ab: 'Sáb', full: 'Sábado' },
    { re: /^dom/i, ab: 'Dom', full: 'Domingo' }
  ];
  const toMin = t => { const p = t.split(':'); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); };
  const dayIdx = name => DAYS.findIndex(d => d.re.test(name));

  function parseHorarios(raw) {
    const out = [];
    (raw || '').split(',').forEach(part => {
      const m = part.trim().match(/([A-Za-zÁÉÍÓÚáéíóúü]+)\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
      if (!m) return;
      const di = dayIdx(m[1]);
      if (di === -1) return;
      out.push({ day: di, ini: m[2], fin: m[3], min: toMin(m[2]), dur: toMin(m[3]) - toMin(m[2]) });
    });
    return out;
  }

  // Color distinto por materia (ángulo áureo → bien distribuido para N materias)
  function hueFor(i) { return Math.round((i * 137.508) % 360); }

  // Descarga de archivo client-side
  function download(name, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 120);
  }

  const JS_DAY = [1, 2, 3, 4, 5, 6]; // DAYS idx → getDay() (Lun=1 … Sáb=6)
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmtDT(d) {
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) +
           'T' + pad(d.getHours()) + pad(d.getMinutes()) + '00';
  }
  function nextDate(dayIdx, hh, mm) {
    const target = JS_DAY[dayIdx];
    const d = new Date(); d.setHours(hh, mm, 0, 0);
    let diff = (target - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + diff);
    return d;
  }

  function exportICS(courses) {
    let ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//ModernSysacad//FRMDP//ES\r\nCALSCALE:GREGORIAN\r\n';
    let uid = 0;
    courses.forEach(c => {
      c.bloques.forEach(b => {
        const ini = b.ini.split(':'), fin = b.fin.split(':');
        const ds = nextDate(b.day, parseInt(ini[0], 10), parseInt(ini[1], 10));
        const de = nextDate(b.day, parseInt(fin[0], 10), parseInt(fin[1], 10));
        ics += 'BEGIN:VEVENT\r\n' +
          'UID:frmdp-' + (uid++) + '@modernsysacad\r\n' +
          'DTSTART:' + fmtDT(ds) + '\r\n' +
          'DTEND:' + fmtDT(de) + '\r\n' +
          'RRULE:FREQ=WEEKLY\r\n' +
          'SUMMARY:' + c.name + '\r\n' +
          'LOCATION:' + (c.aula || '') + '\r\n' +
          'DESCRIPTION:Comisión ' + (c.comision || '') + '\r\n' +
          'END:VEVENT\r\n';
      });
    });
    ics += 'END:VCALENDAR\r\n';
    download('cursada-frmdp.ics', ics, 'text/calendar;charset=utf-8');
  }

  function exportCSV(courses) {
    const rows = [['Materia', 'Día', 'Inicio', 'Fin', 'Comisión', 'Aula']];
    courses.forEach(c => c.bloques.forEach(b => {
      rows.push([c.name, DAYS[b.day].full, b.ini, b.fin, c.comision, c.aula]);
    }));
    const csv = '﻿' + rows.map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(';')).join('\r\n');
    download('cursada-frmdp.csv', csv, 'text/csv;charset=utf-8');
  }

  function findCursadoTable() {
    const tables = [...document.querySelectorAll('table')];
    return tables.find(t => {
      const first = directRows(t)[0];
      if (!first) return false;
      const ths = directCells(first, 'TH').map(c => c.textContent.trim().toLowerCase());
      return ths.includes('materia') && ths.includes('horarios');
    }) || null;
  }

  function buildCursado(table) {
    document.body.classList.add('frmdp-loading');

    let student = '', fecha = '';
    const titleCell = document.querySelector('td.tituloTabla, .tituloTabla');
    if (titleCell) {
      const t = titleCell.textContent.trim();
      const m = t.match(/de\s+(.+?)\s+al\s+(.+)$/i);
      if (m) { student = m[1].trim(); fecha = m[2].trim(); }
    }

    const rows = directRows(table).filter(tr => directCells(tr, 'TD').length > 0);
    const courses = rows.map((tr, i) => {
      const td = directCells(tr, 'TD');
      const txt = td.map(c => c.textContent.trim());
      const a = td[1] ? td[1].querySelector('a') : null;
      return {
        anio: txt[0] || '', name: (td[1] ? td[1].textContent.trim() : txt[1]) || '',
        href: a ? a.getAttribute('href') : '',
        comision: txt[2] || '', aula: txt[3] || '', horarios: txt[4] || '',
        notas: txt[5] || '', inas: txt[6] || '', obs: txt[7] || '',
        bloques: parseHorarios(txt[4] || ''), hue: hueFor(i)
      };
    }).filter(c => c.name);

    // Métricas
    const allBloques = courses.reduce((a, c) => a.concat(c.bloques), []);
    const horasSem = Math.round(allBloques.reduce((a, b) => a + b.dur, 0) / 60);
    const dias = new Set(allBloques.map(b => b.day)).size;

    // ---- Render ----
    const stage = document.createElement('div'); stage.className = 'frmdp-stage';
    const sheet = makeSheet(true); sheet.classList.add('frmdp-sheet--xwide');
    const body = document.createElement('div'); body.className = 'frmdp-body';

    const id = getSessionId();
    body.appendChild(makeBack(id, 'top'));

    const title = document.createElement('h1');
    title.className = 'frmdp-title'; title.textContent = 'Cursado y notas';
    body.appendChild(title);

    if (student) {
      const sub = document.createElement('p');
      sub.className = 'frmdp-sub';
      sub.textContent = student + (fecha ? ' · al ' + fecha : '');
      body.appendChild(sub);
    }

    const metrics = document.createElement('div');
    metrics.className = 'frmdp-metrics';
    metrics.style.gridTemplateColumns = 'repeat(3, 1fr)';
    metrics.innerHTML =
      metric(courses.length, courses.length === 1 ? 'Materia' : 'Materias', 0) +
      metric(horasSem, 'Horas/sem', 1) +
      metric(dias, dias === 1 ? 'Día' : 'Días', 2);
    body.appendChild(metrics);

    // Calendario semanal (time-grid, Lun a Sáb, todos los días)
    const weekSec = document.createElement('div'); weekSec.className = 'frmdp-dash';
    weekSec.appendChild(dashLbl('Tu semana'));

    const HH = 52; // px por hora
    let minMin = 8 * 60, maxMin = 14 * 60;
    if (allBloques.length) {
      minMin = Math.min(...allBloques.map(b => b.min));
      maxMin = Math.max(...allBloques.map(b => b.min + b.dur));
    }
    const minH = Math.floor(minMin / 60), maxH = Math.ceil(maxMin / 60);
    const gridH = (maxH - minH) * HH;

    const wrap = document.createElement('div'); wrap.className = 'frmdp-cal-wrap';
    const cal = document.createElement('div'); cal.className = 'frmdp-cal';

    // Encabezado de días (Lun..Sáb = idx 0..5)
    let head = '<div class="frmdp-cal-head"><div></div>';
    for (let d = 0; d < 6; d++) head += '<div class="frmdp-cal-dh">' + DAYS[d].full + '</div>';
    head += '</div>';

    // Cuerpo: columna de horas + 6 columnas de día
    const half = HH / 2;
    let timeCol = '<div class="frmdp-cal-time" style="height:' + gridH + 'px">';
    for (let h = minH; h <= maxH; h++) {
      timeCol += '<span style="top:' + ((h - minH) * HH) + 'px">' + h + ':00</span>';
      if (h < maxH) {
        timeCol += '<span class="half" style="top:' + ((h - minH) * HH + half) + 'px">' + h + ':30</span>';
      }
    }
    timeCol += '</div>';

    // Líneas de hora (sólidas) + medias horas (tenues)
    const lineGrad =
      'repeating-linear-gradient(to bottom, transparent 0, transparent ' + (HH - 1) + 'px, var(--line) ' + (HH - 1) + 'px, var(--line) ' + HH + 'px),' +
      'repeating-linear-gradient(to bottom, transparent 0, transparent ' + (half - 1) + 'px, color-mix(in srgb, var(--line) 45%, transparent) ' + (half - 1) + 'px, color-mix(in srgb, var(--line) 45%, transparent) ' + half + 'px, transparent ' + half + 'px, transparent ' + HH + 'px)';

    let cols = '';
    for (let d = 0; d < 6; d++) {
      let evs = '';
      courses.forEach(c => c.bloques.filter(b => b.day === d).forEach(b => {
        const top = (b.min - minH * 60) / 60 * HH;
        const h = Math.max(22, b.dur / 60 * HH - 2);
        evs += '<div class="frmdp-cal-ev" style="top:' + top + 'px;height:' + h + 'px;' +
          'background:hsla(' + c.hue + ',70%,50%,.18);border-left-color:hsl(' + c.hue + ',65%,55%)">' +
          '<div class="et" style="color:hsl(' + c.hue + ',65%,55%)">' + b.ini + '–' + b.fin + '</div>' +
          '<div class="en">' + c.name + '</div></div>';
      }));
      cols += '<div class="frmdp-cal-col" style="height:' + gridH + 'px;background:' + lineGrad + '">' + evs + '</div>';
    }

    cal.innerHTML = head + '<div class="frmdp-cal-body">' + timeCol + cols + '</div>';
    wrap.appendChild(cal);
    weekSec.appendChild(wrap);
    body.appendChild(weekSec);

    /* === EXPORTAR (deshabilitado por ahora — revisar más adelante) ===
    if (allBloques.length) {
      const expSec = document.createElement('div'); expSec.className = 'frmdp-dash';
      expSec.appendChild(dashLbl('Exportar horario'));
      const exports = document.createElement('div'); exports.className = 'frmdp-exports';

      const icsBtn = document.createElement('button');
      icsBtn.type = 'button'; icsBtn.className = 'frmdp-exp-btn';
      icsBtn.innerHTML = svg('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>') +
                         ' Calendario (.ics)';
      icsBtn.title = 'Importar a Google Calendar, iOS o Outlook';
      icsBtn.addEventListener('click', () => exportICS(courses));

      const csvBtn = document.createElement('button');
      csvBtn.type = 'button'; csvBtn.className = 'frmdp-exp-btn';
      csvBtn.innerHTML = svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>') +
                         ' Excel (.csv)';
      csvBtn.addEventListener('click', () => exportCSV(courses));

      exports.appendChild(icsBtn);
      exports.appendChild(csvBtn);
      expSec.appendChild(exports);
      body.appendChild(expSec);
    }
    === fin EXPORTAR === */

    // Tarjetas de materia
    const listSec = document.createElement('div'); listSec.className = 'frmdp-dash';
    listSec.appendChild(dashLbl('Materias en curso'));
    courses.forEach(c => {
      const card = document.createElement('a');
      card.className = 'frmdp-course';
      card.style.borderLeftColor = 'hsl(' + c.hue + ',65%,55%)';
      if (c.href) card.href = c.href;

      const comM = c.comision.match(/\(([^)]+)\)/);
      const comLabel = comM ? comM[1] : c.comision;

      const am = c.aula.match(/^(\S+)\s+(.*)$/);
      const sede = am ? am[2] : c.aula;
      const aulaN = am ? am[1] : '';
      const metaTxt = sede + (aulaN && aulaN !== '0' ? ' · Aula ' + aulaN : '');

      let chips = '';
      c.bloques.forEach(b => {
        chips += '<span class="frmdp-hchip"><b>' + DAYS[b.day].ab + '</b> ' + b.ini + '–' + b.fin + '</span>';
      });

      const notasTxt = c.notas ? c.notas : 'Sin notas cargadas';
      const inasTxt = (c.inas && c.inas !== '-.-') ? c.inas : '0';

      card.innerHTML =
        '<div class="frmdp-course-top">' +
          '<span class="frmdp-course-name">' + c.name + '</span>' +
          (comLabel ? '<span class="frmdp-cbadge" style="color:hsl(' + c.hue + ',65%,55%);border-color:hsl(' + c.hue + ',65%,55%)">' + comLabel + '</span>' : '') +
          '<span class="arr">→</span>' +
        '</div>' +
        (metaTxt ? '<div class="frmdp-course-meta">' + metaTxt + '</div>' : '') +
        (chips ? '<div class="frmdp-hchips">' + chips + '</div>' : '') +
        '<div class="frmdp-course-foot">' +
          '<span>Notas: <b>' + notasTxt + '</b></span>' +
          '<span>Inasistencias: <b>' + inasTxt + '</b></span>' +
          (c.obs ? '<span>Obs: <b>' + c.obs + '</b></span>' : '') +
        '</div>';
      listSec.appendChild(card);
    });
    body.appendChild(listSec);

    body.appendChild(makeBack(id));

    sheet.appendChild(makeHead());
    sheet.appendChild(body);
    sheet.appendChild(makeBlock([
      ['Materias', String(courses.length)],
      ['Horas/sem', String(horasSem)],
      ['Regional', 'FRMDP']
    ]));
    stage.appendChild(sheet);

    mount(stage, makeToggle());
  }

  // =========================================================
  // VISOR DE PDF (certificados)
  // =========================================================
  function findPdf() {
    const obj = document.querySelector('object[type="application/pdf"], embed[type="application/pdf"]');
    let url = obj ? (obj.getAttribute('data') || obj.getAttribute('src')) : null;
    if (!url) {
      const a = [...document.querySelectorAll('a')].find(x => /\.pdf(\?|$)/i.test(x.getAttribute('href') || ''));
      url = a ? a.getAttribute('href') : null;
    }
    return url || null;
  }

  function buildPdf(url) {
    document.body.classList.add('frmdp-loading');

    // Normalizar doble barra del path (…ar//archivos → …ar/archivos)
    const pdfUrl = url.replace(/(https?:\/\/[^/]+)\/\/+/i, '$1/');

    let titulo = document.title || 'Certificado';
    const titleCell = document.querySelector('th.tituloTabla, td.tituloTabla, .tituloTabla');
    if (titleCell && titleCell.textContent.trim()) titulo = titleCell.textContent.trim();

    // Link de volver (a certificados o al menú)
    const backA = [...document.querySelectorAll('a')].find(a => /menucertificados|menualumno/i.test(a.getAttribute('href') || ''));
    const backHref = backA ? backA.getAttribute('href') : ('menuAlumno.asp' + (getSessionId() ? '?id=' + getSessionId() : ''));
    const backTxt = backA && /certificados/i.test(backA.getAttribute('href')) ? 'Volver a certificados' : 'Volver al menú';

    const stage = document.createElement('div'); stage.className = 'frmdp-stage';
    const sheet = makeSheet(true); sheet.classList.add('frmdp-sheet--xwide');
    const body = document.createElement('div'); body.className = 'frmdp-body';

    const back = document.createElement('a');
    back.className = 'frmdp-back top'; back.href = backHref;
    back.innerHTML = '<span class="bk-arrow">←</span> ' + backTxt;
    body.appendChild(back);

    const title = document.createElement('h1');
    title.className = 'frmdp-title'; title.textContent = titulo;
    body.appendChild(title);

    // Barra de acciones
    const bar = document.createElement('div'); bar.className = 'frmdp-pdf-bar';
    const noAcc = titulo.normalize('NFD').replace(new RegExp('[\\u0300-\\u036f]', 'g'), '');
    const fname = (noAcc.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '') || 'Certificado') + '.pdf';
    const dl = document.createElement('a');
    dl.className = 'frmdp-insc-btn'; dl.href = pdfUrl; dl.setAttribute('download', fname);
    dl.innerHTML = svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>') + ' Descargar PDF';
    const open = document.createElement('a');
    open.className = 'frmdp-cert'; open.href = pdfUrl; open.target = '_blank'; open.rel = 'noopener';
    open.innerHTML = svg('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14L21 3"/>') + ' Abrir en pestaña';
    bar.appendChild(dl); bar.appendChild(open);
    body.appendChild(bar);

    // Loader: el PDF se genera on-demand en el servidor → esperar a que exista
    const loader = document.createElement('div'); loader.className = 'frmdp-pdf-loader';
    loader.innerHTML =
      '<div class="frmdp-spinner"></div>' +
      '<div class="ld-t">Generando tu certificado…</div>' +
      '<div class="ld-s">El sistema lo está preparando. Aguardá unos segundos.</div>';
    body.appendChild(loader);

    const fb = document.createElement('div'); fb.className = 'frmdp-pdf-fallback';
    fb.innerHTML = 'Si tarda mucho, usá <b>Descargar PDF</b> o <b>Abrir en pestaña</b>.';
    body.appendChild(fb);

    body.appendChild(makeBack(getSessionId()));

    sheet.appendChild(makeHead());
    sheet.appendChild(body);
    sheet.appendChild(makeBlock([
      ['Sistema', 'SYSACAD'],
      ['Módulo', 'Certificado'],
      ['Regional', 'FRMDP']
    ]));
    stage.appendChild(sheet);

    mount(stage, makeToggle());

    pollPdf(pdfUrl, loader);
  }

  // Espera a que el PDF exista (se genera on-demand) y lo muestra como blob
  function pollPdf(url, loader) {
    let tries = 0;
    const max = 45; // ~90s máx (45 × 2s)
    const sub = loader.querySelector('.ld-s');

    function show(blobUrl) {
      const frame = document.createElement('iframe');
      frame.className = 'frmdp-pdf-frame';
      frame.src = blobUrl;
      frame.title = 'Certificado';
      loader.replaceWith(frame);
    }

    function fail() {
      loader.classList.add('err');
      loader.innerHTML =
        '<div class="ld-t">No se pudo cargar el certificado</div>' +
        '<div class="ld-s">Probá con <b>Descargar PDF</b> o <b>Abrir en pestaña</b>, o reintentá en un minuto.</div>';
    }

    function attempt() {
      tries++;
      fetch(url, { method: 'GET', cache: 'no-store', credentials: 'include' })
        .then(r => {
          if (r.ok) return r.blob();
          return Promise.reject(r.status);
        })
        .then(blob => show(URL.createObjectURL(blob)))
        .catch(() => {
          if (tries < max) {
            if (sub) sub.textContent = 'Preparando el documento… (' + tries + ')';
            setTimeout(attempt, 2000);
          } else { fail(); }
        });
    }
    attempt();
  }

  // =========================================================
  // INSCRIPCIÓN A EXÁMENES
  // =========================================================
  function findInscripcionTable() {
    const tables = [...document.querySelectorAll('table')];
    return tables.find(t => {
      const first = directRows(t)[0];
      if (!first) return false;
      const ths = directCells(first, 'TH').map(c => c.textContent.trim().toLowerCase());
      return ths.includes('materia') && ths.some(h => h.indexOf('inscrip') !== -1);
    }) || null;
  }

  function buildInscripcion(table) {
    document.body.classList.add('frmdp-loading');

    let student = '';
    const titleCell = document.querySelector('td.tituloTabla, .tituloTabla');
    if (titleCell) {
      const m = titleCell.textContent.trim().match(/examen\s+(.+)$/i);
      if (m) student = m[1].trim();
    }

    // Link a certificado de exámenes (antes de limpiar el DOM)
    const certA = [...document.querySelectorAll('a')].find(a => /certificadoexamen/i.test(a.getAttribute('href') || ''));
    const certHref = certA ? certA.getAttribute('href') : '';

    const rows = directRows(table).filter(tr => directCells(tr, 'TD').length > 0);
    const mats = rows.map(tr => {
      const td = directCells(tr, 'TD');
      const a = td[2] ? td[2].querySelector('a') : null;
      return {
        anio: td[0] ? td[0].textContent.trim() : '',
        name: td[1] ? td[1].textContent.trim() : '',
        href: a ? a.getAttribute('href') : '',
        cod: td[4] ? td[4].textContent.trim() : ''
      };
    }).filter(m => m.name);

    const stage = document.createElement('div'); stage.className = 'frmdp-stage';
    const sheet = makeSheet(true);
    const body = document.createElement('div'); body.className = 'frmdp-body';

    const id = getSessionId();
    body.appendChild(makeBack(id, 'top'));

    const title = document.createElement('h1');
    title.className = 'frmdp-title'; title.textContent = 'Inscripción a exámenes';
    body.appendChild(title);

    const sub = document.createElement('p');
    sub.className = 'frmdp-sub';
    sub.textContent = (student ? student + ' · ' : '') + 'Elegí una materia para ver las mesas disponibles';
    body.appendChild(sub);

    const metrics = document.createElement('div');
    metrics.className = 'frmdp-metrics';
    metrics.style.gridTemplateColumns = '1fr';
    metrics.innerHTML = metric(mats.length, 'Materias disponibles para rendir', 0);
    body.appendChild(metrics);

    // Certificado de exámenes
    if (certHref) {
      const cert = document.createElement('a');
      cert.className = 'frmdp-cert'; cert.href = certHref;
      cert.innerHTML = svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>') +
                       ' Certificado de exámenes';
      body.appendChild(cert);
    }

    // Materias por año
    const byYear = {};
    mats.forEach(m => { (byYear[m.anio] = byYear[m.anio] || []).push(m); });
    Object.keys(byYear).forEach(yr => {
      const items = byYear[yr];
      const sec = document.createElement('div'); sec.className = 'frmdp-year';
      const hd = document.createElement('div'); hd.className = 'frmdp-year-hd';
      hd.innerHTML = '<span class="yr">Año ' + yr + '</span>' +
                     '<span class="cnt">' + items.length + ' materias</span>';
      sec.appendChild(hd);
      const grid = document.createElement('div'); grid.className = 'frmdp-insc-grid';
      items.forEach(m => {
        const card = document.createElement('div'); card.className = 'frmdp-insc';
        card.innerHTML =
          '<div class="frmdp-insc-info"><div class="frmdp-insc-name">' + m.name + '</div>' +
          (m.cod ? '<div class="frmdp-insc-cod">Cód. ' + m.cod + '</div>' : '') + '</div>' +
          '<a class="frmdp-insc-btn" href="' + m.href + '">Inscribir <span class="a">→</span></a>';
        grid.appendChild(card);
      });
      sec.appendChild(grid);
      body.appendChild(sec);
    });

    body.appendChild(makeBack(id));

    sheet.appendChild(makeHead());
    sheet.appendChild(body);
    sheet.appendChild(makeBlock([
      ['Sistema', 'SYSACAD'],
      ['Módulo', 'Inscripción'],
      ['Regional', 'FRMDP']
    ]));
    stage.appendChild(sheet);

    mount(stage, makeToggle());
  }

  // =========================================================
  // CORRELATIVIDADES (cursar / rendir)
  // =========================================================
  function findCorrelativaTable() {
    const tables = [...document.querySelectorAll('table')];
    return tables.find(t => {
      const first = directRows(t)[0];
      if (!first) return false;
      const ths = directCells(first, 'TH').map(c => c.textContent.trim().toLowerCase());
      return ths.includes('materia') && ths.includes('correlatividad');
    }) || null;
  }

  function cellLines(cell) {
    return cell.innerHTML.split(/<br\s*\/?>/i).map(p => {
      const d = document.createElement('div'); d.innerHTML = p;
      return d.textContent.trim();
    }).filter(Boolean);
  }

  function parseReq(line) {
    const s = line.replace(/\s*\(ord[^)]*\)\s*/i, '').trim();
    if (!s) return null;
    let m;
    if (/no regulariz/i.test(s)) { m = s.match(/regulariz[oó]\s+(.+)/i); return { tag: 'Regularizar', mat: m ? m[1].trim() : s }; }
    if (/inscripto a/i.test(s))  { m = s.match(/inscripto a\s+(.+)/i); return { tag: 'Aprobar / inscribirse', mat: m ? m[1].trim() : s }; }
    if (/no aprob/i.test(s))     { m = s.match(/aprob[oó]\s+(.+)/i); return { tag: 'Aprobar', mat: m ? m[1].trim() : s }; }
    return { tag: 'Requisito', mat: s };
  }

  function buildCorrelativas(table) {
    document.body.classList.add('frmdp-loading');

    // Verbo (cursar/rendir) desde el título
    let verbo = 'cursar', student = '';
    const titleCell = document.querySelector('td.tituloTabla, .tituloTabla');
    if (titleCell) {
      const t = titleCell.textContent.trim();
      if (/rendir/i.test(t)) verbo = 'rendir';
      const m = t.match(/de\s+(.+?)\s+al\s+/i);
      if (m) student = m[1].trim();
    }

    const rows = directRows(table).filter(tr => directCells(tr, 'TD').length > 0);
    const mats = rows.map(tr => {
      const td = directCells(tr, 'TD');
      const corrTxt = td[2] ? td[2].textContent.trim() : '';
      const habil = /puede\s+(cursar|rendir|inscribirse)/i.test(corrTxt);
      const reqs = habil ? [] : cellLines(td[2]).map(parseReq).filter(Boolean);
      return { anio: td[0] ? td[0].textContent.trim() : '', name: td[1] ? td[1].textContent.trim() : '', habil: habil, reqs: reqs };
    }).filter(m => m.name);

    const ok = mats.filter(m => m.habil);
    const blocked = mats.filter(m => !m.habil);

    // ---- Render ----
    const stage = document.createElement('div'); stage.className = 'frmdp-stage';
    const sheet = makeSheet(true);
    const body = document.createElement('div'); body.className = 'frmdp-body';

    const id = getSessionId();
    body.appendChild(makeBack(id, 'top'));

    const title = document.createElement('h1');
    title.className = 'frmdp-title';
    title.textContent = 'Correlativas para ' + verbo;
    body.appendChild(title);

    if (student) {
      const sub = document.createElement('p');
      sub.className = 'frmdp-sub'; sub.textContent = student;
      body.appendChild(sub);
    }

    // Métricas arriba (visibles)
    const metrics = document.createElement('div');
    metrics.className = 'frmdp-metrics';
    metrics.style.gridTemplateColumns = 'repeat(3, 1fr)';
    metrics.innerHTML =
      metric(ok.length, 'Habilitadas', 0) +
      metric(blocked.length, 'Bloqueadas', 1) +
      metric(mats.length, 'Total', 2);
    body.appendChild(metrics);

    // Podés cursar/rendir
    if (ok.length) {
      const okSec = document.createElement('div'); okSec.className = 'frmdp-dash';
      okSec.appendChild(dashLbl('Podés ' + verbo + ' ahora'));
      const grid = document.createElement('div'); grid.className = 'frmdp-ok-grid';
      const check = svg('<path d="M20 6L9 17l-5-5"/>');
      ok.forEach(m => {
        const c = document.createElement('div'); c.className = 'frmdp-cok';
        c.innerHTML = '<span class="ic">' + check + '</span><span class="nm">' + m.name + '</span>';
        grid.appendChild(c);
      });
      okSec.appendChild(grid);
      body.appendChild(okSec);
    }

    // Bloqueadas
    if (blocked.length) {
      const bSec = document.createElement('div'); bSec.className = 'frmdp-dash';
      bSec.appendChild(dashLbl('Te faltan correlativas'));
      const lock = svg('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>');
      blocked.forEach(m => {
        const card = document.createElement('div'); card.className = 'frmdp-cblock';
        let reqsHtml = '';
        m.reqs.forEach(r => {
          reqsHtml += '<div class="frmdp-req"><span class="rtag">' + r.tag + '</span>' +
                      '<b>' + r.mat + '</b></div>';
        });
        card.innerHTML =
          '<div class="frmdp-cblock-hd"><span class="ic">' + lock + '</span>' +
          '<span class="frmdp-cblock-name">' + m.name + '</span>' +
          '<span class="frmdp-cblock-tag">' + m.reqs.length + (m.reqs.length === 1 ? ' requisito' : ' requisitos') + '</span></div>' +
          '<div class="frmdp-reqs">' + reqsHtml + '</div>';
        bSec.appendChild(card);
      });
      body.appendChild(bSec);
    }

    body.appendChild(makeBack(id));

    sheet.appendChild(makeHead());
    sheet.appendChild(body);
    sheet.appendChild(makeBlock([
      ['Sistema', 'SYSACAD'],
      ['Módulo', 'Correlativas'],
      ['Regional', 'FRMDP']
    ]));
    stage.appendChild(sheet);

    mount(stage, makeToggle());
  }

  // =========================================================
  // EXÁMENES
  // =========================================================
  const NUM_WORD = {
    cero: 0, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5,
    seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10
  };

  function parseNota(raw) {
    const s = (raw || '').trim().toLowerCase();
    if (!s || s === '-.-') return { tipo: 'sin', label: '—', num: null };
    if (/ausen/.test(s)) return { tipo: 'aus', label: 'Ausente', num: null };
    if (s in NUM_WORD) {
      const n = NUM_WORD[s];
      return { tipo: n >= 6 ? 'ap' : 'des', label: String(n), num: n };
    }
    const d = s.match(/\d+/);
    if (d) { const n = parseInt(d[0], 10); return { tipo: n >= 6 ? 'ap' : 'des', label: String(n), num: n }; }
    if (/aprob/.test(s)) return { tipo: 'ap', label: 'Aprobado', num: null };
    return { tipo: 'des', label: raw, num: null };
  }

  function findExamenesTable() {
    const tables = [...document.querySelectorAll('table')];
    return tables.find(t => {
      const first = directRows(t)[0];
      if (!first) return false;
      const ths = directCells(first, 'TH').map(c => c.textContent.trim().toLowerCase());
      return ths.includes('fecha') && ths.includes('nota');
    }) || null;
  }

  function buildExamenes(table) {
    document.body.classList.add('frmdp-loading');

    let student = '', fecha = '';
    const titleCell = document.querySelector('td.tituloTabla, .tituloTabla');
    if (titleCell) {
      const m = titleCell.textContent.trim().match(/de\s+(.+?)\s+al\s+(.+)$/i);
      if (m) { student = m[1].trim(); fecha = m[2].trim(); }
    }

    const rows = directRows(table).filter(tr => directCells(tr, 'TD').length > 0);
    const exams = rows.map(tr => {
      const td = directCells(tr, 'TD').map(c => c.textContent.trim());
      const dm = (td[0] || '').match(/(\d{2})\/(\d{2})\/(\d{4})/);
      const key = dm ? (dm[3] + dm[2] + dm[1]) : '0';
      return { fecha: td[0] || '', anio: dm ? dm[3] : '?', key: key, name: td[1] || '', nota: parseNota(td[2]) };
    }).filter(e => e.name);

    // Orden cronológico descendente
    exams.sort((a, b) => b.key.localeCompare(a.key));

    const aprob = exams.filter(e => e.nota.tipo === 'ap').length;
    const aus = exams.filter(e => e.nota.tipo === 'aus').length;
    const nums = exams.filter(e => e.nota.num !== null).map(e => e.nota.num);
    const prom = nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length) : null;

    const stage = document.createElement('div'); stage.className = 'frmdp-stage';
    const sheet = makeSheet(true);
    const body = document.createElement('div'); body.className = 'frmdp-body';

    const id = getSessionId();
    body.appendChild(makeBack(id, 'top'));

    const title = document.createElement('h1');
    title.className = 'frmdp-title'; title.textContent = 'Exámenes';
    body.appendChild(title);

    if (student) {
      const sub = document.createElement('p');
      sub.className = 'frmdp-sub';
      sub.textContent = student + (fecha ? ' · al ' + fecha : '');
      body.appendChild(sub);
    }

    const metrics = document.createElement('div');
    metrics.className = 'frmdp-metrics';
    metrics.innerHTML =
      metric(exams.length, 'Rendidos', 0) +
      metric(aprob, 'Aprobados', 1) +
      metric(aus, 'Ausentes', 2) +
      '<div class="frmdp-metric" style="--i:3"><div class="frmdp-metric-n"' +
        (prom !== null ? ' data-count="' + prom.toFixed(2) + '" data-dec="2"' : '') + '>' +
        (prom !== null ? '0.00' : '—') + '</div><div class="frmdp-metric-k">Promedio</div></div>';
    body.appendChild(metrics);

    // Lista cronológica por año
    const byYear = {};
    exams.forEach(e => { (byYear[e.anio] = byYear[e.anio] || []).push(e); });
    Object.keys(byYear).sort((a, b) => b.localeCompare(a)).forEach(yr => {
      const items = byYear[yr];
      const sec = document.createElement('div'); sec.className = 'frmdp-year';
      const hd = document.createElement('div'); hd.className = 'frmdp-year-hd';
      hd.innerHTML = '<span class="yr">' + yr + '</span>' +
                     '<span class="cnt">' + items.length + (items.length === 1 ? ' examen' : ' exámenes') + '</span>';
      sec.appendChild(hd);
      items.forEach(e => {
        const row = document.createElement('div'); row.className = 'frmdp-exam';
        row.innerHTML =
          '<span class="frmdp-exam-date">' + e.fecha + '</span>' +
          '<span class="frmdp-exam-name">' + e.name + '</span>' +
          '<span class="frmdp-nota ' + e.nota.tipo + '">' + e.nota.label + '</span>';
        sec.appendChild(row);
      });
      body.appendChild(sec);
    });

    body.appendChild(makeBack(id));

    sheet.appendChild(makeHead());
    sheet.appendChild(body);
    sheet.appendChild(makeBlock([
      ['Rendidos', String(exams.length)],
      ['Aprobados', String(aprob)],
      ['Promedio', prom !== null ? prom.toFixed(2) : '—']
    ]));
    stage.appendChild(sheet);

    mount(stage, makeToggle());
  }

  // =========================================================
  // ROUTER
  // =========================================================
  function init() {
    const loginForm = document.querySelector('form[name="login"]');
    if (loginForm) { buildLogin(loginForm); return; }

    const pdfUrl = findPdf();
    if (pdfUrl) { buildPdf(pdfUrl); return; }

    const inscTable = findInscripcionTable();
    if (inscTable) { buildInscripcion(inscTable); return; }

    const corrTable = findCorrelativaTable();
    if (corrTable) { buildCorrelativas(corrTable); return; }

    const examTable = findExamenesTable();
    if (examTable) { buildExamenes(examTable); return; }

    const estTable = findEstadoTable();
    if (estTable) { buildEstado(estTable); return; }

    const curTable = findCursadoTable();
    if (curTable) { buildCursado(curTable); return; }

    const matTable = findMateriasTable();
    if (matTable) { buildMaterias(matTable); return; }

    const menuList = document.querySelector('ul.textoTabla');
    if (menuList && menuList.querySelector('a')) { buildMenu(menuList); return; }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
