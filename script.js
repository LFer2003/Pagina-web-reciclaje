// Elementos
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const btnSave = document.getElementById('btnSave');
const btnGenerate = document.getElementById('btnGenerate');
const btnDownload = document.getElementById('btnDownload');
const systemState = document.getElementById('systemState');

const conveyorItem = document.getElementById('conveyorItem');
const weightEl = document.getElementById('weight');
const classEl = document.getElementById('classification');
const confEl = document.getElementById('confidence');
const logEl = document.getElementById('log');
const modeEl = document.getElementById('mode');
const manualControls = document.getElementById('manualControls');
const manualWeightControl = document.getElementById('manualWeightControl');
const manualMaterial = document.getElementById('manualMaterial');
const manualWeight = document.getElementById('manualWeight');

let running = false;
let intervalId = null;
let history = []; // historial local

// Chart.js setup
const pieCtx = document.getElementById('pieChart').getContext('2d');
const lineCtx = document.getElementById('lineChart').getContext('2d');

const pieChart = new Chart(pieCtx, {
  type: 'doughnut',
  data: { labels: ['Plástico','Papel','Metal'], datasets: [{ data: [0,0,0] }] },
  options: { plugins: { legend: { position: 'bottom' } } }
});

const lineChart = new Chart(lineCtx, {
  type: 'line',
  data: { labels: [], datasets: [{ label: 'Peso (kg)', data: [], tension: 0.2, fill:false }] },
  options: { scales: { y: { beginAtZero:true } } }
});

// util
function randBetween(min, max) { return Math.random()*(max-min)+min; }
function choose(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

// classification pseudo-IA
function classifyByRule(weight) {
  const r = Math.random();
  if (r < 0.45) return 'Plástico';
  if (r < 0.8) return 'Papel';
  return 'Metal';
}
function calcConfidence(weight) {
  // confidence increases with weight (arbitrario para mostrar %)
  return Math.min(99, Math.max(55, 40 + weight * 12 + Math.random()*10));
}
function calcPrice(material, weight) {
  const map = { 'Plástico':1200, 'Papel':500, 'Metal':2800 };
  return Math.round(map[material] * weight);
}
function calcPoints(material, weight) {
  const base = { 'Plástico':8, 'Papel':3, 'Metal':12 };
  return Math.round(base[material] * weight);
}

// animación item
function animateConveyor() {
  conveyorItem.style.transform = 'translateX(260px)';
  setTimeout(()=> { conveyorItem.style.transform='translateX(-10px)'; }, 900);
}

// simulate one reading
function simulateReading(payload) {
  // payload optional: { material, weight } if manual
  const material = payload && payload.material ? payload.material : classifyByRule();
  const weight = payload && payload.weight ? parseFloat(payload.weight) : +(randBetween(0.05, 4.0)).toFixed(2);
  const confidence = +calcConfidence(weight).toFixed(1);
  const price = calcPrice(material, weight);
  const points = calcPoints(material, weight);

  // Update visual
  weightEl.textContent = weight.toFixed(2);
  classEl.textContent = material;
  confEl.textContent = confidence + '%';

  // LED colors
  document.getElementById('ledWeight').className = 'led on-green';
  document.getElementById('ledClass').className = 'led on-yellow';
  document.getElementById('ledConf').className = 'led on-green';

  // animate
  animateConveyor();

  // log local
  const item = {
    timestamp: new Date().toISOString(),
    material, weight, confidence, price, points
  };
  history.unshift(item);
  if (history.length > 50) history.pop();
  renderLog();
  updateCharts();

  // return item for optional save
  return item;
}

function renderLog() {
  logEl.innerHTML = '';
  history.forEach(h => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `${new Date(h.timestamp).toLocaleString()} — ${h.material} — ${h.weight} kg — ${h.points} pts`;
    logEl.appendChild(li);
  });
}

function updateCharts() {
  // pie
  const counts = { 'Plástico':0,'Papel':0,'Metal':0 };
  history.forEach(h => counts[h.material]++);
  pieChart.data.datasets[0].data = [counts['Plástico'], counts['Papel'], counts['Metal']];
  pieChart.update();

  // line
  lineChart.data.labels = history.slice(0,20).map(h => new Date(h.timestamp).toLocaleTimeString()).reverse();
  lineChart.data.datasets[0].data = history.slice(0,20).map(h => h.weight).reverse();
  lineChart.update();
}

// controls
btnStart.addEventListener('click', () => {
  if (running) return;
  running = true;
  systemState.textContent = 'En ejecución';
  intervalId = setInterval(()=> {
    const item = simulateReading();
    // opcional: auto-save (comenta si no quieres)
    // saveReading(item);
  }, 2000);
});

btnStop.addEventListener('click', () => {
  running = false;
  systemState.textContent = 'Detenido';
  clearInterval(intervalId);
});

modeEl.addEventListener('change', (e) => {
  if (e.target.value === 'manual') {
    manualControls.style.display = 'block';
    manualWeightControl.style.display = 'block';
  } else {
    manualControls.style.display = 'none';
    manualWeightControl.style.display = 'none';
  }
});

btnGenerate.addEventListener('click', () => {
  if (modeEl.value === 'manual') {
    const mat = manualMaterial.value;
    const w = parseFloat(manualWeight.value);
    if (!w || w <= 0) { alert('Ingresa peso válido'); return; }
    const item = simulateReading({ material: mat, weight: w });
    // auto save? no por defecto
    // saveReading(item);
  } else {
    const item = simulateReading();
    // saveReading(item);
  }
});

// Save button -> guarda última lectura en server
btnSave.addEventListener('click', () => {
  if (history.length === 0) { alert('No hay lecturas para guardar'); return; }
  const last = history[0];
  saveReading(last);
});

// Save to server (PHP)
function saveReading(item) {
  fetch('lectura_automatica.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  })
  .then(r => r.json())
  .then(res => {
    if (res.success) {
      alert('Lectura guardada en servidor. ID: ' + res.id);
    } else {
      alert('Error al guardar en servidor: ' + (res.error || 'desconocido'));
    }
  })
  .catch(err => {
    alert('Error de red: ' + err.message);
  });
}

// download CSV
btnDownload.addEventListener('click', () => {
  if (!history.length) { alert('No hay datos'); return; }
  const rows = [['timestamp','material','weight','confidence','price','points']];
  history.slice().reverse().forEach(h => rows.push([h.timestamp,h.material,h.weight,h.confidence,h.price,h.points]));
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'historial_lecturas.csv'; a.click();
  URL.revokeObjectURL(url);
});

// quick init
renderLog();
updateCharts();
