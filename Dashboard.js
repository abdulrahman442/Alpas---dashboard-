let snapshots = [];
let outbox = [];
let isSimulating = true;

// Utility to generate mock data
function generateSnapshot() {
  return {
    operationId: `BNK-2026-${Math.floor(Math.random()*9000)+1000}`,
    metrics: {
      massFlow: (40 + Math.random()*5).toFixed(2),
      density: (930 + Math.random()*10).toFixed(2),
      temperature: (50 + Math.random()*4).toFixed(2)
    }
  };
}

function updateUI(snapshot) {
  document.getElementById('massFlow').innerText = snapshot.metrics.massFlow + " kg/s";
  document.getElementById('density').innerText = snapshot.metrics.density + " kg/m³";
  document.getElementById('temperature').innerText = snapshot.metrics.temperature + " °C";
  document.getElementById('outbox').innerText = outbox.length + " Pending";
}

function addSnapshot() {
  const snapshot = generateSnapshot();
  snapshots.push(snapshot);
  
  // Simulate submission success/failure
  if (Math.random() < 0.1) {
    outbox.push(snapshot);
    document.getElementById('connectionStatus').innerText = "Sync Latency / Buffering";
  } else {
    document.getElementById('connectionStatus').innerText = "ALPAS Connected";
  }

  if (snapshots.length > 20) snapshots.shift();
  updateUI(snapshot);
  updateCharts();
}

document.getElementById('toggleSim').addEventListener('click', () => {
  isSimulating = !isSimulating;
  document.getElementById('toggleSim').innerText = isSimulating ? 'Stop Simulator' : 'Start Simulator';
});

setInterval(() => {
  if (isSimulating) addSnapshot();
}, 2000);

// --- Chart.js Setup ---
const ctxFlow = document.getElementById('massFlowChart').getContext('2d');
const massFlowChart = new Chart(ctxFlow, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Mass Flow',
      data: [],
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.3)',
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    animation: false
  }
});

const ctxDensity = document.getElementById('densityTempChart').getContext('2d');
const densityTempChart = new Chart(ctxDensity, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      { label: 'Density', data: [], borderColor: '#0891b2', tension: 0.4 },
      { label: 'Temperature', data: [], borderColor: '#ea580c', tension: 0.4 }
    ]
  },
  options: { responsive: true, animation: false }
});

function updateCharts() {
  massFlowChart.data.labels = snapshots.map(s => s.operationId);
  massFlowChart.data.datasets[0].data = snapshots.map(s => s.metrics.massFlow);
  massFlowChart.update();

  densityTempChart.data.labels = snapshots.map(s => s.operationId);
  densityTempChart.data.datasets[0].data = snapshots.map(s => s.metrics.density);
  densityTempChart.data.datasets[1].data = snapshots.map(s => s.metrics.temperature);
  densityTempChart.update();
                                            }
