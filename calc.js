
/* ── Data ── */
const streams = {
  ls: {
    divisor: 26.5,
    maxTotal: 530,
    subjects: [
      { name:'Ektisad',   icon:'💰', max:80 },
      { name:'Ejtime3',   icon:'🌍', max:80 },
      { name:'Math',      icon:'➗', max:70 },
      { name:'Arabic',    icon:'📜', max:60 },
      { name:'فلسفه',    icon:'🧠', max:50 },
      { name:'English',   icon:'🇬🇧', max:40 },
      { name:'تاريخ',    icon:'🏛️', max:30 },
      { name:'جغرافيا', icon:'🗺️', max:30 },
      { name:'تربيه',   icon:'✏️', max:30 },
      { name:'Biology',   icon:'🌿', max:20 },
      { name:'Chemistry', icon:'⚗️', max:20 },
      { name:'Physics',   icon:'⚛️', max:20 },
    ]
  },
  gs: {
    divisor: 28.5,
    maxTotal: 570,
    subjects: [
      { name:'Math',      icon:'➗', max:160 },
      { name:'Physics',   icon:'⚛️', max:110 },
      { name:'Chemistry', icon:'⚗️', max:80 },
      { name:'Arabic',    icon:'📜', max:50 },
      { name:'English',   icon:'🇬🇧', max:40 },
      { name:'فلسفه',     icon:'🧠', max:40 },
      { name:'تاريخ',     icon:'🏛️', max:30 },
      { name:'جغرافيا',   icon:'🗺️', max:30 },
      { name:'تربيه',     icon:'✏️', max:30 },
    ]
  },
  se: {
    divisor: 28,
    maxTotal: 560,
    subjects: [
      { name:'Biology',   icon:'🌿', max:100 },
      { name:'Math',      icon:'➗', max:80 },
      { name:'Physics',   icon:'⚛️', max:80 },
      { name:'Chemistry', icon:'⚗️', max:80 },
      { name:'Arabic',    icon:'📜', max:50 },
      { name:'English',   icon:'🇬🇧', max:40 },
      { name:'فلسفه',     icon:'🧠', max:40 },
      { name:'تاريخ',     icon:'🏛️', max:30 },
      { name:'جغرافيا',   icon:'🗺️', max:30 },
      { name:'تربيه',     icon:'✏️', max:30 },
    ]
  }
};

/* ── Build inputs ── */
function buildInputs() {
  for (const [id, stream] of Object.entries(streams)) {
    const container = document.getElementById('inputs-' + id);
    container.innerHTML = '';
    stream.subjects.forEach((sub, i) => {
      container.innerHTML += `
        <div class="subject-row">
          <span class="subject-icon">${sub.icon}</span>
          <span class="subject-label">${sub.name}</span>
          <span class="subject-max">/${sub.max}</span>
          <input class="subject-input" type="number" min="0" max="${sub.max}"
                 placeholder="—" id="inp-${id}-${i}" />
        </div>`;
    });
  }
}

/* ── Toggle ── */
function toggleCard(id) {
  const card = document.getElementById('card-' + id);
  card.classList.toggle('open');
}

/* ── Calculate ── */
function calculate(id) {
  const stream = streams[id];
  let total = 0;
  let filled = 0;
  const breakdown = [];

  stream.subjects.forEach((sub, i) => {
    const inp = document.getElementById(`inp-${id}-${i}`);
    const val = parseFloat(inp.value);
    if (!isNaN(val) && val >= 0) {
      const clamped = Math.min(val, sub.max);
      total += clamped;
      filled++;
      breakdown.push({ name: sub.name, score: clamped, max: sub.max });
    } else {
      breakdown.push({ name: sub.name, score: '—', max: sub.max });
    }
  });

  const avg = (total / stream.divisor).toFixed(2);
  const pct = Math.min((total / stream.maxTotal) * 100, 100).toFixed(1);

  const rc = document.getElementById('result-' + id);
  rc.classList.add('show');
  rc.innerHTML = `
    <div class="result-title">📊 Your Results</div>
    <div class="result-grid">
      <div class="result-item">
        <div class="result-label">TOTAL SCORE</div>
        <div class="result-value">${total} <span style="font-size:.9rem;opacity:.7">/ ${stream.maxTotal}</span></div>
      </div>
      <div class="result-item">
        <div class="result-label">AVERAGE (/20)</div>
        <div class="result-value">${avg}</div>
        <div class="result-avg">${total} ÷ ${stream.divisor}</div>
      </div>
    </div>
    <div style="font-size:.8rem;opacity:.8;font-weight:700">Completion: ${pct}%</div>
    <div class="grade-bar-wrap">
      <div class="grade-bar-fill" id="bar-${id}" style="width:0%"></div>
    </div>
    <div class="result-breakdown">
      <div class="breakdown-title">SUBJECT BREAKDOWN</div>
      ${breakdown.map(b=>`
        <div class="breakdown-row">
          <span>${b.name}</span>
          <span class="breakdown-score">${b.score} / ${b.max}</span>
        </div>`).join('')}
    </div>`;

  setTimeout(() => {
    document.getElementById('bar-' + id).style.width = pct + '%';
  }, 100);

  rc.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

/* ── Theme ── */
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t === 'default' ? '' : t);
  localStorage.setItem('sd-theme', t);
}
const saved = localStorage.getItem('sd-theme');
if (saved) setTheme(saved);

