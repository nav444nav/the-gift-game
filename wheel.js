// Wheel of Names Tool
function createWheelTool() {
    return `
        <button class="back-btn" onclick="backToHome()">← Back to Tools</button>
        <h2>🎡 Wheel of Names</h2>

        <div style="margin-bottom: 2rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Enter names (one per line):</label>
            <textarea id="wheelNames" rows="8" placeholder="Alice&#10;Bob&#10;Charlie&#10;Diana"></textarea>
            <button class="btn-primary" onclick="spinWheel()">🎯 Spin the Wheel!</button>
            <button class="btn-secondary" onclick="clearWheel()">Clear</button>
        </div>

        <div id="wheelCanvas" style="text-align: center; margin: 2rem 0;">
            <canvas id="wheel" width="400" height="400" style="max-width: 100%; border-radius: 50%; box-shadow: 0 8px 16px rgba(0,0,0,0.2);"></canvas>
        </div>

        <div id="wheelResult" style="text-align: center; font-size: 1.5rem; font-weight: bold; color: var(--primary); min-height: 2rem;"></div>

        <div class="ad-placeholder" style="margin-top: 2rem;">
            <small>💡 Tip: Upgrade to remove ads and save your wheels for $1.99!</small>
        </div>
    `;
}

let wheelSpinning = false;
let wheelRotation = 0;

function initWheel() {
    // Load saved names
    const saved = loadFromLocalStorage('wheelNames');
    if (saved) {
        document.getElementById('wheelNames').value = saved.join('\n');
    }
    drawWheel();
}

function drawWheel() {
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const names = getWheelNames();

    if (names.length === 0) {
        // Draw empty wheel
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#e5e7eb';
        ctx.beginPath();
        ctx.arc(200, 200, 200, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#6b7280';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Enter names to start', 200, 200);
        return;
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 190;
    const sliceAngle = (2 * Math.PI) / names.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context and rotate
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(wheelRotation);
    ctx.translate(-centerX, -centerY);

    // Draw slices
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];

    names.forEach((name, i) => {
        const startAngle = i * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        // Draw slice
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(name, radius - 20, 5);
        ctx.restore();
    });

    ctx.restore();

    // Draw pointer at top
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(centerX, 10);
    ctx.lineTo(centerX - 15, 40);
    ctx.lineTo(centerX + 15, 40);
    ctx.closePath();
    ctx.fill();
}

function getWheelNames() {
    const text = document.getElementById('wheelNames').value;
    return text.split('\n').filter(name => name.trim().length > 0);
}

function spinWheel() {
    if (wheelSpinning) return;

    const names = getWheelNames();
    if (names.length === 0) {
        alert('Please enter at least one name!');
        return;
    }

    // Save names
    saveToLocalStorage('wheelNames', names);

    wheelSpinning = true;
    document.getElementById('wheelResult').textContent = '';

    // Random rotation (3-5 full spins plus random position)
    const spins = 3 + Math.random() * 2;
    const randomAngle = Math.random() * 2 * Math.PI;
    const targetRotation = wheelRotation + (spins * 2 * Math.PI) + randomAngle;

    const duration = 3000; // 3 seconds
    const startTime = Date.now();
    const startRotation = wheelRotation;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease out)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        wheelRotation = startRotation + (targetRotation - startRotation) * easeOut;

        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            wheelSpinning = false;
            showWheelResult(names);
        }
    }

    animate();
}

function showWheelResult(names) {
    // Calculate which slice the pointer is pointing at
    const normalizedRotation = (wheelRotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const sliceAngle = (2 * Math.PI) / names.length;

    // The pointer points up (at angle 0), so we need to adjust
    let pointerAngle = (2 * Math.PI - normalizedRotation + Math.PI / 2) % (2 * Math.PI);
    const selectedIndex = Math.floor(pointerAngle / sliceAngle) % names.length;
    const winner = names[selectedIndex];

    document.getElementById('wheelResult').innerHTML = `🎉 Winner: <span style="color: var(--success);">${winner}</span>`;
}

function clearWheel() {
    document.getElementById('wheelNames').value = '';
    document.getElementById('wheelResult').textContent = '';
    wheelRotation = 0;
    localStorage.removeItem('wheelNames');
    drawWheel();
}
