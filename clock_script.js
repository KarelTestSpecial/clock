
// Globale DOM Element Referenties (na DOMContentLoaded)
let tijdElement, datumElement, toggleSecondenKnop, toonInstellingenKnop, instellingenPaneel, batterijStatusElement, toggleBatterijKnop, toggleDagNaamKnop, toggleJaarKnop, stopAlarmKnop;
let bewaarFavorietKnop, herstelStandaardKnop, herstelFavorietKnop, downloadNotepadKnop, toggleContextMenuKnop, toggleNotepadAddPositionKnop;
let fontTijdInput, grootteTijdInput, weergaveGrootteTijd, kleurTijdInput, paddingOnderTijdInput, weergavePaddingOnderTijd, paddingBovenTijdInput, weergavePaddingBovenTijd;
let fontDatumInput, grootteDatumInput, weergaveGrootteDatum, kleurDatumInput, paddingOnderDatumInput, weergavePaddingOnderDatum;
let fontBatterijInput, kleurBatterijInput, grootteBatterijInput, weergaveGrootteBatterij, breedteBatterijInput, weergaveBreedteBatterij, paddingOnderBatterijInput, weergavePaddingOnderBatterij;
let achtergrondKleurInput, achtergrondElementenKleurInput, klokContainer, notepadContainer, notepadArea, toggleNotepadKnop, iconColorPicker, kleurNotepadInput;
let notepadTextAlignSelect, fontNotepadInput, grootteNotepadInput, weergaveGrootteNotepad, quickAlignBtn;
let toggleDatumKnop, startScreensaverKnop, statusMessageElement, klokPositieSelect;
let tabsList, addNoteBtn, storageText, storageBarFill;

// Globale status- en timer-variabelen
let toonSeconden, toonBatterij, showDayOfWeek, showYear, currentLocale, isContextMenuEnabled, addAtTop;
let isScreensaverActive = false;
let screensaverAnimationTimeout = null;
let statusMessageTimeoutId = null;
let windowResizeTimer = null;
let currentAlarmAudio = null;
let clockInterval = null;
let notes = [];
let activeNoteId = null;

// Standaardinstellingen
const standaardInstellingen = {
    toonSeconden: false,
    toonBatterij: true,
    showDayOfWeek: true,
    showYear: false,
    kleurNotepad: '#FFFFFF',
    fontTijd: 'Verdana, sans-serif',
    grootteTijd: 3.2,
    paddingOnderTijd: 0,
    paddingBovenTijd: -3,
    kleurTijd: '#39FF14',
    fontDatum: 'Arial, sans-serif',
    grootteDatum: 1.2,
    paddingOnderDatum: 0,
    kleurDatum: '#B0B0B0',
    fontBatterij: 'Arial, sans-serif',
    grootteBatterij: 1.8,
    breedteBatterij: 1.6,
    paddingOnderBatterij: 0,
    kleurBatterij: '#B0B0B0',
    achtergrondElementenKleur: '#282828',
    achtergrondKleur: '#000000',
    klokPositie: 'top-center',
    isDatumVisible: true,
    notes: [
        { id: 'default', title: 'Note 1', content: '' }
    ],
    activeNoteId: 'default',
    isNotepadVisible: false,
    isContextMenuEnabled: true,
    addAtTop: true,
    notepadTextAlign: 'center',
    fontNotepad: 'Arial, sans-serif',
    grootteNotepad: 1.5,
    alarm1Settings: {
        enabled: false,
        time: '08:00',
        sound: 'digital',
        duration: 10
    },
    alarm2Settings: {
        enabled: false,
        time: '18:00',
        sound: 'bell',
        duration: 5
    }
};

function initializeDOMReferences() {
    tijdElement = document.getElementById('tijd');
    datumElement = document.getElementById('datum');
    batterijStatusElement = document.getElementById('batterij-status');
    klokContainer = document.getElementById('klok-container');
    instellingenPaneel = document.querySelector('.instellingen-paneel');
    statusMessageElement = document.getElementById('status-message');

    // Knoppen
    toggleSecondenKnop = document.getElementById('toggle-seconden');
    toggleDatumKnop = document.getElementById('toggle-datum');
    toggleDagNaamKnop = document.getElementById('toggle-dag-naam');
    toggleJaarKnop = document.getElementById('toggle-jaar');
    toggleNotepadKnop = document.getElementById('toggle-notepad');
    toggleBatterijKnop = document.getElementById('toggle-batterij');
    toonInstellingenKnop = document.getElementById('toon-instellingen');
    startScreensaverKnop = document.getElementById('start-screensaver');
    stopAlarmKnop = document.getElementById('stop-alarm');
    bewaarFavorietKnop = document.getElementById('bewaar-favoriet');
    herstelStandaardKnop = document.getElementById('herstel-standaard');
    herstelFavorietKnop = document.getElementById('herstel-favoriet');
    downloadNotepadKnop = document.getElementById('download-notepad');
    toggleContextMenuKnop = document.getElementById('toggle-context-menu');
    toggleNotepadAddPositionKnop = document.getElementById('toggle-notepad-add-position');

    // Instellingen
    fontTijdInput = document.getElementById('font-tijd');
    grootteTijdInput = document.getElementById('grootte-tijd');
    weergaveGrootteTijd = document.getElementById('weergave-grootte-tijd');
    paddingOnderTijdInput = document.getElementById('padding-onder-tijd');
    weergavePaddingOnderTijd = document.getElementById('weergave-padding-onder-tijd');
    paddingBovenTijdInput = document.getElementById('padding-boven-tijd');
    weergavePaddingBovenTijd = document.getElementById('weergave-padding-boven-tijd');
    kleurTijdInput = document.getElementById('kleur-tijd');
    fontDatumInput = document.getElementById('font-datum');
    grootteDatumInput = document.getElementById('grootte-datum');
    weergaveGrootteDatum = document.getElementById('weergave-grootte-datum');
    paddingOnderDatumInput = document.getElementById('padding-onder-datum');
    weergavePaddingOnderDatum = document.getElementById('weergave-padding-onder-datum');
    kleurDatumInput = document.getElementById('kleur-datum');
    fontBatterijInput = document.getElementById('font-batterij');
    kleurBatterijInput = document.getElementById('kleur-batterij');
    grootteBatterijInput = document.getElementById('grootte-batterij');
    weergaveGrootteBatterij = document.getElementById('weergave-grootte-batterij');
    breedteBatterijInput = document.getElementById('breedte-batterij');
    weergaveBreedteBatterij = document.getElementById('weergave-breedte-batterij');
    paddingOnderBatterijInput = document.getElementById('padding-onder-batterij');
    weergavePaddingOnderBatterij = document.getElementById('weergave-padding-onder-batterij');
    achtergrondKleurInput = document.getElementById('achtergrond-kleur');
    achtergrondElementenKleurInput = document.getElementById('achtergrond-elementen-kleur');
    klokPositieSelect = document.getElementById('klok-positie-select');
    notepadContainer = document.getElementById('notepad-container');
    notepadArea = document.getElementById('notepad-area');
    notepadTextAlignSelect = document.getElementById('notepad-text-align');
    fontNotepadInput = document.getElementById('font-notepad');
    grootteNotepadInput = document.getElementById('grootte-notepad');
    weergaveGrootteNotepad = document.getElementById('weergave-grootte-notepad');
    iconColorPicker = document.getElementById('icon-color-picker');
    kleurNotepadInput = document.getElementById('kleur-notepad');
    tabsList = document.getElementById('tabs-list');
    addNoteBtn = document.getElementById('add-note-btn');
    storageText = document.getElementById('storage-text');
    storageBarFill = document.getElementById('storage-bar-fill');
    quickAlignBtn = document.getElementById('quick-align-btn');

    // Alarmen
    for (let i = 1; i <= 2; i++) {
        flatpickr(`#alarm-tijd-${i}`, {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            onChange: (selectedDates, dateStr) => {
                saveAlarmSetting(i, 'time', dateStr);
            }
        });

        document.getElementById(`alarm-toggle-${i}`).addEventListener('change', (e) => saveAlarmSetting(i, 'enabled', e.target.checked));
        document.getElementById(`alarm-geluid-${i}`).addEventListener('change', (e) => saveAlarmSetting(i, 'sound', e.target.value));
        document.getElementById(`alarm-duur-${i}`).addEventListener('change', (e) => saveAlarmSetting(i, 'duration', parseInt(e.target.value)));
    }
}

