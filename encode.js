// Encode/Decode Tool
function createEncodeTool() {
    return `
        <button class="back-btn" onclick="backToHome()">← Back to Tools</button>
        <h2>🔐 Encode / Decode Tool</h2>

        <div style="margin-bottom: 2rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Input Text:</label>
            <textarea id="encodeInput" rows="6" placeholder="Enter text to encode or decode..."></textarea>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">

                <!-- Base64 -->
                <div>
                    <h4 style="margin-bottom: 0.5rem;">Base64</h4>
                    <button class="btn-primary" onclick="encodeBase64()" style="width: 100%; margin-bottom: 0.5rem;">Encode</button>
                    <button class="btn-secondary" onclick="decodeBase64()" style="width: 100%;">Decode</button>
                </div>

                <!-- URL -->
                <div>
                    <h4 style="margin-bottom: 0.5rem;">URL</h4>
                    <button class="btn-primary" onclick="encodeURL()" style="width: 100%; margin-bottom: 0.5rem;">Encode</button>
                    <button class="btn-secondary" onclick="decodeURL()" style="width: 100%;">Decode</button>
                </div>

                <!-- HTML -->
                <div>
                    <h4 style="margin-bottom: 0.5rem;">HTML Entities</h4>
                    <button class="btn-primary" onclick="encodeHTML()" style="width: 100%; margin-bottom: 0.5rem;">Encode</button>
                    <button class="btn-secondary" onclick="decodeHTML()" style="width: 100%;">Decode</button>
                </div>

                <!-- Hex -->
                <div>
                    <h4 style="margin-bottom: 0.5rem;">Hex</h4>
                    <button class="btn-primary" onclick="encodeHex()" style="width: 100%; margin-bottom: 0.5rem;">Encode</button>
                    <button class="btn-secondary" onclick="decodeHex()" style="width: 100%;">Decode</button>
                </div>

                <!-- Binary -->
                <div>
                    <h4 style="margin-bottom: 0.5rem;">Binary</h4>
                    <button class="btn-primary" onclick="encodeBinary()" style="width: 100%; margin-bottom: 0.5rem;">Encode</button>
                    <button class="btn-secondary" onclick="decodeBinary()" style="width: 100%;">Decode</button>
                </div>

                <!-- JWT Decode -->
                <div>
                    <h4 style="margin-bottom: 0.5rem;">JWT</h4>
                    <button class="btn-primary" onclick="decodeJWT()" style="width: 100%;">Decode</button>
                    <small style="display: block; margin-top: 0.5rem; color: var(--gray-700);">View only</small>
                </div>

            </div>

            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Output:</label>
            <textarea id="encodeOutput" rows="6" placeholder="Output will appear here..." readonly style="background: var(--gray-50);"></textarea>

            <div style="display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap;">
                <button class="btn-success" onclick="copyEncodeOutput()">📋 Copy Output</button>
                <button class="btn-secondary" onclick="swapInputOutput()">🔄 Swap Input/Output</button>
                <button class="btn-secondary" onclick="clearEncode()">Clear All</button>
            </div>
        </div>

        <!-- Quick Reference -->
        <div style="background: var(--gray-50); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">💡 Quick Reference:</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; font-size: 0.9rem; line-height: 1.6;">
                <div>
                    <strong>Base64:</strong><br>
                    Encode binary data to ASCII text<br>
                    <code style="background: white; padding: 2px 6px; border-radius: 4px;">SGVsbG8=</code>
                </div>
                <div>
                    <strong>URL Encoding:</strong><br>
                    Encode special characters for URLs<br>
                    <code style="background: white; padding: 2px 6px; border-radius: 4px;">hello%20world</code>
                </div>
                <div>
                    <strong>HTML Entities:</strong><br>
                    Escape HTML special characters<br>
                    <code style="background: white; padding: 2px 6px; border-radius: 4px;">&amp;lt;div&amp;gt;</code>
                </div>
                <div>
                    <strong>Hex:</strong><br>
                    Convert text to hexadecimal<br>
                    <code style="background: white; padding: 2px 6px; border-radius: 4px;">48656c6c6f</code>
                </div>
                <div>
                    <strong>Binary:</strong><br>
                    Convert text to binary (0s and 1s)<br>
                    <code style="background: white; padding: 2px 6px; border-radius: 4px;">01001000</code>
                </div>
                <div>
                    <strong>JWT:</strong><br>
                    Decode JWT tokens (view only)<br>
                    <small>Does not verify signature</small>
                </div>
            </div>
        </div>

        <div class="ad-placeholder" style="margin-top: 2rem;">
            <small>💡 Need bulk processing? Upgrade to Premium!</small>
        </div>
    `;
}

