// Quick Poll Tool
function createPollTool() {
    return `
        <button class="back-btn" onclick="backToHome()">← Back to Tools</button>
        <h2>📊 Quick Poll Creator</h2>

        <div style="background: var(--gray-50); padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem;">
            <p style="color: var(--gray-700); margin-bottom: 1rem;">
                ℹ️ Note: This is a simple poll creator. Results are stored locally in your browser.
                For shareable polls with real-time voting, consider upgrading to Premium!
            </p>
        </div>

        <div style="margin-bottom: 2rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Poll Question:</label>
            <input type="text" id="pollQuestion" placeholder="What's your favorite color?">

            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Options (one per line):</label>
            <textarea id="pollOptions" rows="6" placeholder="Red&#10;Blue&#10;Green&#10;Yellow"></textarea>

            <button class="btn-primary" onclick="createPoll()">Create Poll</button>
            <button class="btn-secondary" onclick="clearPoll()">Clear</button>
        </div>

        <div id="pollDisplay"></div>

        <div class="ad-placeholder" style="margin-top: 2rem;">
            <small>🚀 Upgrade to Premium for shareable polls with real-time results!</small>
        </div>
    `;
}

let pollData = null;

function initPoll() {
    // Load saved poll
    const saved = loadFromLocalStorage('currentPoll');
    if (saved) {
        pollData = saved;
        displayPoll();
    }
}

function createPoll() {
    const question = document.getElementById('pollQuestion').value.trim();
    const optionsText = document.getElementById('pollOptions').value;
    const options = optionsText.split('\n').filter(opt => opt.trim().length > 0);

    if (!question) {
        alert('Please enter a poll question');
        return;
    }

    if (options.length < 2) {
        alert('Please enter at least 2 options');
        return;
    }

    pollData = {
        question,
        options: options.map(opt => ({ text: opt, votes: 0 })),
        totalVotes: 0
    };

    saveToLocalStorage('currentPoll', pollData);
    displayPoll();
}

function displayPoll() {
    if (!pollData) return;

    const displayDiv = document.getElementById('pollDisplay');

    let html = `
        <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h3 style="margin-bottom: 1.5rem; font-size: 1.5rem; color: var(--primary);">${pollData.question}</h3>
    `;

    pollData.options.forEach((option, index) => {
        const percentage = pollData.totalVotes > 0 ? (option.votes / pollData.totalVotes * 100).toFixed(1) : 0;

        html += `
            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-weight: 600;">${option.text}</span>
                    <span style="color: var(--gray-700);">${option.votes} votes (${percentage}%)</span>
                </div>
                <div style="background: var(--gray-200); height: 40px; border-radius: 8px; overflow: hidden; position: relative;">
                    <div style="background: linear-gradient(90deg, var(--primary), var(--secondary)); height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
                    <button
                        onclick="votePoll(${index})"
                        style="
                            position: absolute;
                            top: 50%;
                            right: 10px;
                            transform: translateY(-50%);
                            background: white;
                            border: 2px solid var(--primary);
                            color: var(--primary);
                            padding: 0.25rem 1rem;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        "
                    >
                        Vote
                    </button>
                </div>
            </div>
        `;
    });

    html += `
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid var(--gray-200); text-align: center;">
                <strong>Total Votes: ${pollData.totalVotes}</strong>
            </div>
        </div>
    `;

    displayDiv.innerHTML = html;
}

function votePoll(optionIndex) {
    if (!pollData) return;

    pollData.options[optionIndex].votes++;
    pollData.totalVotes++;

    saveToLocalStorage('currentPoll', pollData);
    displayPoll();

    // Show feedback
    const msg = document.createElement('div');
    msg.textContent = '✅ Vote recorded!';
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

function clearPoll() {
    pollData = null;
    document.getElementById('pollQuestion').value = '';
    document.getElementById('pollOptions').value = '';
    document.getElementById('pollDisplay').innerHTML = '';
    localStorage.removeItem('currentPoll');
}

// Add animation
const pollStyle = document.createElement('style');
pollStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(pollStyle);
