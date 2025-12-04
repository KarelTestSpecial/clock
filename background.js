const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';
let clockWindowId = null;

// --- Window Management ---

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
    const newWindow = await chrome.windows.create({
      url: chrome.runtime.getURL("clock_window.html"),
      type: "popup",
      width: windowWidth,
      height: windowHeight,
      left: Math.max(0, screenWidth - windowWidth - 20),
      top: Math.max(0, screenHeight - windowHeight - 20),
      focused: true,
    });
    clockWindowId = newWindow.id;
    return newWindow;
  } catch (error) {
    return null;
  }
}

chrome.action.onClicked.addListener(async () => {
    if (clockWindowId) {
        try {
            // Check if the window still exists before trying to remove it
            await chrome.windows.get(clockWindowId);
            chrome.windows.remove(clockWindowId);
            clockWindowId = null; // Assume it will be closed
        } catch (e) {
            // Window didn't exist, so create a new one
            clockWindowId = null; // Reset the stale ID
            await createClockWindow();
        }
    } else {
        await createClockWindow();
    }
});

chrome.windows.onRemoved.addListener((removedWindowId) => {
    if (removedWindowId === clockWindowId) {
        clockWindowId = null;
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
    let windowExists = false;
    if (clockWindowId) {
        try {
            await chrome.windows.get(clockWindowId);
            windowExists = true;
        } catch (e) {
            clockWindowId = null; // Stale ID
        }
    }

    if (!windowExists) {
        await createClockWindow(); // This will set the new clockWindowId
    }

    if (clockWindowId) {
        await chrome.windows.update(clockWindowId, { focused: true });
        // The window will have exactly one tab, which is the clock.
        const [clockTab] = await chrome.tabs.query({ windowId: clockWindowId });
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