function initEncode() {
    // Load saved input
    const saved = loadFromLocalStorage('encodeInput');
    if (saved) {
        document.getElementById('encodeInput').value = saved;
    }
}

// Base64 Functions
function encodeBase64() {
    try {
        const input = document.getElementById('encodeInput').value;
        if (!input) {
            alert('Please enter some text to encode');
            return;
        }
        const encoded = btoa(unescape(encodeURIComponent(input)));
        document.getElementById('encodeOutput').value = encoded;
        saveToLocalStorage('encodeInput', input);
        showSuccessMessage('✅ Base64 Encoded!');
    } catch (e) {
        showErrorMessage('❌ Error: ' + e.message);
    }
}

function decodeBase64() {
    try {
        const input = document.getElementById('encodeInput').value;
        if (!input) {
            alert('Please enter Base64 text to decode');
            return;
        }
        const decoded = decodeURIComponent(escape(atob(input)));
        document.getElementById('encodeOutput').value = decoded;
        showSuccessMessage('✅ Base64 Decoded!');
    } catch (e) {
        showErrorMessage('❌ Invalid Base64 string');
    }
}

// URL Functions
function encodeURL() {
    try {
        const input = document.getElementById('encodeInput').value;
        if (!input) {
            alert('Please enter some text to encode');
            return;
        }
        const encoded = encodeURIComponent(input);
        document.getElementById('encodeOutput').value = encoded;
        saveToLocalStorage('encodeInput', input);
        showSuccessMessage('✅ URL Encoded!');
    } catch (e) {
        showErrorMessage('❌ Error: ' + e.message);
    }
}

function decodeURL() {
    try {
        const input = document.getElementById('encodeInput').value;
        if (!input) {
            alert('Please enter URL-encoded text to decode');
            return;
        }
        const decoded = decodeURIComponent(input);
        document.getElementById('encodeOutput').value = decoded;
        showSuccessMessage('✅ URL Decoded!');
    } catch (e) {
        showErrorMessage('❌ Invalid URL-encoded string');
    }
}

// HTML Functions
function encodeHTML() {
    try {
        const input = document.getElementById('encodeInput').value;
        if (!input) {
            alert('Please enter some text to encode');
            return;
        }
        const encoded = input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        document.getElementById('encodeOutput').value = encoded;
        saveToLocalStorage('encodeInput', input);
        showSuccessMessage('✅ HTML Encoded!');
    } catch (e) {
        showErrorMessage('❌ Error: ' + e.message);
    }
}

function decodeHTML() {
    try {
        const input = document.getElementById('encodeInput').value;
        if (!input) {
            alert('Please enter HTML-encoded text to decode');
            return;
        }
        const textarea = document.createElement('textarea');
        textarea.innerHTML = input;
        const decoded = textarea.value;
        document.getElementById('encodeOutput').value = decoded;
        showSuccessMessage('✅ HTML Decoded!');
    } catch (e) {
        showErrorMessage('❌ Error: ' + e.message);
    }
}

// Hex Functions
function encodeHex() {
    try {
        const input = document.getElementById('encodeInput').value;
        if (!input) {
            alert('Please enter some text to encode');
            return;
        }
        let hex = '';
        for (let i = 0; i < input.length; i++) {
            hex += input.charCodeAt(i).toString(16).padStart(2, '0');
        }
        document.getElementById('encodeOutput').value = hex;
        saveToLocalStorage('encodeInput', input);
        showSuccessMessage('✅ Hex Encoded!');
    } catch (e) {
        showErrorMessage('❌ Error: ' + e.message);
    }
}

