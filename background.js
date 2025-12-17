const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';

// --- Dynamic Icon ---
async function drawTimeIcon() {
    const { iconColor } = await chrome.storage.local.get({ iconColor: '#FFFFFF' });
    const canvas = new OffscreenCanvas(128, 128);
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Settings
    const centerX = 64;
    const centerY = 64;
    const radius = 60;

    // Background
    ctx.fillStyle = '#000000'; // Black background
    ctx.fillRect(0, 0, 128, 128);

    // Time Calculation
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Angles (subtract PI/2 to start at 12 o'clock)
    const minuteAngle = (minutes / 60) * 2 * Math.PI - Math.PI / 2;
    const hourAngle = ((hours % 12 + minutes / 60) / 12) * 2 * Math.PI - Math.PI / 2;

    // Draw Hour Hand
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + Math.cos(hourAngle) * (radius * 0.6),
        centerY + Math.sin(hourAngle) * (radius * 0.6)
    );
    ctx.strokeStyle = iconColor;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw Minute Hand
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + Math.cos(minuteAngle) * (radius * 0.85),
        centerY + Math.sin(minuteAngle) * (radius * 0.85)
    );
    ctx.strokeStyle = iconColor;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center Dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = iconColor;
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, 128, 128);
    chrome.action.setIcon({ imageData: imageData });
}

// Update icon every minute using alarms for reliability
chrome.alarms.create('update-icon', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'update-icon') {
        drawTimeIcon();
    }
});

// Initial draw
setTimeout(drawTimeIcon, 100);


// --- Window Management ---

async function findClockWindow() {
    const windows = await chrome.windows.getAll({ populate: true });
    const clockWindowUrl = chrome.runtime.getURL("clock_window.html");
    for (const window of windows) {
        if (window.tabs && window.tabs.some(tab => tab.url === clockWindowUrl)) {
            return window;
        }
    }
    return null;
}

async function createClockWindow() {
    const defaultWidth = 320;
    const defaultHeight = 220;
    const { windowWidth, windowHeight } = await chrome.storage.local.get({ windowWidth: defaultWidth, windowHeight: defaultHeight });

    const screenInfo = await chrome.system.display.getInfo();
    const primaryDisplay = screenInfo.find(display => display.isPrimary) || screenInfo[0];
    if (!primaryDisplay) { return null; }
    const screenWidth = primaryDisplay.bounds.width;
    const screenHeight = primaryDisplay.bounds.height;

    try {
        return await chrome.windows.create({
            url: chrome.runtime.getURL("clock_window.html"),
            type: "popup",
            width: windowWidth,
            height: windowHeight,
            left: Math.max(0, screenWidth - windowWidth - 20),
            top: Math.max(0, screenHeight - windowHeight - 20),
            focused: true,
        });
    } catch (error) {
        return null;
    }
}

chrome.action.onClicked.addListener(async () => {
    const existingWindow = await findClockWindow();
    if (existingWindow) {
        try {
            await chrome.windows.remove(existingWindow.id);
        } catch (e) {
            // Ignore error if window was already closed.
        }
    } else {
        await createClockWindow();
    }
});


// --- Alarm Functionality ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'set-alarm') {
        chrome.alarms.create(request.alarmName, { when: request.when });
        sendResponse({ status: "Alarm set" });
    } else if (request.action === 'clear-alarm') {
        chrome.alarms.clear(request.alarmName);
        sendResponse({ status: "Alarm cleared" });
    } else if (request.action === 'stop-alarm-sound') {
        stopSoundOffscreen();
    }
    return false;
});


chrome.alarms.onAlarm.addListener(triggerAlarmEffects);

async function triggerAlarmEffects(alarm) {
    if (alarm.name === 'update-icon') return;
    const alarmName = alarm.name;

    // 1. Bring clock window to front and show visual indicator
    const alarmSettingsKey = alarmName === 'alarm-1' ? 'alarm1Settings' : 'alarm2Settings';
    const { [alarmSettingsKey]: settings } = await chrome.storage.local.get(alarmSettingsKey);

    let windowToFocus = await findClockWindow();
    if (!windowToFocus) {
        windowToFocus = await createClockWindow();
    }
    if (windowToFocus) {
        await chrome.windows.update(windowToFocus.id, { focused: true });
        const tabs = await chrome.tabs.query({ windowId: windowToFocus.id });
        const clockTab = tabs.find(tab => tab.url.includes("clock_window.html"));
        if (clockTab) {
            chrome.tabs.sendMessage(clockTab.id, {
                action: 'alarm-triggered',
                duration: settings ? settings.duration : 5
            });
        }
    }

    // 2. Play sound via offscreen document
    const alarmSettingsKey = alarmName === 'alarm-1' ? 'alarm1Settings' : 'alarm2Settings';
    const { [alarmSettingsKey]: settings } = await chrome.storage.local.get(alarmSettingsKey);

    if (settings && settings.enabled) {
        await playSoundOffscreen(settings.sound, settings.duration);
    }
}


// --- Offscreen Document Audio Playback ---
let creatingOffscreenDocument = null;

async function stopSoundOffscreen() {
    if (await hasOffscreenDocument(OFFSCREEN_DOCUMENT_PATH)) {
        chrome.runtime.sendMessage({
            target: 'offscreen',
            action: 'stop-alarm-sound'
        });
    }
}

async function hasOffscreenDocument(path) {
    const offscreenUrl = chrome.runtime.getURL(path);
    const matchedClients = await clients.matchAll();
    return matchedClients.some(c => c.url === offscreenUrl);
}

async function playSoundOffscreen(sound, duration) {
    if (await hasOffscreenDocument(OFFSCREEN_DOCUMENT_PATH)) {
        chrome.runtime.sendMessage({
            target: 'offscreen',
            action: 'play-alarm-sound',
            sound: sound,
            duration: duration
        });
        return;
    }

    if (creatingOffscreenDocument) {
        await creatingOffscreenDocument;
    } else {
        creatingOffscreenDocument = new Promise((resolve, reject) => {
            const readyListener = (message) => {
                if (message.action === 'offscreen-ready') {
                    chrome.runtime.onMessage.removeListener(readyListener);
                    resolve();
                }
            };
            chrome.runtime.onMessage.addListener(readyListener);
            chrome.offscreen.createDocument({
                url: OFFSCREEN_DOCUMENT_PATH,
                reasons: ['AUDIO_PLAYBACK'],
                justification: 'To play alarm sounds reliably in the background.',
            }).catch(reject);
        });

        try {
            await creatingOffscreenDocument;
        } finally {
            creatingOffscreenDocument = null;
        }
    }

    chrome.runtime.sendMessage({
        target: 'offscreen',
        action: 'play-alarm-sound',
        sound: sound,
        duration: duration
    });
}
