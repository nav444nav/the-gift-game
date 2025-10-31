// Secret Santa Generator Tool
function createSantaTool() {
    return `
        <button class="back-btn" onclick="backToHome()">← Back to Tools</button>
        <h2>🎅 Secret Santa Generator</h2>

        <div style="background: linear-gradient(135deg, #dc2626, #16a34a); color: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
            <h3 style="margin-bottom: 0.5rem;">🎄 How it works:</h3>
            <ul style="padding-left: 1.5rem; line-height: 1.8;">
                <li>Enter all participant names</li>
                <li>Click "Generate Assignments"</li>
                <li>Each person will be randomly assigned someone to give a gift to</li>
                <li>No one gets themselves, and everyone gives to exactly one person</li>
            </ul>
        </div>

        <div style="margin-bottom: 2rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Participant Names (one per line):</label>
            <textarea id="santaNames" rows="10" placeholder="Alice&#10;Bob&#10;Charlie&#10;Diana&#10;Eve&#10;Frank"></textarea>

            <button class="btn-primary" onclick="generateSecretSanta()">🎁 Generate Assignments</button>
            <button class="btn-secondary" onclick="clearSecretSanta()">Clear</button>
        </div>

        <div id="santaResults"></div>

        <div class="ad-placeholder" style="margin-top: 2rem;">
            <small>🎁 Tip: Premium version can email assignments automatically!</small>
        </div>
    `;
}

function initSanta() {
    // Load saved names
    const saved = loadFromLocalStorage('santaNames');
    if (saved) {
        document.getElementById('santaNames').value = saved.join('\n');
    }
}

function generateSecretSanta() {
    const text = document.getElementById('santaNames').value;
    const names = text.split('\n').filter(name => name.trim().length > 0);

    if (names.length < 3) {
        alert('Please enter at least 3 participants for Secret Santa');
        return;
    }

    // Save names
    saveToLocalStorage('santaNames', names);

    // Generate assignments (ensure no one gets themselves)
    const assignments = generateValidSecretSantaAssignments(names);

    if (!assignments) {
        alert('Failed to generate valid assignments. Please try again.');
        return;
    }

    displaySecretSantaResults(assignments);
}

function generateValidSecretSantaAssignments(names) {
    // Create a derangement (permutation where no element appears in its original position)
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
        const shuffled = [...names].sort(() => Math.random() - 0.5);
        let valid = true;

        // Check if anyone got themselves
        for (let i = 0; i < names.length; i++) {
            if (names[i] === shuffled[i]) {
                valid = false;
                break;
            }
        }

        if (valid) {
            return names.map((giver, i) => ({
                giver: giver,
                receiver: shuffled[i]
            }));
        }

        attempts++;
    }

    return null;
}

function displaySecretSantaResults(assignments) {
    const resultsDiv = document.getElementById('santaResults');

    let html = `
        <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1.5rem; color: var(--success); text-align: center;">
                🎉 Secret Santa Assignments Generated!
            </h3>
            <p style="text-align: center; margin-bottom: 2rem; color: var(--gray-700);">
                Click on each name to reveal who they're giving to. Keep it secret! 🤫
            </p>

            <div style="display: grid; gap: 1rem;">
    `;

    assignments.forEach((assignment, index) => {
        html += `
            <div
                id="santa-card-${index}"
                style="
                    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
                    padding: 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    border: 2px solid var(--success);
                    transition: transform 0.2s;
                "
                onclick="revealAssignment(${index})"
                onmouseover="this.style.transform='scale(1.02)'"
                onmouseout="this.style.transform='scale(1)'"
            >
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="font-size: 1.2rem;">${assignment.giver}</strong>
                    <span id="santa-status-${index}" style="font-size: 1.5rem;">🎁</span>
                </div>
                <div
                    id="santa-reveal-${index}"
                    style="
                        margin-top: 1rem;
                        padding: 1rem;
                        background: white;
                        border-radius: 6px;
                        display: none;
                    "
                >
                    <strong>Gives to:</strong>
                    <div style="font-size: 1.3rem; color: var(--primary); margin-top: 0.5rem;">
                        ${assignment.receiver}
                    </div>
                </div>
            </div>
        `;
    });

    html += `
            </div>

            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn-secondary" onclick="copyAllAssignments()">📋 Copy All Assignments</button>
            </div>
        </div>
    `;

    resultsDiv.innerHTML = html;
}

function revealAssignment(index) {
    const revealDiv = document.getElementById(`santa-reveal-${index}`);
    const status = document.getElementById(`santa-status-${index}`);

    if (revealDiv.style.display === 'none') {
        revealDiv.style.display = 'block';
        status.textContent = '✅';
    } else {
        revealDiv.style.display = 'none';
        status.textContent = '🎁';
    }
}

function copyAllAssignments() {
    const text = document.getElementById('santaNames').value;
    const names = text.split('\n').filter(name => name.trim().length > 0);
    const assignments = generateValidSecretSantaAssignments(names);

    if (!assignments) return;

    let copyText = '🎅 Secret Santa Assignments:\n\n';
    assignments.forEach(assignment => {
        copyText += `${assignment.giver} → ${assignment.receiver}\n`;
    });

    navigator.clipboard.writeText(copyText).then(() => {
        alert('✅ All assignments copied to clipboard!');
    }).catch(() => {
        // Fallback: show in alert
        alert(copyText);
    });
}

function clearSecretSanta() {
    document.getElementById('santaNames').value = '';
    document.getElementById('santaResults').innerHTML = '';
    localStorage.removeItem('santaNames');
}