function updateToggleButtonTexts() {
    if (toggleContextMenuKnop) {
        toggleContextMenuKnop.textContent = isContextMenuEnabled ?
            chrome.i18n.getMessage('contextMenuOnText') :
            chrome.i18n.getMessage('contextMenuOffText');
    }
    if (toggleNotepadAddPositionKnop) {
        toggleNotepadAddPositionKnop.textContent = addAtTop ?
            chrome.i18n.getMessage('notepadPositionTopText') :
            chrome.i18n.getMessage('notepadPositionBottomText');
    }
}

function applyTranslations() {
    currentLocale = chrome.i18n.getMessage('dateLocale');
    document.documentElement.lang = chrome.i18n.getUILanguage().split('-')[0];
    document.getElementById('htmlPageTitle').textContent = chrome.i18n.getMessage('htmlPageTitle');
    toggleSecondenKnop.textContent = chrome.i18n.getMessage('toggleSecondsText');
    if (toggleBatterijKnop) toggleBatterijKnop.textContent = chrome.i18n.getMessage('toggleBatteryText');
    toggleDatumKnop.textContent = chrome.i18n.getMessage('toggleDateText');
    toggleDagNaamKnop.textContent = chrome.i18n.getMessage('toggleDayOfWeekText');
    if (toggleJaarKnop) toggleJaarKnop.textContent = chrome.i18n.getMessage('toggleYearText');
    toggleNotepadKnop.textContent = chrome.i18n.getMessage('toggleNotepadText');
    updateToggleButtonTexts();
    if (document.getElementById('lblContextMenuGroup')) document.getElementById('lblContextMenuGroup').textContent = chrome.i18n.getMessage('lblContextMenuGroup');
    if (document.getElementById('lblContextMenu')) document.getElementById('lblContextMenu').textContent = chrome.i18n.getMessage('lblContextMenu');
    if (document.getElementById('lblNotepadAddPosition')) document.getElementById('lblNotepadAddPosition').textContent = chrome.i18n.getMessage('lblNotepadAddPosition');
    toonInstellingenKnop.textContent = chrome.i18n.getMessage('toggleSettingsText');
    startScreensaverKnop.textContent = chrome.i18n.getMessage('startScreensaverText');
    stopAlarmKnop.textContent = chrome.i18n.getMessage('stopAlarmText');
    document.getElementById('settingsTitleText').textContent = chrome.i18n.getMessage('settingsTitleText');
    document.getElementById('timeLabel').textContent = chrome.i18n.getMessage('timeLabel');
    document.getElementById('lblFontTijd').textContent = chrome.i18n.getMessage('timeFontLabel');
    document.getElementById('lblGrootteTijdText').textContent = chrome.i18n.getMessage('timeSizeLabelText');
    document.getElementById('lblPaddingOnderTijdText').textContent = chrome.i18n.getMessage('timePaddingLabel');
    if (document.getElementById('lblPaddingBovenTijdText')) {
        document.getElementById('lblPaddingBovenTijdText').textContent = chrome.i18n.getMessage('timePaddingAboveLabel');
    }
    document.getElementById('lblKleurTijd').textContent = chrome.i18n.getMessage('timeColorLabel');
    document.getElementById('dateLabel').textContent = chrome.i18n.getMessage('dateLabel');
    document.getElementById('lblFontDatum').textContent = chrome.i18n.getMessage('dateFontLabel');
    document.getElementById('lblGrootteDatumText').textContent = chrome.i18n.getMessage('dateSizeLabelText');
    document.getElementById('lblPaddingOnderDatumText').textContent = chrome.i18n.getMessage('datePaddingLabel');
    document.getElementById('lblKleurDatum').textContent = chrome.i18n.getMessage('dateColorLabel');
    document.getElementById('batteryLabel').textContent = chrome.i18n.getMessage('batteryLabel');
    document.getElementById('lblFontBatterij').textContent = chrome.i18n.getMessage('batteryFontLabel');
    document.getElementById('lblKleurBatterij').textContent = chrome.i18n.getMessage('batteryColorLabel');
    document.getElementById('lblGrootteBatterijText').textContent = chrome.i18n.getMessage('batterySizeLabelText');
    document.getElementById('lblBreedteBatterijText').textContent = chrome.i18n.getMessage('batteryWidthLabelText');
    document.getElementById('lblPaddingOnderBatterijText').textContent = chrome.i18n.getMessage('batteryPaddingLabel');
    document.getElementById('notepadLabel').textContent = chrome.i18n.getMessage('notepadLabel');
    document.getElementById('lblAchtergrondElementen').textContent = chrome.i18n.getMessage('backgroundElementsColorLabel');
    document.getElementById('lblAchtergrondKleur').textContent = chrome.i18n.getMessage('backgroundColorLabel');
    document.getElementById('lblNotepadTextAlign').textContent = chrome.i18n.getMessage('notepadTextAlignLabel');
    document.getElementById('lblKleurNotepad').textContent = chrome.i18n.getMessage('notepadColorLabel');
    document.getElementById('lblFontNotepad').textContent = chrome.i18n.getMessage('notepadFontLabel');
    document.getElementById('lblGrootteNotepadText').textContent = chrome.i18n.getMessage('notepadSizeLabelText');
    document.getElementById('optTextAlignLeft').textContent = chrome.i18n.getMessage('textAlignLeft');
    document.getElementById('optTextAlignCenter').textContent = chrome.i18n.getMessage('textAlignCenter');
    document.getElementById('optTextAlignRight').textContent = chrome.i18n.getMessage('textAlignRight');
    
    if (document.getElementById('lblKlokPositie')) document.getElementById('lblKlokPositie').textContent = chrome.i18n.getMessage('clockPositionLabel');
    if (document.getElementById('optPosTopLeft')) document.getElementById('optPosTopLeft').textContent = chrome.i18n.getMessage('posTopLeft');
    if (document.getElementById('optPosTopCenter')) document.getElementById('optPosTopCenter').textContent = chrome.i18n.getMessage('posTopCenter');
    if (document.getElementById('optPosTopRight')) document.getElementById('optPosTopRight').textContent = chrome.i18n.getMessage('posTopRight');
    if (document.getElementById('optPosCenterCenter')) document.getElementById('optPosCenterCenter').textContent = chrome.i18n.getMessage('posCenterCenter');
    if (document.getElementById('optPosBottomLeft')) document.getElementById('optPosBottomLeft').textContent = chrome.i18n.getMessage('posBottomLeft');
    if (document.getElementById('optPosBottomCenter')) document.getElementById('optPosBottomCenter').textContent = chrome.i18n.getMessage('posBottomCenter');
    if (document.getElementById('optPosBottomRight')) document.getElementById('optPosBottomRight').textContent = chrome.i18n.getMessage('posBottomRight');
    document.getElementById('lblIconColor').textContent = chrome.i18n.getMessage('iconColorLabel');
    bewaarFavorietKnop.textContent = chrome.i18n.getMessage('saveFavoritesText');
    herstelStandaardKnop.textContent = chrome.i18n.getMessage('defaultSettingsText');
    herstelFavorietKnop.textContent = chrome.i18n.getMessage('restoreFavoritesText');
    if (downloadNotepadKnop) downloadNotepadKnop.textContent = chrome.i18n.getMessage('downloadNotepadText');
    if (notepadArea) notepadArea.placeholder = chrome.i18n.getMessage('notepadPlaceholder');
}

