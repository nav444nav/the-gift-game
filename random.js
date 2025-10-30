// Random Decision Tools
function createRandomTool() {
    return `
        <button class="back-btn" onclick="backToHome()">← Back to Tools</button>
        <h2>🎲 Random Decision Maker</h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">

            <!-- Coin Flip -->
            <div style="background: var(--gray-50); padding: 1.5rem; border-radius: 12px; text-align: center;">
                <h3 style="margin-bottom: 1rem;">🪙 Coin Flip</h3>
                <div id="coinResult" style="font-size: 3rem; margin: 1rem 0; min-height: 80px; display: flex; align-items: center; justify-content: center;">
                    🪙
                </div>
                <button class="btn-primary" onclick="flipCoin()">Flip Coin</button>
            </div>

            <!-- Dice Roll -->
            <div style="background: var(--gray-50); padding: 1.5rem; border-radius: 12px; text-align: center;">
                <h3 style="margin-bottom: 1rem;">🎲 Dice Roll</h3>
                <select id="diceType" style="width: 100%; padding: 0.5rem; margin-bottom: 1rem; border-radius: 6px; border: 2px solid var(--gray-200);">
                    <option value="6">6-sided (D6)</option>
                    <option value="20">20-sided (D20)</option>
                    <option value="12">12-sided (D12)</option>
                    <option value="10">10-sided (D10)</option>
                    <option value="4">4-sided (D4)</option>
                    <option value="100">100-sided (D100)</option>
                </select>
                <div id="diceResult" style="font-size: 3rem; margin: 1rem 0; min-height: 80px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--primary);">
                    ?
                </div>
                <button class="btn-primary" onclick="rollDice()">Roll Dice</button>
            </div>

            <!-- Yes or No -->
            <div style="background: var(--gray-50); padding: 1.5rem; border-radius: 12px; text-align: center;">
                <h3 style="margin-bottom: 1rem;">✅ Yes or No</h3>
                <div id="yesnoResult" style="font-size: 3rem; margin: 1rem 0; min-height: 80px; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                    🤔
                </div>
                <button class="btn-primary" onclick="yesOrNo()">Decide</button>
            </div>

        </div>

        <!-- Random Number Generator -->
        <div style="background: var(--gray-50); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">🔢 Random Number Generator</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.5rem;">Min:</label>
                    <input type="number" id="numMin" value="1" style="margin-bottom: 0;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 0.5rem;">Max:</label>
                    <input type="number" id="numMax" value="100" style="margin-bottom: 0;">
                </div>
            </div>
            <div id="numberResult" style="font-size: 2.5rem; text-align: center; font-weight: bold; color: var(--primary); margin: 1rem 0; min-height: 60px;">
            </div>
            <button class="btn-primary" onclick="generateNumber()">Generate</button>
        </div>

        <!-- Random From List -->
        <div style="background: var(--gray-50); padding: 1.5rem; border-radius: 12px;">
            <h3 style="margin-bottom: 1rem;">📝 Pick from List</h3>
            <textarea id="randomList" rows="5" placeholder="Enter items (one per line)&#10;Pizza&#10;Sushi&#10;Burger&#10;Tacos"></textarea>
            <div id="listResult" style="font-size: 1.5rem; text-align: center; font-weight: bold; color: var(--success); margin: 1rem 0; min-height: 40px;">
            </div>
            <button class="btn-primary" onclick="pickFromList()">Pick Random</button>
        </div>
    `;
}

function initRandom() {
    // Load saved list
    const saved = loadFromLocalStorage('randomList');
    if (saved) {
        document.getElementById('randomList').value = saved.join('\n');
    }
}

function flipCoin() {
    const coin = document.getElementById('coinResult');
    const result = Math.random() < 0.5 ? 'HEADS' : 'TAILS';

    // Animate
    let flips = 0;
    const maxFlips = 10;
    const interval = setInterval(() => {
        coin.textContent = flips % 2 === 0 ? '🪙' : '💿';
        flips++;

        if (flips >= maxFlips) {
            clearInterval(interval);
            coin.innerHTML = `<div style="font-size: 2rem; font-weight: bold; color: var(--primary);">${result}</div>`;
        }
    }, 100);
}

function rollDice() {
    const diceType = parseInt(document.getElementById('diceType').value);
    const result = Math.floor(Math.random() * diceType) + 1;

    const diceResult = document.getElementById('diceResult');

    // Animate
    let rolls = 0;
    const maxRolls = 8;
    const interval = setInterval(() => {
        diceResult.textContent = Math.floor(Math.random() * diceType) + 1;
        rolls++;

        if (rolls >= maxRolls) {
            clearInterval(interval);
            diceResult.textContent = result;
        }
    }, 100);
}

function yesOrNo() {
    const result = Math.random() < 0.5 ? 'YES' : 'NO';
    const yesnoResult = document.getElementById('yesnoResult');
    const color = result === 'YES' ? 'var(--success)' : 'var(--danger)';

    // Animate
    let flips = 0;
    const maxFlips = 8;
    const interval = setInterval(() => {
        yesnoResult.textContent = flips % 2 === 0 ? '✅' : '❌';
        flips++;

        if (flips >= maxFlips) {
            clearInterval(interval);
            yesnoResult.innerHTML = `<div style="color: ${color};">${result}</div>`;
        }
    }, 100);
}

function generateNumber() {
    const min = parseInt(document.getElementById('numMin').value);
    const max = parseInt(document.getElementById('numMax').value);

    if (isNaN(min) || isNaN(max)) {
        alert('Please enter valid numbers');
        return;
    }

    if (min >= max) {
        alert('Min must be less than Max');
        return;
    }

    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    const numberResult = document.getElementById('numberResult');

    // Animate
    let count = 0;
    const maxCount = 10;
    const interval = setInterval(() => {
        numberResult.textContent = Math.floor(Math.random() * (max - min + 1)) + min;
        count++;

        if (count >= maxCount) {
            clearInterval(interval);
            numberResult.textContent = result;
        }
    }, 80);
}

function pickFromList() {
    const text = document.getElementById('randomList').value;
    const items = text.split('\n').filter(item => item.trim().length > 0);

    if (items.length === 0) {
        alert('Please enter at least one item');
        return;
    }

    // Save list
    saveToLocalStorage('randomList', items);

    const result = items[Math.floor(Math.random() * items.length)];
    const listResult = document.getElementById('listResult');

    // Animate
    let count = 0;
    const maxCount = 8;
    const interval = setInterval(() => {
        listResult.textContent = items[Math.floor(Math.random() * items.length)];
        count++;

        if (count >= maxCount) {
            clearInterval(interval);
            listResult.innerHTML = `🎉 <span style="color: var(--primary);">${result}</span>`;
        }
    }, 100);
}