document.getElementById('themeBtn').addEventListener('click', e => {
  e.stopPropagation();
  document.getElementById('themeDd').classList.toggle('open');
});
document.querySelectorAll('.theme-opt').forEach(o =>
  o.addEventListener('click', () => { setTheme(o.dataset.theme); document.getElementById('themeDd').classList.remove('open'); })
);
document.querySelectorAll('.mob-theme').forEach(o =>
  o.addEventListener('click', () => setTheme(o.dataset.theme))
);
document.addEventListener('click', () => document.getElementById('themeDd').classList.remove('open'));

/* ── Hamburger ── */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobileMenu').classList.toggle('open');
});

/* ── Preloader ── */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader').classList.add('hide'), 1800);
});

/* ── Init ── */
buildInputs();

/* ── Build inputs ── */
function buildInputs() {
  for (const [id, stream] of Object.entries(streams)) {
    const container = document.getElementById('inputs-' + id);
    container.innerHTML = '';
    stream.subjects.forEach((sub, i) => {
      const inpId = `inp-${id}-${i}`;
      const savedVal = localStorage.getItem(inpId) || '';
      container.innerHTML += `
        <div class="subject-row">
          <span class="subject-icon">${sub.icon}</span>
          <span class="subject-label">${sub.name}</span>
          <span class="subject-max">/${sub.max}</span>
          <input class="subject-input" type="number" min="0" max="${sub.max}"
                 placeholder="—" id="${inpId}" value="${savedVal}" />
        </div>`;
      
      // Save input changes
      const inpEl = container.querySelector(`#${inpId}`);
      inpEl.addEventListener('input', () => {
        localStorage.setItem(inpId, inpEl.value);
      });
    });
  }
}

/* ── Calculate ── */
function calculate(id) {
  const stream = streams[id];
  let total = 0;
  const breakdown = [];

  stream.subjects.forEach((sub, i) => {
    const inp = document.getElementById(`inp-${id}-${i}`);
    const val = parseFloat(inp.value);
    if (!isNaN(val) && val >= 0) {
      const clamped = Math.min(val, sub.max);
      total += clamped;
      breakdown.push({ name: sub.name, score: clamped, max: sub.max });
    } else {
      breakdown.push({ name: sub.name, score: '—', max: sub.max });
    }
  });

  const avg = (total / stream.divisor).toFixed(2);
  const pct = Math.min((total / stream.maxTotal) * 100, 100).toFixed(1);

  const rc = document.getElementById('result-' + id);
  rc.classList.add('show');
  rc.innerHTML = `
    <div class="result-title">📊 Your Results</div>
    <div class="result-grid">
      <div class="result-item">
        <div class="result-label">TOTAL SCORE</div>
        <div class="result-value">${total} <span style="font-size:.9rem;opacity:.7">/ ${stream.maxTotal}</span></div>
      </div>
      <div class="result-item">
        <div class="result-label">AVERAGE (/20)</div>
        <div class="result-value">${avg}</div>
        <div class="result-avg">${total} ÷ ${stream.divisor}</div>
      </div>
    </div>
    <div style="font-size:.8rem;opacity:.8;font-weight:700">Completion: ${pct}%</div>
    <div class="grade-bar-wrap">
      <div class="grade-bar-fill" id="bar-${id}" style="width:0%"></div>
    </div>
    <div class="result-breakdown">
      <div class="breakdown-title">SUBJECT BREAKDOWN</div>
      ${breakdown.map(b=>`
        <div class="breakdown-row">
          <span>${b.name}</span>
          <span class="breakdown-score">${b.score} / ${b.max}</span>
        </div>`).join('')}
    </div>`;

  setTimeout(() => {
    document.getElementById('bar-' + id).style.width = pct + '%';
  }, 100);

  rc.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

/* ── Init ── */
buildInputs();

// Restore previous results automatically
Object.keys(streams).forEach(id => {
  const anyFilled = streams[id].subjects.some((sub, i) => {
    return localStorage.getItem(`inp-${id}-${i}`);
  });
  if (anyFilled) calculate(id);
});