function setKlokLayout(positie) {
    document.body.className = ''; // Clear all classes
    if (positie) {
        document.body.classList.add(`position-${positie}`);
    } else {
        document.body.classList.add(`position-${standaardInstellingen.klokPositie}`);
    }
}



async function updateFlatpickrTheme() {
    // Check system preference for dark mode
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const lightThemeLink = document.getElementById('flatpickr-light-theme');
    const darkThemeLink = document.getElementById('flatpickr-dark-theme');

    if (lightThemeLink && darkThemeLink) {
        if (isDarkMode) {
            lightThemeLink.disabled = true;
            darkThemeLink.disabled = false;
        } else {
            lightThemeLink.disabled = false;
            darkThemeLink.disabled = true;
        }
    }
}

function applyAllSettings(settings) {
    document.body.style.backgroundColor = settings.achtergrondKleur;
    updateFlatpickrTheme(); // Update Flatpickr theme based on the applied background color
    toonSeconden = settings.toonSeconden;
    toonBatterij = settings.toonBatterij;
    showDayOfWeek = settings.showDayOfWeek;
    showYear = settings.showYear;

    if (tijdElement) {
        tijdElement.style.fontFamily = settings.fontTijd;
        tijdElement.style.color = settings.kleurTijd;
        tijdElement.style.fontSize = settings.grootteTijd + 'em';
        tijdElement.style.paddingBottom = settings.paddingOnderTijd + 'px';
        tijdElement.style.marginTop = settings.paddingBovenTijd + 'px';
    }
    if (datumElement) {
        datumElement.style.fontFamily = settings.fontDatum;
        datumElement.style.color = settings.kleurDatum;
        datumElement.style.fontSize = settings.grootteDatum + 'em';
        datumElement.style.paddingBottom = settings.paddingOnderDatum + 'px';
    }
    if (batterijStatusElement) {
        batterijStatusElement.style.fontFamily = settings.fontBatterij;
        batterijStatusElement.style.color = settings.kleurBatterij;
        batterijStatusElement.style.fontSize = settings.grootteBatterij + 'em';
        batterijStatusElement.style.paddingBottom = settings.paddingOnderBatterij + 'px';
        batterijStatusElement.style.transform = `scaleX(${settings.breedteBatterij})`;
    }
    setKlokLayout(settings.klokPositie);

    if (fontTijdInput) fontTijdInput.value = settings.fontTijd;
    if (grootteTijdInput) grootteTijdInput.value = settings.grootteTijd;
    if (weergaveGrootteTijd) weergaveGrootteTijd.textContent = settings.grootteTijd + 'em';
    if (paddingOnderTijdInput) paddingOnderTijdInput.value = settings.paddingOnderTijd;
    if (weergavePaddingOnderTijd) weergavePaddingOnderTijd.textContent = settings.paddingOnderTijd + 'px';
    if (paddingBovenTijdInput) paddingBovenTijdInput.value = settings.paddingBovenTijd;
    if (weergavePaddingBovenTijd) weergavePaddingBovenTijd.textContent = settings.paddingBovenTijd + 'px';
    if (kleurTijdInput) kleurTijdInput.value = settings.kleurTijd;
    if (fontDatumInput) fontDatumInput.value = settings.fontDatum;
    if (grootteDatumInput) grootteDatumInput.value = settings.grootteDatum;
    if (weergaveGrootteDatum) weergaveGrootteDatum.textContent = settings.grootteDatum + 'em';
    if (paddingOnderDatumInput) paddingOnderDatumInput.value = settings.paddingOnderDatum;
    if (weergavePaddingOnderDatum) weergavePaddingOnderDatum.textContent = settings.paddingOnderDatum + 'px';
    if (kleurDatumInput) kleurDatumInput.value = settings.kleurDatum;
    if (fontBatterijInput) fontBatterijInput.value = settings.fontBatterij;
    if (kleurBatterijInput) kleurBatterijInput.value = settings.kleurBatterij;
    if (grootteBatterijInput) grootteBatterijInput.value = settings.grootteBatterij;
    if (weergaveGrootteBatterij) weergaveGrootteBatterij.textContent = settings.grootteBatterij + 'em';
    if (breedteBatterijInput) breedteBatterijInput.value = settings.breedteBatterij;
    if (weergaveBreedteBatterij) weergaveBreedteBatterij.textContent = settings.breedteBatterij;
    if (paddingOnderBatterijInput) paddingOnderBatterijInput.value = settings.paddingOnderBatterij;
    if (weergavePaddingOnderBatterij) weergavePaddingOnderBatterij.textContent = settings.paddingOnderBatterij + 'px';
    if (achtergrondKleurInput) achtergrondKleurInput.value = settings.achtergrondKleur;
    if (achtergrondElementenKleurInput) achtergrondElementenKleurInput.value = settings.achtergrondElementenKleur;
    if (notepadArea) {
        notepadArea.style.backgroundColor = settings.achtergrondElementenKleur;
        notepadArea.style.color = settings.kleurNotepad;
    }
    if (klokPositieSelect) klokPositieSelect.value = settings.klokPositie;
    if (kleurNotepadInput) kleurNotepadInput.value = settings.kleurNotepad;
}

