/* ─────────────────────────────────────
   STOPWATCH LOGIC WITH LOCAL STORAGE
───────────────────────────────────── */
alert('afghj')
// Constants
const STORAGE_KEY = 'studyDudyStopwatch';

// State Variables
let timerInterval;
let state = {
  time: 0,           // Total elapsed time in centiseconds
  running: false,    // Is it currently running?
  startTimestamp: 0, // The System Time (Date.now()) when it was last started
  logs: []           // Array of { time: "00:00", note: "Text" }
};

// DOM Elements
const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const logList = document.getElementById('logList');

/* ─────────────────────────────────────
   CORE FUNCTIONS
───────────────────────────────────── */

// 1. INITIALIZE ON LOAD
function init() {
  loadState();
  renderLogs(); // Render saved logs
  
  // Update display based on loaded state
  if (state.running) {
    // If it was running, we need to calculate how much time passed while the page was closed
    const now = Date.now();
    const diff = now - state.startTimestamp; // Difference in milliseconds
    state.time += Math.floor(diff / 10);     // Add difference to accumulated time
    startTimer(true); // true = resuming from refresh
  } else {
    updateDisplay(state.time);
    updateButtons(false);
  }
}

// 2. START TIMER
function startTimer(isResume = false) {
  if (state.running) return; // Prevent double start

  state.running = true;
  
  // If it's not a resume (meaning it's a fresh start), reset time? 
  // No, usually start continues from where it left if paused.
  // We only set startTimestamp if it's NOT a resume from page refresh 
  // OR if it's a resume from pause (we need a new timestamp base)
  
  if (!isResume) {
    state.startTimestamp = Date.now();
  }

  saveState(); // Save state immediately

  timerInterval = setInterval(() => {
    const now = Date.now();
    // Calculate time: (Time already elapsed) + (Time passed since start button pressed)
    const currentElapsed = state.time + Math.floor((now - state.startTimestamp) / 10);
    updateDisplay(currentElapsed);
  }, 10); // Update frequently

  updateButtons(true);
}

// 3. STOP / PAUSE TIMER
function stopTimer() {
  if (!state.running) return;

  clearInterval(timerInterval);
  
  // Calculate final time at the moment of stopping and save it
  const now = Date.now();
  state.time += Math.floor((now - state.startTimestamp) / 10);
  
  state.running = false;
  state.startTimestamp = 0; // Reset timestamp

  saveState();
  updateDisplay(state.time);
  updateButtons(false);
  startBtn.textContent = "Resume";
}

// 4. RESET TIMER
function resetTimer() {
  clearInterval(timerInterval);
  
  // If it was running, log it automatically before reset
  if (state.running && state.time > 0) {
    addLogItem(formatTime(state.time), "Stopped & Reset");
  }

  state.time = 0;
  state.running = false;
  state.startTimestamp = 0;

  saveState();
  updateDisplay(0);
  updateButtons(false);
  startBtn.textContent = "Start";
}

// 5. RECORD LAP
function recordLap() {
  let currentTime = state.time;
  
  // If currently running, calculate the live time
  if (state.running) {
    const now = Date.now();
    currentTime += Math.floor((now - state.startTimestamp) / 10);
  }

  if (currentTime === 0) return;
  
  addLogItem(formatTime(currentTime), "Lap");
}

// 6. UPDATE DISPLAY HELPER
function updateDisplay(t) {
  const hours = Math.floor(t / 360000);
  const minutes = Math.floor((t % 360000) / 6000);
  const seconds = Math.floor((t % 6000) / 100);
  const centiseconds = t % 100;

  let timeStr;
  if (hours > 0) {
    timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  } else {
    timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}<span style="font-size:0.5em; vertical-align: text-top;">.${String(centiseconds).padStart(2, '0')}</span>`;
  }
  display.innerHTML = timeStr;
}

// 7. UPDATE BUTTONS UI
function updateButtons(isRunning) {
  if (isRunning) {
    startBtn.style.opacity = "0.5";
    startBtn.textContent = "Running...";
  } else {
    startBtn.style.opacity = "1";
    startBtn.textContent = state.time > 0 ? "Resume" : "Start";
  }
}

/* ─────────────────────────────────────
   LOGS MANAGEMENT
───────────────────────────────────── */

function addLogItem(timeStr, label) {
  // Add to state array
  const newLog = { time: timeStr, note: "" };
  state.logs.unshift(newLog); // Add to beginning
  
  saveState();
  renderLogs(); // Re-render list
}

function renderLogs() {
  if (state.logs.length === 0) {
    logList.innerHTML = `<div style="color: var(--text-mute); text-align: center; padding: 20px; font-size: 0.9rem;">No times recorded yet.</div>`;
    return;
  }

  logList.innerHTML = "";
  
  state.logs.forEach((log, index) => {
    const item = document.createElement('div');
    item.className = 'log-item';
    
    // Get accent color for border
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent1');
    item.style.borderColor = accent;

    item.innerHTML = `
      <div class="log-time">${log.time}</div>
      <input type="text" class="log-note" placeholder="Write note..." value="${log.note}" oninput="updateNote(${index}, this.value)">
      <button class="delete-log-btn" onclick="deleteLog(${index})" style="background:none; border:none; cursor:pointer; color:var(--text-mute); font-size:1.2rem; padding:0 5px;">&times;</button>
    `;
    
    logList.appendChild(item);
  });
}

function updateNote(index, value) {
  state.logs[index].note = value;
  saveState(); // Save immediately when typing
}

function deleteLog(index) {
  state.logs.splice(index, 1);
  saveState();
  renderLogs();
}

function clearLogs() {
  state.logs = [];
  saveState();
  renderLogs();
}

/* ─────────────────────────────────────
   LOCAL STORAGE HELPERS
───────────────────────────────────── */

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    state = JSON.parse(saved);
  }
}

/* ─────────────────────────────────────
   FORMATTER
───────────────────────────────────── */

function formatTime(t) {
  const hours = Math.floor(t / 360000);
  const minutes = Math.floor((t % 360000) / 6000);
  const seconds = Math.floor((t % 6000) / 100);
  const centiseconds = t % 100;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}

// Initialize the app
init();