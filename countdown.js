// Countdown Timer Tool
function createCountdownTool() {
    return `
        <button class="back-btn" onclick="backToHome()">← Back to Tools</button>
        <h2>⏰ Countdown Timer</h2>

        <div style="margin-bottom: 2rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Event Name:</label>
            <input type="text" id="eventName" placeholder="My Birthday, Vacation, Product Launch...">

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Date:</label>
                    <input type="date" id="eventDate" style="margin-bottom: 0;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Time:</label>
                    <input type="time" id="eventTime" value="00:00" style="margin-bottom: 0;">
                </div>
            </div>

            <button class="btn-primary" onclick="startCountdown()">Start Countdown</button>
            <button class="btn-secondary" onclick="stopCountdown()">Stop</button>
        </div>

        <div id="countdownDisplay" style="text-align: center; padding: 3rem; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; border-radius: 16px; margin-bottom: 2rem;">
            <h3 id="countdownTitle" style="font-size: 1.5rem; margin-bottom: 1rem;">Set a countdown above</h3>
            <div id="countdownTimer" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; max-width: 600px; margin: 0 auto;">
                <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px;">
                    <div style="font-size: 3rem; font-weight: bold;" id="days">0</div>
                    <div style="font-size: 0.9rem;">Days</div>
                </div>
                <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px;">
                    <div style="font-size: 3rem; font-weight: bold;" id="hours">0</div>
                    <div style="font-size: 0.9rem;">Hours</div>
                </div>
                <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px;">
                    <div style="font-size: 3rem; font-weight: bold;" id="minutes">0</div>
                    <div style="font-size: 0.9rem;">Minutes</div>
                </div>
                <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px;">
                    <div style="font-size: 3rem; font-weight: bold;" id="seconds">0</div>
                    <div style="font-size: 0.9rem;">Seconds</div>
                </div>
            </div>
        </div>
    `;
}

let countdownInterval = null;

function initCountdown() {
    // Load saved countdown
    const saved = loadFromLocalStorage('countdown');
    if (saved) {
        document.getElementById('eventName').value = saved.name;
        document.getElementById('eventDate').value = saved.date;
        document.getElementById('eventTime').value = saved.time;
        startCountdown();
    }
}

function startCountdown() {
    const name = document.getElementById('eventName').value.trim() || 'Event';
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;

    if (!date) {
        alert('Please select a date');
        return;
    }

    // Save countdown
    saveToLocalStorage('countdown', { name, date, time });

    const targetDate = new Date(`${date}T${time}`);

    document.getElementById('countdownTitle').textContent = `Countdown to ${name}`;

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdownTitle').textContent = `🎉 ${name} is here!`;
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '0';
            document.getElementById('minutes').textContent = '0';
            document.getElementById('seconds').textContent = '0';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    document.getElementById('countdownTitle').textContent = 'Set a countdown above';
    document.getElementById('days').textContent = '0';
    document.getElementById('hours').textContent = '0';
    document.getElementById('minutes').textContent = '0';
    document.getElementById('seconds').textContent = '0';
    localStorage.removeItem('countdown');
}