function applyNotepadSettings(settings) {
    if (notepadArea) {
        const activeNote = (settings.notes || notes).find(n => n.id === (settings.activeNoteId || activeNoteId));
        notepadArea.value = activeNote ? activeNote.content : '';
        notepadArea.style.textAlign = settings.notepadTextAlign;
        notepadArea.style.fontFamily = settings.fontNotepad;
        notepadArea.style.fontSize = settings.grootteNotepad + 'em';
        updateQuickAlignButtonIcon(settings.notepadTextAlign);
    }
    if (notepadTextAlignSelect) notepadTextAlignSelect.value = settings.notepadTextAlign;
    if (fontNotepadInput) fontNotepadInput.value = settings.fontNotepad;
    if (grootteNotepadInput) grootteNotepadInput.value = settings.grootteNotepad;
    if (weergaveGrootteNotepad) weergaveGrootteNotepad.textContent = settings.grootteNotepad + 'em';
    renderTabs();
}

function updateQuickAlignButtonIcon(alignment) {
    if (!quickAlignBtn) return;
    const icons = {
        'left': '⇐',
        'center': '≡',
        'right': '⇒'
    };
    quickAlignBtn.textContent = icons[alignment] || '≡';
}

function applyDatumVisibility(isVisible) {
    if (datumElement) {
        datumElement.style.display = isVisible ? 'block' : 'none';
    }
}

async function laadInstellingen() {
    const opgeslagenInstellingen = await chrome.storage.local.get(standaardInstellingen);
    applyAllSettings(opgeslagenInstellingen);
    if (iconColorPicker) {
        chrome.storage.local.get('iconColor', (result) => {
            if (result.iconColor) {
                iconColorPicker.value = result.iconColor;
            }
        });
    }
    applyDatumVisibility(opgeslagenInstellingen.isDatumVisible);
    applyBatteryVisibility(opgeslagenInstellingen.toonBatterij);
    await migrateNotepadData(opgeslagenInstellingen);
    applyNotepadSettings(opgeslagenInstellingen);
    updateStorageUsage();
    isContextMenuEnabled = opgeslagenInstellingen.isContextMenuEnabled;
    addAtTop = opgeslagenInstellingen.addAtTop;
    updateToggleButtonTexts();
    for (let i = 1; i <= 2; i++) {
        const settings = opgeslagenInstellingen[`alarm${i}Settings`];
        const timeInput = document.getElementById(`alarm-tijd-${i}`);
        if (timeInput && timeInput._flatpickr) {
            timeInput._flatpickr.setDate(settings.time);
        }
        document.getElementById(`alarm-toggle-${i}`).checked = settings.enabled;
        document.getElementById(`alarm-geluid-${i}`).value = settings.sound;
        document.getElementById(`alarm-duur-${i}`).value = settings.duration;
    }

    await updateActualNotepadVisibility();
}

async function saveAlarmSetting(alarmNum, key, value) {
    const alarmSettingsKey = `alarm${alarmNum}Settings`;

    // Get existing settings from storage.
    const data = await chrome.storage.local.get(alarmSettingsKey);
    const existingSettings = data[alarmSettingsKey] || {};

    // Merge with defaults to ensure all keys are present.
    const completeSettings = { ...standaardInstellingen[alarmSettingsKey], ...existingSettings };

    // Apply the new value.
    const newSettings = { ...completeSettings, [key]: value };
    await chrome.storage.local.set({ [alarmSettingsKey]: newSettings });

    const alarmName = `alarm-${alarmNum}`;
    if (newSettings.enabled) {
        const [hours, minutes] = newSettings.time.split(':');
        const now = new Date();
        const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
        if (alarmTime <= now) {
            alarmTime.setDate(alarmTime.getDate() + 1);
        }
        chrome.runtime.sendMessage({ action: 'set-alarm', alarmName: alarmName, when: alarmTime.getTime() });
    } else {
        chrome.runtime.sendMessage({ action: 'clear-alarm', alarmName: alarmName });
    }
}

async function applyAndSaveSetting(key, value, element, styleProperty) {
    if (styleProperty) {
        let finalValue = value;
        if (key.startsWith('grootte')) {
            finalValue += 'em';
            const displayElementId = `weergave-${key.replace('grootte', 'grootte-').toLowerCase()}`;
            const displayElement = document.getElementById(displayElementId);
            if (displayElement) {
                displayElement.textContent = finalValue;
            }
        } else if (key.startsWith('padding')) {
            finalValue += 'px';
            if (key === 'paddingOnderTijd') weergavePaddingOnderTijd.textContent = finalValue;
            else if (key === 'paddingBovenTijd') weergavePaddingBovenTijd.textContent = finalValue;
            else if (key === 'paddingOnderDatum') weergavePaddingOnderDatum.textContent = finalValue;
            else if (key === 'paddingOnderBatterij') weergavePaddingOnderBatterij.textContent = finalValue;
        } else if (key === 'breedteBatterij') {
            finalValue = `scaleX(${value})`;
            if (weergaveBreedteBatterij) weergaveBreedteBatterij.textContent = value;
        }
        if (element) element.style[styleProperty] = finalValue;
    } else if (key === 'klokPositie') {
        setKlokLayout(value);
    }
    await chrome.storage.local.set({ [key]: value });
}

