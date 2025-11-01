// Main App Logic
let currentTool = null;

function showTool(toolName) {
    currentTool = toolName;

    // Hide homepage
    document.querySelector('main .tools-grid').classList.add('hidden');
    document.querySelector('main .ad-placeholder').classList.add('hidden');

    // Load tool
    loadToolPage(toolName);
}

function backToHome() {
    currentTool = null;

    // Show homepage
    document.querySelector('main .tools-grid').classList.remove('hidden');
    document.querySelector('main .ad-placeholder').classList.remove('hidden');

    // Remove tool page
    const toolPage = document.querySelector('.tool-page');
    if (toolPage) {
        toolPage.remove();
    }
}

function loadToolPage(toolName) {
    const main = document.querySelector('main');
    const toolPage = document.createElement('div');
    toolPage.className = 'tool-page active';

    // Load the appropriate tool
    switch(toolName) {
        case 'wheel':
            toolPage.innerHTML = createWheelTool();
            break;
        case 'random':
            toolPage.innerHTML = createRandomTool();
            break;
        case 'teams':
            toolPage.innerHTML = createTeamsTool();
            break;
        case 'countdown':
            toolPage.innerHTML = createCountdownTool();
            break;
        case 'colors':
            toolPage.innerHTML = createColorsTool();
            break;
        case 'pomodoro':
            toolPage.innerHTML = createPomodoroTool();
            break;
        case 'poll':
            toolPage.innerHTML = createPollTool();
            break;
        case 'encode':
            toolPage.innerHTML = createEncodeTool();
            break;
        case 'santa':
            toolPage.innerHTML = createSantaTool();
            break;
    }

    main.appendChild(toolPage);

    // Initialize tool-specific functionality
    initializeTool(toolName);
}

function initializeTool(toolName) {
    switch(toolName) {
        case 'wheel':
            initWheel();
            break;
        case 'random':
            initRandom();
            break;
        case 'teams':
            initTeams();
            break;
        case 'countdown':
            initCountdown();
            break;
        case 'colors':
            initColors();
            break;
        case 'pomodoro':
            initPomodoro();
            break;
        case 'poll':
            initPoll();
            break;
        case 'encode':
            initEncode();
            break;
        case 'santa':
            initSanta();
            break;
    }
}

// Utility function to save to localStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save to localStorage', e);
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Failed to load from localStorage', e);
        return null;
    }
}
