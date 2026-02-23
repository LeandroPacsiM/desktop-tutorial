// Mock data and interactive logic for the static dashboard

// ----- Mock data (by year) -----
const mock = {
  years: [2017, 2018, 2019, 2020],
  // For each year, values for sales (two channels) and visits
  data: {
    2017: { online: 30, offline: 42, visits: 2800 },
    2018: { online: 12, offline: 18, visits: 2600 },
    2019: { online: 55, offline: 20, visits: 4500 },
    2020: { online: 22, offline: 28, visits: 3200 }
  },
  // ranking
  ranking: [
    { name: 'No. 0 Shop', value: 432641 },
    { name: 'No. 1 Shop', value: 432641 },
    { name: 'No. 2 Shop', value: 432641 },
    { name: 'No. 3 Shop', value: 432641 },
    { name: 'No. 4 Shop', value: 432641 },
    { name: 'No. 5 Shop', value: 432641 }
  ]
};

// ----- DOM refs -----
const kpiSales = document.getElementById('kpi-sales');
const kpiVisits = document.getElementById('kpi-visits');
const kpiPayments = document.getElementById('kpi-payments');
const kpiEffect = document.getElementById('kpi-effect');
const sparklineCtx = document.getElementById('sparkline').getContext('2d');
const miniBarCtx = document.getElementById('miniBar').getContext('2d');

const mainCtx = document.getElementById('mainChart').getContext('2d');
const rankingList = document.getElementById('rankingList');

const tabs = document.querySelectorAll('.tab');
const dateFrom = document.getElementById('dateFrom');
const dateTo = document.getElementById('dateTo');
const applyRangeBtn = document.getElementById('applyRange');

// state
let activeTab = 'sales';
let filteredYears = [...mock.years];

// init date inputs (default range covers all years)
function initDates() {
  const min = `${mock.years[0]}-01-01`;
  const max = `${mock.years[mock.years.length-1]}-12-31`;
  dateFrom.value = min;
  dateTo.value = max;
}
initDates();

// small charts
let sparklineChart = new Chart(sparklineCtx, {
  type: 'line',
  data: {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [{
      data: [320, 420, 280, 500, 380, 420, 460],
      borderColor: '#2b7cff',
      backgroundColor: 'rgba(43,124,255,0.12)',
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x:{display:false}, y:{display:false} },
    elements: { point:{ radius:0 } }
  }
});

let miniBarChart = new Chart(miniBarCtx, {
  type: 'bar',
  data: {
    labels: ['A','B','C','D'],
    datasets: [{ data: [12,9,14,8], backgroundColor: '#7fb0ff' }]
  },
  options: {
    maintainAspectRatio: false,
    plugins: { legend:{display:false} },
    scales: { x:{ display:false }, y:{ display:false } }
  }
});

// main chart
let mainChart = null;
function buildMainChart(type='sales', years=filteredYears) {
  const labels = years;
  const dsOnline = labels.map(y => mock.data[y].online);
  const dsOffline = labels.map(y => mock.data[y].offline);
  const visits = labels.map(y => mock.data[y].visits);

  const datasets = type === 'sales'
    ? [
        { label: 'Online', data: dsOnline, backgroundColor: '#2b7cff' },
        { label: 'Offline', data: dsOffline, backgroundColor: '#bfe0ff' }
      ]
    : [
        { label: 'Visits', data: visits, backgroundColor: '#2b7cff' }
      ];

  if (mainChart) mainChart.destroy();
  mainChart = new Chart(mainCtx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { stacked: false },
        y: { beginAtZero: true }
      }
    }
  });
}

// render ranking
function renderRanking() {
  rankingList.innerHTML = '';
  mock.ranking.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${item.name}</span><strong>${item.value.toLocaleString()}</strong>`;
    rankingList.appendChild(li);
  });
}

// compute KPIs from mock (sum for available filtered years)
function updateKPIs(years=filteredYears) {
  let totalSales = 0;
  let totalVisits = 0;
  let payments = 0;
  years.forEach(y => {
    const d = mock.data[y];
    totalSales += (d.online + d.offline) * 1000; // scale to simulate larger numbers
    totalVisits += d.visits;
    payments += Math.round(d.visits * 0.18); // fake conversion
  });

  kpiSales.textContent = `$ ${totalSales.toLocaleString()}`;
  kpiVisits.textContent = totalVisits.toLocaleString();
  kpiPayments.textContent = payments.toLocaleString();
  kpiEffect.textContent = `${Math.round((payments/totalVisits || 0) * 100)}%`;
}

// apply date range (simple: use years present between the two dates)
function applyDateRange() {
  const from = new Date(dateFrom.value);
  const to = new Date(dateTo.value);
  if (isNaN(from) || isNaN(to) || from > to) {
    alert('Rango de fechas inválido');
    return;
  }
  const years = mock.years.filter(y => {
    const start = new Date(`${y}-01-01`);
    const end = new Date(`${y}-12-31`);
    return (end >= from && start <= to);
  });
  filteredYears = years.length ? years : [];
  updateKPIs(filteredYears);
  buildMainChart(activeTab, filteredYears);
}

// tab handling
tabs.forEach(t => {
  t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    activeTab = t.dataset.type;
    buildMainChart(activeTab, filteredYears);
  });
});

// apply button
applyRangeBtn.addEventListener('click', applyDateRange);

// initial render
updateKPIs(filteredYears);
buildMainChart(activeTab, filteredYears);
renderRanking();