async function migrateNotepadData(opgeslagenInstellingen) {
    let changed = false;
    // Migrate old notepadContent to notes array
    if (opgeslagenInstellingen.notepadContent !== undefined && opgeslagenInstellingen.notepadContent !== '') {
        const oldContent = opgeslagenInstellingen.notepadContent;
        notes = [{ id: 'migrated', title: 'Note 1', content: oldContent }];
        activeNoteId = 'migrated';
        // Clear old content to avoid repeat migration
        await chrome.storage.local.remove('notepadContent');
        changed = true;
    } else {
        notes = opgeslagenInstellingen.notes || standaardInstellingen.notes;
        activeNoteId = opgeslagenInstellingen.activeNoteId || standaardInstellingen.activeNoteId;
    }

    // Ensure we have at least one note
    if (!notes || notes.length === 0) {
        notes = [{ id: 'default', title: 'Note 1', content: '' }];
        activeNoteId = 'default';
        changed = true;
    }

    // Ensure activeNoteId points to a valid note
    if (!notes.find(n => n.id === activeNoteId)) {
        activeNoteId = notes[0].id;
        changed = true;
    }

    if (changed) {
        await chrome.storage.local.set({ notes, activeNoteId });
    }
}

function renderTabs() {
    if (!tabsList) return;
    tabsList.innerHTML = '';
    notes.forEach(note => {
        const tab = document.createElement('div');
        tab.className = `notepad-tab${note.id === activeNoteId ? ' active' : ''}`;
        tab.dataset.id = note.id;

        const titleSpan = document.createElement('span');
        titleSpan.textContent = note.title || 'Untitled';
        tab.appendChild(titleSpan);

        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-tab';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.title = chrome.i18n.getMessage('deleteNoteTooltip') || 'Delete Note';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteNote(note.id);
        };
        tab.appendChild(deleteBtn);

        tab.onclick = () => switchNote(note.id);
        tab.ondblclick = () => renameNote(note.id);

        tabsList.appendChild(tab);
    });
}

async function switchNote(id) {
    if (id === activeNoteId) return;
    
    // Save current content first
    const currentNote = notes.find(n => n.id === activeNoteId);
    if (currentNote && notepadArea) {
        currentNote.content = notepadArea.value;
    }

    activeNoteId = id;
    const newNote = notes.find(n => n.id === activeNoteId);
    if (notepadArea) {
        notepadArea.value = newNote ? newNote.content : '';
    }

    renderTabs();
    await chrome.storage.local.set({ notes, activeNoteId });
    updateStorageUsage();
}

async function addNote() {
    const newId = Date.now().toString();
    const newNote = {
        id: newId,
        title: `Note ${notes.length + 1}`,
        content: ''
    };
    
    // Save current active note content
    const currentNote = notes.find(n => n.id === activeNoteId);
    if (currentNote && notepadArea) {
        currentNote.content = notepadArea.value;
    }

    notes.push(newNote);
    activeNoteId = newId;
    
    if (notepadArea) notepadArea.value = '';
    
    renderTabs();
    await chrome.storage.local.set({ notes, activeNoteId });
    updateStorageUsage();
}

async function deleteNote(id) {
    if (notes.length <= 1) {
        showStatusMessage(chrome.i18n.getMessage('errorCannotDeleteLastNote') || 'Cannot delete the last note.');
        return;
    }

    if (!confirm(chrome.i18n.getMessage('confirmDeleteNote') || 'Delete this note?')) return;

    notes = notes.filter(n => n.id !== id);
    if (activeNoteId === id) {
        activeNoteId = notes[0].id;
        if (notepadArea) notepadArea.value = notes[0].content;
    }

    renderTabs();
    await chrome.storage.local.set({ notes, activeNoteId });
    updateStorageUsage();
}

function renameNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    const newTitle = prompt(chrome.i18n.getMessage('promptRenameNote') || 'Enter new title:', note.title);
    if (newTitle !== null && newTitle.trim() !== '') {
        note.title = newTitle.trim();
        renderTabs();
        chrome.storage.local.set({ notes });
    }
}

async function updateStorageUsage() {
    if (!storageText || !storageBarFill) return;

    chrome.storage.local.getBytesInUse(null, (bytes) => {
        const quota = 5 * 1024 * 1024; // 5MB
        const percentage = (bytes / quota) * 100;
        const mbUsed = (bytes / (1024 * 1024)).toFixed(2);
        
        storageText.textContent = `${chrome.i18n.getMessage('storageUsedLabel') || 'Storage used'}: ${mbUsed}MB / 5.00MB`;
        storageBarFill.style.width = `${Math.min(percentage, 100)}%`;
        
        storageBarFill.classList.remove('warning', 'critical');
        if (percentage > 90) {
            storageBarFill.classList.add('critical');
            if (percentage >= 100) {
                showStatusMessage(chrome.i18n.getMessage('errorStorageFull') || 'Storage is full!');
            }
        } else if (percentage > 70) {
            storageBarFill.classList.add('warning');
        }
    });
}


async function updateKlok() {
    if (!chrome.runtime?.id) {
        if (clockInterval) clearInterval(clockInterval);
        return;
    }
    if (!tijdElement || !datumElement) return;
    if (toonBatterij) updateBatteryStatus();
    const nu = new Date();
    let uren = nu.getHours().toString().padStart(2, '0');
    let minuten = nu.getMinutes().toString().padStart(2, '0');
    let tijdString = `${uren}:${minuten}`;
    if (toonSeconden) {
        tijdString += `:${nu.getSeconds().toString().padStart(2, '0')}`;
    }
    tijdElement.textContent = tijdString;
    const optiesDatum = { month: 'long', day: 'numeric' };
    if (showDayOfWeek) {
        optiesDatum.weekday = 'long';
    }
    if (showYear) {
        optiesDatum.year = 'numeric';
    }
    datumElement.textContent = nu.toLocaleDateString(currentLocale || 'en-US', optiesDatum);
}

async function updateActualNotepadVisibility() {
    if (!chrome.runtime?.id) return;
    let { isNotepadVisible } = await chrome.storage.local.get({ isNotepadVisible: standaardInstellingen.isNotepadVisible });
    if (notepadContainer) {
        notepadContainer.classList.toggle('hidden', !isNotepadVisible);
        document.body.classList.toggle('notepad-open', isNotepadVisible);
    }
}

async function toggleUserPreferenceNotepad() {
    if (!chrome.runtime?.id) return;
    let { isNotepadVisible } = await chrome.storage.local.get('isNotepadVisible');
    const nieuweVoorkeur = isNotepadVisible === undefined ? !standaardInstellingen.isNotepadVisible : !isNotepadVisible;
    await chrome.storage.local.set({ isNotepadVisible: nieuweVoorkeur });
    await updateActualNotepadVisibility();
}

async function toggleDayOfWeek() {
    let { showDayOfWeek: currentShowDayOfWeek } = await chrome.storage.local.get('showDayOfWeek');
    showDayOfWeek = currentShowDayOfWeek === undefined ? !standaardInstellingen.showDayOfWeek : !currentShowDayOfWeek;
    await chrome.storage.local.set({ showDayOfWeek: showDayOfWeek });
    await updateKlok();
}

