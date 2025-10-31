// Team Generator Tool
function createTeamsTool() {
    return `
        <button class="back-btn" onclick="backToHome()">← Back to Tools</button>
        <h2>👥 Team Generator</h2>

        <div style="margin-bottom: 2rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Enter names (one per line):</label>
            <textarea id="teamNames" rows="10" placeholder="Alice&#10;Bob&#10;Charlie&#10;Diana&#10;Eve&#10;Frank"></textarea>

            <div style="margin: 1rem 0;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Number of teams:</label>
                <input type="number" id="numTeams" value="2" min="2" max="10" style="margin-bottom: 0;">
            </div>

            <button class="btn-primary" onclick="generateTeams()">Generate Teams</button>
            <button class="btn-secondary" onclick="clearTeams()">Clear</button>
        </div>

        <div id="teamsResult"></div>

        <div class="ad-placeholder" style="margin-top: 2rem;">
            <small>💡 Pro tip: Save your team configurations with premium!</small>
        </div>
    `;
}

function initTeams() {
    // Load saved names
    const saved = loadFromLocalStorage('teamNames');
    if (saved) {
        document.getElementById('teamNames').value = saved.join('\n');
    }
}

function generateTeams() {
    const text = document.getElementById('teamNames').value;
    const names = text.split('\n').filter(name => name.trim().length > 0);
    const numTeams = parseInt(document.getElementById('numTeams').value);

    if (names.length === 0) {
        alert('Please enter at least one name');
        return;
    }

    if (numTeams < 2 || numTeams > names.length) {
        alert('Number of teams must be between 2 and the total number of names');
        return;
    }

    // Save names
    saveToLocalStorage('teamNames', names);

    // Shuffle names
    const shuffled = [...names].sort(() => Math.random() - 0.5);

    // Distribute into teams
    const teams = Array.from({ length: numTeams }, () => []);
    shuffled.forEach((name, index) => {
        teams[index % numTeams].push(name);
    });

    // Display results
    displayTeams(teams);
}

function displayTeams(teams) {
    const resultDiv = document.getElementById('teamsResult');
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#84cc16'];

    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">';

    teams.forEach((team, index) => {
        const color = colors[index % colors.length];
        html += `
            <div style="background: ${color}; color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">Team ${index + 1}</h3>
                <ul style="list-style: none; padding: 0;">
                    ${team.map(name => `<li style="padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.3);">${name}</li>`).join('')}
                </ul>
                <div style="margin-top: 1rem; font-weight: bold;">
                    Total: ${team.length} ${team.length === 1 ? 'member' : 'members'}
                </div>
            </div>
        `;
    });

    html += '</div>';
    resultDiv.innerHTML = html;
}

function clearTeams() {
    document.getElementById('teamNames').value = '';
    document.getElementById('teamsResult').innerHTML = '';
    localStorage.removeItem('teamNames');
}
