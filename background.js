const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';

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
    }
    return false;
});


chrome.alarms.onAlarm.addListener(triggerAlarmEffects);

async function triggerAlarmEffects(alarm) {
    const alarmName = alarm.name;

    // 1. Bring clock window to front and show visual indicator
    let windowToFocus = await findClockWindow();
    if (!windowToFocus) {
        windowToFocus = await createClockWindow();
    }
    if (windowToFocus) {
        await chrome.windows.update(windowToFocus.id, { focused: true });
        const tabs = await chrome.tabs.query({ windowId: windowToFocus.id });
        const clockTab = tabs.find(tab => tab.url.includes("clock_window.html"));
        if (clockTab) {
             chrome.tabs.sendMessage(clockTab.id, { action: 'alarm-triggered' });
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