function toggleInstellingenPaneel() {
    if (instellingenPaneel) instellingenPaneel.classList.toggle('hidden');
}

async function saveNotepadContent() {
    if (notepadArea) {
        const currentNote = notes.find(n => n.id === activeNoteId);
        if (currentNote) {
            currentNote.content = notepadArea.value;
            try {
                await chrome.storage.local.set({ notes });
                updateStorageUsage();
            } catch (e) {
                console.error("Storage error:", e);
                showStatusMessage(chrome.i18n.getMessage('errorStorageFull') || 'Storage limit reached!');
            }
        }
    }
}

function showStatusMessage(message) {
    if (!statusMessageElement) return;
    if (statusMessageTimeoutId) clearTimeout(statusMessageTimeoutId);
    statusMessageElement.textContent = message;
    statusMessageElement.classList.add('visible');
    statusMessageTimeoutId = setTimeout(() => {
        statusMessageElement.classList.remove('visible');
    }, 2500);
}

async function bewaarFavorieteInstellingen() {
    const { isDatumVisible, showYear } = await chrome.storage.local.get({ isDatumVisible: standaardInstellingen.isDatumVisible, showYear: standaardInstellingen.showYear });
    const huidigeInstellingen = {
        toonSeconden: toonSeconden,
        isDatumVisible: isDatumVisible,
        showYear: showYear,
        fontTijd: fontTijdInput.value,
        grootteTijd: parseFloat(grootteTijdInput.value),
        paddingOnderTijd: parseInt(paddingOnderTijdInput.value),
        paddingBovenTijd: parseInt(paddingBovenTijdInput.value),
        kleurTijd: kleurTijdInput.value,
        fontDatum: fontDatumInput.value,
        grootteDatum: parseFloat(grootteDatumInput.value),
        paddingOnderDatum: parseInt(paddingOnderDatumInput.value),
        kleurDatum: kleurDatumInput.value,
        fontBatterij: fontBatterijInput.value,
        kleurBatterij: kleurBatterijInput.value,
        grootteBatterij: parseFloat(grootteBatterijInput.value),
        breedteBatterij: parseFloat(breedteBatterijInput.value),
        paddingOnderBatterij: parseInt(paddingOnderBatterijInput.value),
        achtergrondElementenKleur: achtergrondElementenKleurInput.value,
        achtergrondKleur: achtergrondKleurInput.value,
        klokPositie: klokPositieSelect.value,
        notepadTextAlign: notepadTextAlignSelect.value,
        fontNotepad: fontNotepadInput.value,
        grootteNotepad: parseFloat(grootteNotepadInput.value),
        kleurNotepad: kleurNotepadInput.value,
        alarm1Settings: {
            enabled: document.getElementById('alarm-toggle-1').checked,
            time: document.getElementById('alarm-tijd-1').value,
            sound: document.getElementById('alarm-geluid-1').value,
            duration: parseInt(document.getElementById('alarm-duur-1').value)
        },
        alarm2Settings: {
            enabled: document.getElementById('alarm-toggle-2').checked,
            time: document.getElementById('alarm-tijd-2').value,
            sound: document.getElementById('alarm-geluid-2').value,
            duration: parseInt(document.getElementById('alarm-duur-2').value)
        }
    };
    await chrome.storage.local.set({ favorieteInstellingen: huidigeInstellingen });
    showStatusMessage(chrome.i18n.getMessage('alertFavoriteSaved'));
}

async function herstelStandaardInstellingen() {
    applyAllSettings(standaardInstellingen);
    applyDatumVisibility(standaardInstellingen.isDatumVisible);
    
    // Resetting notes to default while keeping current ones in memory if user cancels? 
    // Usually "Default" means reset everything. But we should be careful with notes.
    if (confirm(chrome.i18n.getMessage('confirmResetAll') || 'Reset all settings and notes to default?')) {
        notes = [...standaardInstellingen.notes];
        activeNoteId = standaardInstellingen.activeNoteId;
        applyNotepadSettings(standaardInstellingen);
        await chrome.storage.local.set({ ...standaardInstellingen });
    }
    await laadInstellingen();
    await updateActualNotepadVisibility();
}

async function herstelFavorieteInstellingen() {
    const { favorieteInstellingen } = await chrome.storage.local.get('favorieteInstellingen');
    if (favorieteInstellingen) {
        // We restore visual settings, but keep existing notes
        const settingsToApply = { ...standaardInstellingen, ...favorieteInstellingen, notes, activeNoteId };
        const settingsToSave = { ...settingsToApply };
        await chrome.storage.local.set(settingsToSave);
        await laadInstellingen();
        await updateActualNotepadVisibility();
        showStatusMessage(chrome.i18n.getMessage('alertFavoriteRestored'));
    } else {
        showStatusMessage(chrome.i18n.getMessage('alertNoFavoriteFound'));
    }
}

function updateScreensaverPosition() {
    if (!isScreensaverActive || !klokContainer) return;

    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    const { offsetWidth: clockWidth, offsetHeight: clockHeight } = klokContainer;

    // Get the current position from the computed style
    const style = window.getComputedStyle(klokContainer);
    const matrix = new DOMMatrix(style.transform);
    const currentX = matrix.m41;
    const currentY = matrix.m42;

    // Set the start of the animation to the current position
    klokContainer.style.setProperty('--start-x', `${currentX}px`);
    klokContainer.style.setProperty('--start-y', `${currentY}px`);

    // Calculate a new random end position
    const newX = Math.floor(Math.random() * (windowWidth - clockWidth));
    const newY = Math.floor(Math.random() * (windowHeight - clockHeight));
    klokContainer.style.setProperty('--end-x', `${newX}px`);
    klokContainer.style.setProperty('--end-y', `${newY}px`);

    // Reset the animation to apply the new values
    klokContainer.style.animation = 'none';
    // This is a trick to force a reflow, ensuring the browser picks up the new animation
    void klokContainer.offsetWidth;
    klokContainer.style.animation = ''; // Re-apply the animation from CSS
}


function startScreensaver() {
    // Set initial random position before starting the animation loop
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    const { offsetWidth: clockWidth, offsetHeight: clockHeight } = klokContainer;
    const initialX = Math.floor(Math.random() * (windowWidth - clockWidth));
    const initialY = Math.floor(Math.random() * (windowHeight - clockHeight));
    klokContainer.style.setProperty('--start-x', `${initialX}px`);
    klokContainer.style.setProperty('--start-y', `${initialY}px`);
    klokContainer.style.transform = `translate(${initialX}px, ${initialY}px)`;


    updateScreensaverPosition(); // Set the first animation target
    // Set an interval to update the destination every 10 seconds (matching the animation duration)
    screensaverAnimationTimeout = setInterval(updateScreensaverPosition, 10000);
}

