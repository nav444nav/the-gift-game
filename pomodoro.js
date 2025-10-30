// Pomodoro Timer Tool
function createPomodoroTool() {
    return `
        <button class="back-btn" onclick="backToHome()">← Back to Tools</button>
        <h2>🍅 Pomodoro Timer</h2>

        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 3rem; border-radius: 16px; margin-bottom: 2rem;">
                <div id="pomodoroMode" style="font-size: 1.5rem; margin-bottom: 1rem; font-weight: 600;">FOCUS TIME</div>
                <div id="pomodoroTimer" style="font-size: 5rem; font-weight: bold; font-family: monospace; margin: 1rem 0;">25:00</div>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button class="btn-success" onclick="startPomodoro()" id="pomodoroStartBtn">Start</button>
                    <button class="btn-secondary" onclick="pausePomodoro()" id="pomodoroPauseBtn" style="display: none;">Pause</button>
                    <button class="btn-secondary" onclick="resetPomodoro()">Reset</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
                <div style="background: var(--gray-50); padding: 1rem; border-radius: 8px;">
                    <div style="font-size: 0.9rem; color: var(--gray-700);">Focus Time</div>
                    <input type="number" id="focusMinutes" value="25" min="1" max="60" style="margin: 0.5rem 0; text-align: center;">
                    <div style="font-size: 0.8rem; color: var(--gray-700);">minutes</div>
                </div>
                <div style="background: var(--gray-50); padding: 1rem; border-radius: 8px;">
                    <div style="font-size: 0.9rem; color: var(--gray-700);">Short Break</div>
                    <input type="number" id="shortBreakMinutes" value="5" min="1" max="30" style="margin: 0.5rem 0; text-align: center;">
                    <div style="font-size: 0.8rem; color: var(--gray-700);">minutes</div>
                </div>
                <div style="background: var(--gray-50); padding: 1rem; border-radius: 8px;">
                    <div style="font-size: 0.9rem; color: var(--gray-700);">Long Break</div>
                    <input type="number" id="longBreakMinutes" value="15" min="1" max="60" style="margin: 0.5rem 0; text-align: center;">
                    <div style="font-size: 0.8rem; color: var(--gray-700);">minutes</div>
                </div>
            </div>

            <div style="background: var(--gray-50); padding: 1.5rem; border-radius: 12px;">
                <h3 style="margin-bottom: 1rem;">📊 Today's Stats</h3>
                <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <div style="font-size: 2rem; font-weight: bold; color: var(--primary);" id="completedPomodoros">0</div>
                        <div style="font-size: 0.9rem; color: var(--gray-700);">Completed Pomodoros</div>
                    </div>
                    <div>
                        <div style="font-size: 2rem; font-weight: bold; color: var(--success);" id="totalFocusTime">0</div>
                        <div style="font-size: 0.9rem; color: var(--gray-700);">Minutes Focused</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

let pomodoroInterval = null;
let pomodoroTimeLeft = 25 * 60; // in seconds
let pomodoroMode = 'focus'; // 'focus', 'shortBreak', 'longBreak'
let pomodoroCount = 0;
let isPomodoroPaused = false;

function initPomodoro() {
    // Load stats
    const stats = loadFromLocalStorage('pomodoroStats') || { completed: 0, totalMinutes: 0, date: new Date().toDateString() };

    // Reset stats if it's a new day
    if (stats.date !== new Date().toDateString()) {
        stats.completed = 0;
        stats.totalMinutes = 0;
        stats.date = new Date().toDateString();
        saveToLocalStorage('pomodoroStats', stats);
    }

    document.getElementById('completedPomodoros').textContent = stats.completed;
    document.getElementById('totalFocusTime').textContent = stats.totalMinutes;

    updatePomodoroDisplay();
}

function startPomodoro() {
    if (pomodoroInterval) return;

    document.getElementById('pomodoroStartBtn').style.display = 'none';
    document.getElementById('pomodoroPauseBtn').style.display = 'inline-block';

    pomodoroInterval = setInterval(() => {
        if (pomodoroTimeLeft > 0) {
            pomodoroTimeLeft--;
            updatePomodoroDisplay();
        } else {
            completePomodoroSession();
        }
    }, 1000);
}

function pausePomodoro() {
    if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
        document.getElementById('pomodoroStartBtn').style.display = 'inline-block';
        document.getElementById('pomodoroPauseBtn').style.display = 'none';
    }
}

function resetPomodoro() {
    pausePomodoro();
    pomodoroMode = 'focus';
    pomodoroTimeLeft = parseInt(document.getElementById('focusMinutes').value) * 60;
    updatePomodoroDisplay();
}

function completePomodoroSession() {
    pausePomodoro();

    // Play sound notification (optional)
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Complete!', {
            body: pomodoroMode === 'focus' ? 'Time for a break!' : 'Back to work!',
            icon: '🍅'
        });
    }

    if (pomodoroMode === 'focus') {
        // Update stats
        const stats = loadFromLocalStorage('pomodoroStats') || { completed: 0, totalMinutes: 0, date: new Date().toDateString() };
        stats.completed++;
        stats.totalMinutes += parseInt(document.getElementById('focusMinutes').value);
        saveToLocalStorage('pomodoroStats', stats);

        document.getElementById('completedPomodoros').textContent = stats.completed;
        document.getElementById('totalFocusTime').textContent = stats.totalMinutes;

        pomodoroCount++;

        // Every 4 pomodoros, take a long break
        if (pomodoroCount % 4 === 0) {
            pomodoroMode = 'longBreak';
            pomodoroTimeLeft = parseInt(document.getElementById('longBreakMinutes').value) * 60;
        } else {
            pomodoroMode = 'shortBreak';
            pomodoroTimeLeft = parseInt(document.getElementById('shortBreakMinutes').value) * 60;
        }
    } else {
        pomodoroMode = 'focus';
        pomodoroTimeLeft = parseInt(document.getElementById('focusMinutes').value) * 60;
    }

    updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoroTimeLeft / 60);
    const seconds = pomodoroTimeLeft % 60;

    document.getElementById('pomodoroTimer').textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const modeText = pomodoroMode === 'focus' ? 'FOCUS TIME' :
                     pomodoroMode === 'shortBreak' ? 'SHORT BREAK' : 'LONG BREAK';
    document.getElementById('pomodoroMode').textContent = modeText;

    // Update document title
    if (currentTool === 'pomodoro') {
        document.title = `${minutes}:${String(seconds).padStart(2, '0')} - ${modeText}`;
    }
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}