function decodeHex() {
    try {
        const input = document.getElementById('encodeInput').value.replace(/\s/g, '');
        if (!input) {
            alert('Please enter hex text to decode');
            return;
        }
        if (!/^[0-9A-Fa-f]+$/.test(input)) {
            throw new Error('Invalid hex string');
        }
        let decoded = '';
        for (let i = 0; i < input.length; i += 2) {
            decoded += String.fromCharCode(parseInt(input.substr(i, 2), 16));
        }
        document.getElementById('encodeOutput').value = decoded;
        showSuccessMessage('✅ Hex Decoded!');
    } catch (e) {
        showErrorMessage('❌ Invalid hex string');
    }
}

// Binary Functions
function encodeBinary() {
    try {
        const input = document.getElementById('encodeInput').value;
        if (!input) {
            alert('Please enter some text to encode');
            return;
        }
        let binary = '';
        for (let i = 0; i < input.length; i++) {
            binary += input.charCodeAt(i).toString(2).padStart(8, '0') + ' ';
        }
        document.getElementById('encodeOutput').value = binary.trim();
        saveToLocalStorage('encodeInput', input);
        showSuccessMessage('✅ Binary Encoded!');
    } catch (e) {
        showErrorMessage('❌ Error: ' + e.message);
    }
}

function decodeBinary() {
    try {
        const input = document.getElementById('encodeInput').value.replace(/\s/g, '');
        if (!input) {
            alert('Please enter binary text to decode');
            return;
        }
        if (!/^[01]+$/.test(input)) {
            throw new Error('Invalid binary string');
        }
        let decoded = '';
        for (let i = 0; i < input.length; i += 8) {
            const byte = input.substr(i, 8);
            decoded += String.fromCharCode(parseInt(byte, 2));
        }
        document.getElementById('encodeOutput').value = decoded;
        showSuccessMessage('✅ Binary Decoded!');
    } catch (e) {
        showErrorMessage('❌ Invalid binary string');
    }
}

// JWT Decode Function
function decodeJWT() {
    try {
        const input = document.getElementById('encodeInput').value.trim();
        if (!input) {
            alert('Please enter a JWT token to decode');
            return;
        }

        const parts = input.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }

        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));

        const output = {
            header: header,
            payload: payload,
            signature: parts[2] + ' (not verified)'
        };

        document.getElementById('encodeOutput').value = JSON.stringify(output, null, 2);
        showSuccessMessage('✅ JWT Decoded! (Signature not verified)');
    } catch (e) {
        showErrorMessage('❌ Invalid JWT token');
    }
}

// Utility Functions
function copyEncodeOutput() {
    const output = document.getElementById('encodeOutput').value;
    if (!output) {
        alert('Nothing to copy');
        return;
    }

    navigator.clipboard.writeText(output).then(() => {
        showSuccessMessage('✅ Copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.getElementById('encodeOutput');
        textarea.select();
        document.execCommand('copy');
        showSuccessMessage('✅ Copied to clipboard!');
    });
}

function swapInputOutput() {
    const input = document.getElementById('encodeInput');
    const output = document.getElementById('encodeOutput');
    const temp = input.value;
    input.value = output.value;
    output.value = temp;
    showSuccessMessage('🔄 Swapped!');
}

function clearEncode() {
    document.getElementById('encodeInput').value = '';
    document.getElementById('encodeOutput').value = '';
    localStorage.removeItem('encodeInput');
}

function showSuccessMessage(message) {
    const msg = document.createElement('div');
    msg.textContent = message;
    msg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s, fadeOut 2s 1s forwards;
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}

function showErrorMessage(message) {
    const msg = document.createElement('div');
    msg.textContent = message;
    msg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--danger);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s, fadeOut 2s 1s forwards;
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}