function stopScreensaver() {
    if (screensaverAnimationTimeout) clearInterval(screensaverAnimationTimeout);
    screensaverAnimationTimeout = null;
    if (klokContainer) {
        klokContainer.style.transform = '';
        klokContainer.style.animation = '';
    }
    // Restore the layout defined by user settings
    chrome.storage.local.get('klokPositie', ({ klokPositie = standaardInstellingen.klokPositie }) => setKlokLayout(klokPositie));
}

async function toggleScreensaver(event) {
    if (event) event.stopPropagation();
    isScreensaverActive = !isScreensaverActive;
    const currentWindow = await chrome.windows.getCurrent();
    document.body.classList.toggle('screensaver-active', isScreensaverActive);

    if (isScreensaverActive) {
        document.addEventListener('click', handleScreensaverBackgroundClick, true);
        try {
            if ((await chrome.windows.get(currentWindow.id)).state !== "fullscreen") {
                await chrome.windows.update(currentWindow.id, { state: "fullscreen" });
            }
        } catch (e) { console.error("Could not set to fullscreen:", e); }
        startScreensaver();
    } else {
        document.removeEventListener('click', handleScreensaverBackgroundClick, true);
        stopScreensaver();
        try {
            if ((await chrome.windows.get(currentWindow.id)).state === "fullscreen") {
                await chrome.windows.update(currentWindow.id, { state: "normal" });
            }
        } catch (e) { console.error("Could not set to normal:", e); }
    }
}

async function handleScreensaverBackgroundClick(event) {
    if (isScreensaverActive && event.target !== tijdElement && event.target !== datumElement) {
        await toggleScreensaver();
    }
}

function applyBatteryVisibility(isVisible) {
    if (batterijStatusElement) {
        batterijStatusElement.style.display = isVisible ? 'block' : 'none';
    }
}

async function updateBatteryStatus() {
    if (!navigator.getBattery) {
        if (batterijStatusElement) batterijStatusElement.style.display = 'none';
        return;
    }
    try {
        const battery = await navigator.getBattery();
        batterijStatusElement.textContent = `${Math.floor(battery.level * 100)}%`;
    } catch (error) {
        console.error('Error getting battery status:', error);
        if (batterijStatusElement) batterijStatusElement.style.display = 'none';
    }
}

