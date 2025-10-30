// Color Palette Generator Tool
function createColorsTool() {
    return `
        <button class="back-btn" onclick="backToHome()">← Back to Tools</button>
        <h2>🎨 Color Palette Generator</h2>

        <div style="text-align: center; margin-bottom: 2rem;">
            <button class="btn-primary" onclick="generatePalette()">🎲 Generate New Palette</button>
            <button class="btn-secondary" onclick="lockRandomColors()">🔒 Lock Random Colors</button>
        </div>

        <div id="colorPalette" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        </div>

        <div style="background: var(--gray-50); padding: 1.5rem; border-radius: 12px;">
            <h3 style="margin-bottom: 1rem;">💡 How to use:</h3>
            <ul style="padding-left: 1.5rem; line-height: 1.8;">
                <li>Click "Generate" to create a new random palette</li>
                <li>Click on any color to copy its hex code</li>
                <li>Click the lock icon to keep a color when generating new palettes</li>
                <li>Use spacebar to quickly generate new palettes</li>
            </ul>
        </div>
    `;
}

let colorLocks = [false, false, false, false, false];
let currentColors = [];

function initColors() {
    generatePalette();

    // Add spacebar shortcut
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && currentTool === 'colors') {
            e.preventDefault();
            generatePalette();
        }
    });
}

function generatePalette() {
    const paletteDiv = document.getElementById('colorPalette');

    // Generate new colors (keeping locked ones)
    const newColors = [];
    for (let i = 0; i < 5; i++) {
        if (colorLocks[i] && currentColors[i]) {
            newColors.push(currentColors[i]);
        } else {
            newColors.push(generateRandomColor());
        }
    }
    currentColors = newColors;

    // Display palette
    let html = '';
    currentColors.forEach((color, index) => {
        const isLocked = colorLocks[index];
        html += `
            <div style="text-align: center;">
                <div
                    style="
                        background: ${color};
                        height: 200px;
                        border-radius: 12px;
                        cursor: pointer;
                        position: relative;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        transition: transform 0.2s;
                    "
                    onclick="copyColor('${color}')"
                    onmouseover="this.style.transform='scale(1.05)'"
                    onmouseout="this.style.transform='scale(1)'"
                >
                    <button
                        onclick="event.stopPropagation(); toggleLock(${index})"
                        style="
                            position: absolute;
                            top: 10px;
                            right: 10px;
                            background: rgba(255,255,255,0.9);
                            border: none;
                            border-radius: 50%;
                            width: 35px;
                            height: 35px;
                            cursor: pointer;
                            font-size: 1.2rem;
                        "
                    >
                        ${isLocked ? '🔒' : '🔓'}
                    </button>
                </div>
                <div style="margin-top: 0.5rem; font-weight: 600; font-family: monospace;">
                    ${color}
                </div>
            </div>
        `;
    });

    paletteDiv.innerHTML = html;
}

function generateRandomColor() {
    // Generate colors with good saturation and lightness
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 30); // 60-90%
    const lightness = 45 + Math.floor(Math.random() * 20);  // 45-65%

    return hslToHex(hue, saturation, lightness);
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function copyColor(color) {
    navigator.clipboard.writeText(color).then(() => {
        // Show temporary feedback
        const msg = document.createElement('div');
        msg.textContent = `Copied ${color}!`;
        msg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--gray-900);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            animation: fadeOut 1s forwards;
        `;
        document.body.appendChild(msg);

        setTimeout(() => msg.remove(), 1000);
    }).catch(() => {
        alert(`Color code: ${color}`);
    });
}

function toggleLock(index) {
    colorLocks[index] = !colorLocks[index];
    generatePalette();
}

function lockRandomColors() {
    // Lock 2-3 random colors
    colorLocks = colorLocks.map(() => Math.random() < 0.5);
    generatePalette();
}

// Add CSS for fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; }
        70% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style);