function setupEventListeners() {
    toggleSecondenKnop.addEventListener('click', async () => {
        toonSeconden = !toonSeconden;
        updateKlok();
        await chrome.storage.local.set({ toonSeconden: toonSeconden });
    });
    toggleBatterijKnop.addEventListener('click', async () => {
        toonBatterij = !toonBatterij;
        applyBatteryVisibility(toonBatterij);
        await chrome.storage.local.set({ toonBatterij: toonBatterij });
    });
    toggleDatumKnop.addEventListener('click', async () => {
        let { isDatumVisible } = await chrome.storage.local.get('isDatumVisible');
        const nieuweZichtbaarheid = isDatumVisible === undefined ? !standaardInstellingen.isDatumVisible : !isDatumVisible;
        applyDatumVisibility(nieuweZichtbaarheid);
        await chrome.storage.local.set({ isDatumVisible: nieuweZichtbaarheid });
    });
    toggleDagNaamKnop.addEventListener('click', toggleDayOfWeek);
    toggleJaarKnop.addEventListener('click', async () => {
        let { showYear: currentShowYear } = await chrome.storage.local.get('showYear');
        showYear = currentShowYear === undefined ? !standaardInstellingen.showYear : !currentShowYear;
        await chrome.storage.local.set({ showYear: showYear });
        await updateKlok();
    });
    toonInstellingenKnop.addEventListener('click', toggleInstellingenPaneel);
    bewaarFavorietKnop.addEventListener('click', bewaarFavorieteInstellingen);
    herstelStandaardKnop.addEventListener('click', herstelStandaardInstellingen);
    herstelFavorietKnop.addEventListener('click', herstelFavorieteInstellingen);
    toggleNotepadKnop.addEventListener('click', toggleUserPreferenceNotepad);
    if (toggleContextMenuKnop) {
        toggleContextMenuKnop.addEventListener('click', async () => {
            isContextMenuEnabled = !isContextMenuEnabled;
            updateToggleButtonTexts();
            await chrome.storage.local.set({ isContextMenuEnabled: isContextMenuEnabled });
        });
    }
    if (toggleNotepadAddPositionKnop) {
        toggleNotepadAddPositionKnop.addEventListener('click', async () => {
            addAtTop = !addAtTop;
            updateToggleButtonTexts();
            await chrome.storage.local.set({ addAtTop: addAtTop });
        });
    }
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', addNote);
    }
    if (quickAlignBtn) {
        quickAlignBtn.addEventListener('click', async () => {
            const { notepadTextAlign } = await chrome.storage.local.get({ notepadTextAlign: standaardInstellingen.notepadTextAlign });
            const modes = ['left', 'center', 'right'];
            const nextIdx = (modes.indexOf(notepadTextAlign) + 1) % modes.length;
            const nextMode = modes[nextIdx];
            
            if (notepadArea) notepadArea.style.textAlign = nextMode;
            if (notepadTextAlignSelect) notepadTextAlignSelect.value = nextMode;
            updateQuickAlignButtonIcon(nextMode);
            await chrome.storage.local.set({ notepadTextAlign: nextMode });
        });
    }
    startScreensaverKnop.addEventListener('click', toggleScreensaver);
    if (downloadNotepadKnop) {
        downloadNotepadKnop.addEventListener('click', async () => {
            const content = notepadArea.value;

            // Try to use File System Access API if available
            if ('showSaveFilePicker' in window) {
                try {
                    const handle = await window.showSaveFilePicker({
                        suggestedName: 'notepad.txt',
                        types: [{
                            description: 'Text file',
                            accept: { 'text/plain': ['.txt'] },
                        }],
                    });
                    const writable = await handle.createWritable();
                    await writable.write(content);
                    await writable.close();
                    return; // Success
                } catch (err) {
                    // If user cancels, we just stop. If other error, we might fallback.
                    if (err.name === 'AbortError') return;
                    console.error('File System Access API failed, falling back to download:', err);
                }
            }

            // Fallback to traditional download
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'notepad.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
    stopAlarmKnop.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'stop-alarm-sound' });
        stopAlarmKnop.classList.add('hidden');
        document.body.classList.remove('alarm-active');
    });
    tijdElement.addEventListener('click', toggleScreensaver);
    datumElement.addEventListener('click', toggleScreensaver);

    klokPositieSelect.addEventListener('input', (e) => applyAndSaveSetting('klokPositie', e.target.value));

    fontTijdInput.addEventListener('input', (e) => applyAndSaveSetting('fontTijd', e.target.value, tijdElement, 'fontFamily'));
    grootteTijdInput.addEventListener('input', (e) => applyAndSaveSetting('grootteTijd', parseFloat(e.target.value), tijdElement, 'fontSize'));
    paddingOnderTijdInput.addEventListener('input', (e) => applyAndSaveSetting('paddingOnderTijd', parseInt(e.target.value), tijdElement, 'paddingBottom'));
    paddingBovenTijdInput.addEventListener('input', (e) => applyAndSaveSetting('paddingBovenTijd', parseInt(e.target.value), tijdElement, 'marginTop'));
    fontDatumInput.addEventListener('input', (e) => applyAndSaveSetting('fontDatum', e.target.value, datumElement, 'fontFamily'));
    grootteDatumInput.addEventListener('input', (e) => applyAndSaveSetting('grootteDatum', parseFloat(e.target.value), datumElement, 'fontSize'));
    paddingOnderDatumInput.addEventListener('input', (e) => applyAndSaveSetting('paddingOnderDatum', parseInt(e.target.value), datumElement, 'paddingBottom'));
    fontBatterijInput.addEventListener('input', (e) => applyAndSaveSetting('fontBatterij', e.target.value, batterijStatusElement, 'fontFamily'));
    grootteBatterijInput.addEventListener('input', (e) => applyAndSaveSetting('grootteBatterij', parseFloat(e.target.value), batterijStatusElement, 'fontSize'));
    paddingOnderBatterijInput.addEventListener('input', (e) => applyAndSaveSetting('paddingOnderBatterij', parseInt(e.target.value), batterijStatusElement, 'paddingBottom'));
    breedteBatterijInput.addEventListener('input', (e) => applyAndSaveSetting('breedteBatterij', parseFloat(e.target.value), batterijStatusElement, 'transform'));

    if (notepadArea) {
        notepadArea.addEventListener('input', saveNotepadContent);
    }
    if (notepadTextAlignSelect) notepadTextAlignSelect.addEventListener('input', (e) => applyAndSaveSetting('notepadTextAlign', e.target.value, notepadArea, 'textAlign'));
    if (fontNotepadInput) fontNotepadInput.addEventListener('input', (e) => applyAndSaveSetting('fontNotepad', e.target.value, notepadArea, 'fontFamily'));
    if (grootteNotepadInput) grootteNotepadInput.addEventListener('input', (e) => applyAndSaveSetting('grootteNotepad', parseFloat(e.target.value), notepadArea, 'fontSize'));

    kleurTijdInput.addEventListener('input', (e) => applyAndSaveSetting('kleurTijd', e.target.value, tijdElement, 'color'));
    kleurDatumInput.addEventListener('input', (e) => applyAndSaveSetting('kleurDatum', e.target.value, datumElement, 'color'));
    kleurBatterijInput.addEventListener('input', (e) => applyAndSaveSetting('kleurBatterij', e.target.value, batterijStatusElement, 'color'));
    if (kleurNotepadInput) kleurNotepadInput.addEventListener('input', (e) => applyAndSaveSetting('kleurNotepad', e.target.value, notepadArea, 'color'));
    achtergrondKleurInput.addEventListener('input', (e) => applyAndSaveSetting('achtergrondKleur', e.target.value, document.body, 'backgroundColor'));

    achtergrondElementenKleurInput.addEventListener('input', async (e) => {
        const val = e.target.value;
        if (notepadArea) notepadArea.style.backgroundColor = val;
        await chrome.storage.local.set({ achtergrondElementenKleur: val });
    });

    if (iconColorPicker) {
        iconColorPicker.addEventListener('input', (e) => {
            chrome.storage.local.set({ iconColor: e.target.value }, () => {
                chrome.runtime.sendMessage({ action: 'redraw-icon' });
            });
        });
    }

    // System theme change listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFlatpickrTheme);

    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local') {
            if (changes.notes) {
                notes = changes.notes.newValue || [];
                const activeNote = notes.find(n => n.id === activeNoteId);
                if (notepadArea && activeNote && notepadArea.value !== activeNote.content) {
                    notepadArea.value = activeNote.content;
                }
                renderTabs();
                updateStorageUsage();
            }
            if (changes.activeNoteId) {
                activeNoteId = changes.activeNoteId.newValue;
                const activeNote = notes.find(n => n.id === activeNoteId);
                if (notepadArea && activeNote) {
                    notepadArea.value = activeNote.content;
                }
                renderTabs();
            }
        }
    });

    window.addEventListener('resize', async () => {
        if (!chrome.runtime?.id) return;
        if (isScreensaverActive) {
            try {
                const currentWindow = await chrome.windows.getCurrent();
                if (currentWindow.state !== 'fullscreen') await toggleScreensaver();
            } catch (e) { /* Ignore errors if window is already closed */ }
        }
        clearTimeout(windowResizeTimer);
        windowResizeTimer = setTimeout(() => {
            if (!chrome.runtime?.id) return;
            chrome.windows.getCurrent(currentWindow => {
                if (currentWindow && currentWindow.state === 'normal') {
                    chrome.storage.local.set({ windowWidth: window.outerWidth, windowHeight: window.outerHeight });
                }
            });
        }, 500);
    });
}

async function initializeClock() {
    initializeDOMReferences();
    applyTranslations();
    await laadInstellingen();
    document.body.style.visibility = 'visible';
    updateKlok();
    setupEventListeners();
    clockInterval = setInterval(updateKlok, 1000);

    // Check for openSettings parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('openSettings') === 'true') {
        if (instellingenPaneel && instellingenPaneel.classList.contains('hidden')) {
            toggleInstellingenPaneel();
        }
    }

    document.dispatchEvent(new CustomEvent('clockInitialized'));
}


document.addEventListener('DOMContentLoaded', initializeClock);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'alarm-triggered') {
        document.body.classList.add('alarm-active');
        if (stopAlarmKnop) {
            stopAlarmKnop.classList.remove('hidden');
        }
        const alarmDurationInMs = (request.duration || 3) * 1000;
        setTimeout(() => {
            document.body.classList.remove('alarm-active');
            if (stopAlarmKnop) {
                stopAlarmKnop.classList.add('hidden');
            }
        }, alarmDurationInMs);
    } else if (request.action === 'open-settings') {
        if (instellingenPaneel && instellingenPaneel.classList.contains('hidden')) {
            toggleInstellingenPaneel();
        }
    }
});
