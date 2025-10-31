
// Globale DOM Element Referenties (na DOMContentLoaded)
let tijdElement, datumElement, toggleSecondenKnop, toonInstellingenKnop, instellingenPaneel, batterijStatusElement, toggleBatterijKnop, toggleDagNaamKnop;
let bewaarFavorietKnop, herstelStandaardKnop, herstelFavorietKnop;
let fontTijdInput, grootteTijdInput, weergaveGrootteTijd, kleurTijdInput, paddingOnderTijdInput, weergavePaddingOnderTijd, paddingBovenTijdInput, weergavePaddingBovenTijd;
let fontDatumInput, grootteDatumInput, weergaveGrootteDatum, kleurDatumInput, paddingOnderDatumInput, weergavePaddingOnderDatum;
let fontBatterijInput, kleurBatterijInput, grootteBatterijInput, weergaveGrootteBatterij, breedteBatterijInput, weergaveBreedteBatterij, paddingOnderBatterijInput, weergavePaddingOnderBatterij;
let achtergrondKleurInput, klokContainer, notepadContainer, notepadArea, toggleNotepadKnop;
let notepadTextAlignSelect, fontNotepadInput, grootteNotepadInput, weergaveGrootteNotepad;
let toggleDatumKnop, startScreensaverKnop, statusMessageElement, klokPositieSelect;

// Globale status- en timer-variabelen
let toonSeconden, toonBatterij;
let isScreensaverActive = false;
let screensaverAnimationTimeout = null;
let statusMessageTimeoutId = null;
let windowResizeTimer = null;
let currentAlarmAudio = null;

// Standaardinstellingen
const standaardInstellingen = {
    toonSeconden: false,
    toonBatterij: true,
    showDayOfWeek: true,
    fontTijd: 'Verdana, sans-serif',
    grootteTijd: 4.0,
    paddingOnderTijd: 0,
    paddingBovenTijd: 0,
    kleurTijd: '#39FF14',
    fontDatum: 'Arial, sans-serif',
    grootteDatum: 1.2,
    paddingOnderDatum: 0,
    kleurDatum: '#B0B0B0',
    fontBatterij: 'Arial, sans-serif',
    grootteBatterij: 1.2,
    breedteBatterij: 1.0,
    paddingOnderBatterij: 0,
    kleurBatterij: '#B0B0B0',
    achtergrondKleur: '#000000',
    klokPositie: 'top-center',
    isDatumVisible: true,
    notepadContent: '',
    isNotepadVisible: true,
    notepadTextAlign: 'center',
    fontNotepad: 'Arial, sans-serif',
    grootteNotepad: 1.5,
    notepadHeight: null,
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
    toggleNotepadKnop = document.getElementById('toggle-notepad');
    toggleBatterijKnop = document.getElementById('toggle-batterij');
    toonInstellingenKnop = document.getElementById('toon-instellingen');
    startScreensaverKnop = document.getElementById('start-screensaver');
    bewaarFavorietKnop = document.getElementById('bewaar-favoriet');
    herstelStandaardKnop = document.getElementById('herstel-standaard');
    herstelFavorietKnop = document.getElementById('herstel-favoriet');

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
    klokPositieSelect = document.getElementById('klok-positie-select');
    notepadContainer = document.getElementById('notepad-container');
    notepadArea = document.getElementById('notepad-area');
    notepadTextAlignSelect = document.getElementById('notepad-text-align');
    fontNotepadInput = document.getElementById('font-notepad');
    grootteNotepadInput = document.getElementById('grootte-notepad');
    weergaveGrootteNotepad = document.getElementById('weergave-grootte-notepad');

    // Alarmen
    for (let i = 1; i <= 2; i++) {
        document.getElementById(`alarm-tijd-${i}`).addEventListener('change', (e) => saveAlarmSetting(i, 'time', e.target.value));
        document.getElementById(`alarm-toggle-${i}`).addEventListener('change', (e) => saveAlarmSetting(i, 'enabled', e.target.checked));
        document.getElementById(`alarm-geluid-${i}`).addEventListener('change', (e) => saveAlarmSetting(i, 'sound', e.target.value));
        document.getElementById(`alarm-duur-${i}`).addEventListener('change', (e) => saveAlarmSetting(i, 'duration', parseInt(e.target.value)));
    }
}

function applyTranslations() {
    document.documentElement.lang = chrome.i18n.getUILanguage().split('-')[0];
    document.getElementById('htmlPageTitle').textContent = chrome.i18n.getMessage('htmlPageTitle');
    toggleSecondenKnop.textContent = chrome.i18n.getMessage('toggleSecondsText');
    if (toggleBatterijKnop) toggleBatterijKnop.textContent = chrome.i18n.getMessage('toggleBatteryText');
    toggleDatumKnop.textContent = chrome.i18n.getMessage('toggleDateText');
    toggleDagNaamKnop.textContent = chrome.i18n.getMessage('toggleDayOfWeekText');
    toggleNotepadKnop.textContent = chrome.i18n.getMessage('toggleNotepadText');
    toonInstellingenKnop.textContent = chrome.i18n.getMessage('toggleSettingsText');
    startScreensaverKnop.textContent = chrome.i18n.getMessage('startScreensaverText');
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
    document.getElementById('lblAchtergrondKleur').textContent = chrome.i18n.getMessage('backgroundColorLabel');
    document.getElementById('lblNotepadTextAlign').textContent = chrome.i18n.getMessage('notepadTextAlignLabel');
    document.getElementById('lblFontNotepad').textContent = chrome.i18n.getMessage('notepadFontLabel');
    document.getElementById('lblGrootteNotepadText').textContent = chrome.i18n.getMessage('notepadSizeLabelText');
    document.getElementById('optTextAlignLeft').textContent = chrome.i18n.getMessage('textAlignLeft');
    document.getElementById('optTextAlignCenter').textContent = chrome.i18n.getMessage('textAlignCenter');
    document.getElementById('optTextAlignRight').textContent = chrome.i18n.getMessage('textAlignRight');
    bewaarFavorietKnop.textContent = chrome.i18n.getMessage('saveFavoritesText');
    herstelStandaardKnop.textContent = chrome.i18n.getMessage('defaultSettingsText');
    herstelFavorietKnop.textContent = chrome.i18n.getMessage('restoreFavoritesText');
    if (notepadArea) notepadArea.placeholder = chrome.i18n.getMessage('notepadPlaceholder');
    document.getElementById('lblKlokPositie').textContent = chrome.i18n.getMessage('positionLabel');
    document.getElementById('optPosTopLeft').textContent = chrome.i18n.getMessage('posTopLeft');
    document.getElementById('optPosTopCenter').textContent = chrome.i18n.getMessage('posTopCenter');
    document.getElementById('optPosTopRight').textContent = chrome.i18n.getMessage('posTopRight');
    document.getElementById('optPosCenterCenter').textContent = chrome.i18n.getMessage('posCenterCenter');
    document.getElementById('optPosBottomLeft').textContent = chrome.i18n.getMessage('posBottomLeft');
    document.getElementById('optPosBottomCenter').textContent = chrome.i18n.getMessage('posBottomCenter');
    document.getElementById('optPosBottomRight').textContent = chrome.i18n.getMessage('posBottomRight');
}

function setKlokLayout(positie) {
    document.body.className = ''; // Clear all classes
    if (positie) {
        document.body.classList.add(`position-${positie}`);
    } else {
        document.body.classList.add(`position-${standaardInstellingen.klokPositie}`);
    }
}


function applyAllSettings(settings) {
    document.body.style.backgroundColor = settings.achtergrondKleur;
    toonSeconden = settings.toonSeconden;
    toonBatterij = settings.toonBatterij;

    if (tijdElement) {
        tijdElement.style.fontFamily = settings.fontTijd;
        tijdElement.style.color = settings.kleurTijd;
        tijdElement.style.fontSize = settings.grootteTijd + 'em';
        tijdElement.style.paddingBottom = settings.paddingOnderTijd + 'px';
        tijdElement.style.paddingTop = settings.paddingBovenTijd + 'px';
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
    if (klokPositieSelect) klokPositieSelect.value = settings.klokPositie;
}

function applyNotepadSettings(settings) {
    if (notepadArea) {
        notepadArea.value = settings.notepadContent;
        notepadArea.style.textAlign = settings.notepadTextAlign;
        notepadArea.style.fontFamily = settings.fontNotepad;
        notepadArea.style.fontSize = settings.grootteNotepad + 'em';
    }
    if (notepadTextAlignSelect) notepadTextAlignSelect.value = settings.notepadTextAlign;
    if (fontNotepadInput) fontNotepadInput.value = settings.fontNotepad;
    if (grootteNotepadInput) grootteNotepadInput.value = settings.grootteNotepad;
    if (weergaveGrootteNotepad) weergaveGrootteNotepad.textContent = settings.grootteNotepad + 'em';
}

function applyDatumVisibility(isVisible) {
    if (datumElement) {
        datumElement.style.display = isVisible ? 'block' : 'none';
    }
}

async function laadInstellingen() {
    const opgeslagenInstellingen = await chrome.storage.local.get(standaardInstellingen);
    applyAllSettings(opgeslagenInstellingen);
    applyDatumVisibility(opgeslagenInstellingen.isDatumVisible);
    applyBatteryVisibility(opgeslagenInstellingen.toonBatterij);
    applyNotepadSettings(opgeslagenInstellingen);
    if (opgeslagenInstellingen.notepadHeight && notepadArea) {
        notepadArea.style.height = `${opgeslagenInstellingen.notepadHeight}px`;
    }
    for (let i = 1; i <= 2; i++) {
        const settings = opgeslagenInstellingen[`alarm${i}Settings`];
        document.getElementById(`alarm-tijd-${i}`).value = settings.time;
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


async function updateKlok() {
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
    const currentLocale = chrome.i18n.getMessage('dateLocale');
    const { showDayOfWeek } = await chrome.storage.local.get('showDayOfWeek');
    const finalShowDayOfWeek = showDayOfWeek === undefined ? standaardInstellingen.showDayOfWeek : showDayOfWeek;
    const optiesDatum = { year: 'numeric', month: 'long', day: 'numeric' };
    if (finalShowDayOfWeek) {
        optiesDatum.weekday = 'long';
    }
    datumElement.textContent = nu.toLocaleDateString(currentLocale, optiesDatum);
}

async function updateActualNotepadVisibility() {
    let { isNotepadVisible } = await chrome.storage.local.get({isNotepadVisible: standaardInstellingen.isNotepadVisible});
    if (notepadContainer) {
        notepadContainer.classList.toggle('hidden', !isNotepadVisible);
    }
}

async function toggleUserPreferenceNotepad() {
    let { isNotepadVisible } = await chrome.storage.local.get('isNotepadVisible');
    const nieuweVoorkeur = isNotepadVisible === undefined ? !standaardInstellingen.isNotepadVisible : !isNotepadVisible;
    await chrome.storage.local.set({ isNotepadVisible: nieuweVoorkeur });
    await updateActualNotepadVisibility();
}

async function toggleDayOfWeek() {
    let { showDayOfWeek } = await chrome.storage.local.get('showDayOfWeek');
    const newShowDayOfWeek = showDayOfWeek === undefined ? !standaardInstellingen.showDayOfWeek : !showDayOfWeek;
    await chrome.storage.local.set({ showDayOfWeek: newShowDayOfWeek });
    await updateKlok();
}

function toggleInstellingenPaneel() {
    if (instellingenPaneel) instellingenPaneel.classList.toggle('hidden');
}

async function saveNotepadContent() {
    if (notepadArea) await chrome.storage.local.set({ notepadContent: notepadArea.value });
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
    const { isDatumVisible } = await chrome.storage.local.get('isDatumVisible');
    const huidigeInstellingen = {
        toonSeconden: toonSeconden,
        isDatumVisible: (isDatumVisible === undefined) ? standaardInstellingen.isDatumVisible : isDatumVisible,
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
        achtergrondKleur: achtergrondKleurInput.value,
        klokPositie: klokPositieSelect.value,
        notepadTextAlign: notepadTextAlignSelect.value,
        fontNotepad: fontNotepadInput.value,
        grootteNotepad: parseFloat(grootteNotepadInput.value),
        notepadHeight: notepadArea ? notepadArea.offsetHeight : null,
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
    applyNotepadSettings({ ...standaardInstellingen, notepadContent: notepadArea.value });
    if (notepadArea) notepadArea.style.height = '';
    const instellingenOmOpTeSlaan = { ...standaardInstellingen };
    delete instellingenOmOpTeSlaan.notepadContent;
    await chrome.storage.local.set({ ...instellingenOmOpTeSlaan, notepadHeight: null });
    await laadInstellingen();
    await updateActualNotepadVisibility();
}

async function herstelFavorieteInstellingen() {
    const { favorieteInstellingen } = await chrome.storage.local.get('favorieteInstellingen');
    if (favorieteInstellingen) {
        const settingsToApply = { ...standaardInstellingen, ...favorieteInstellingen, notepadContent: notepadArea ? notepadArea.value : '' };
        const settingsToSave = { ...settingsToApply };
        delete settingsToSave.notepadContent;
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
        if(batterijStatusElement) batterijStatusElement.style.display = 'none';
        return;
    }
    try {
        const battery = await navigator.getBattery();
        batterijStatusElement.textContent = `${Math.floor(battery.level * 100)}%`;
    } catch (error) {
        console.error('Error getting battery status:', error);
        if(batterijStatusElement) batterijStatusElement.style.display = 'none';
    }
}

function setupEventListeners() {
    toggleSecondenKnop.addEventListener('click', async () => {
        toonSeconden = !toonSeconden;
        updateKlok();
        await chrome.storage.local.set({ toonSeconden: toonSeconden });
    });
    toggleBatterijKnop.addEventListener('click', async () => {
        let { toonBatterij: isVisible } = await chrome.storage.local.get('toonBatterij');
        const nieuweZichtbaarheid = isVisible === undefined ? !standaardInstellingen.toonBatterij : !isVisible;
        applyBatteryVisibility(nieuweZichtbaarheid);
        await chrome.storage.local.set({ toonBatterij: nieuweZichtbaarheid });
    });
    toggleDatumKnop.addEventListener('click', async () => {
        let { isDatumVisible } = await chrome.storage.local.get('isDatumVisible');
        const nieuweZichtbaarheid = isDatumVisible === undefined ? !standaardInstellingen.isDatumVisible : !isDatumVisible;
        applyDatumVisibility(nieuweZichtbaarheid);
        await chrome.storage.local.set({ isDatumVisible: nieuweZichtbaarheid });
    });
    toggleDagNaamKnop.addEventListener('click', toggleDayOfWeek);
    toonInstellingenKnop.addEventListener('click', toggleInstellingenPaneel);
    bewaarFavorietKnop.addEventListener('click', bewaarFavorieteInstellingen);
    herstelStandaardKnop.addEventListener('click', herstelStandaardInstellingen);
    herstelFavorietKnop.addEventListener('click', herstelFavorieteInstellingen);
    toggleNotepadKnop.addEventListener('click', toggleUserPreferenceNotepad);
    startScreensaverKnop.addEventListener('click', toggleScreensaver);
    tijdElement.addEventListener('click', toggleScreensaver);
    datumElement.addEventListener('click', toggleScreensaver);

    klokPositieSelect.addEventListener('input', (e) => applyAndSaveSetting('klokPositie', e.target.value));

    fontTijdInput.addEventListener('input', (e) => applyAndSaveSetting('fontTijd', e.target.value, tijdElement, 'fontFamily'));
    grootteTijdInput.addEventListener('input', (e) => applyAndSaveSetting('grootteTijd', parseFloat(e.target.value), tijdElement, 'fontSize'));
    paddingOnderTijdInput.addEventListener('input', (e) => applyAndSaveSetting('paddingOnderTijd', parseInt(e.target.value), tijdElement, 'paddingBottom'));
    paddingBovenTijdInput.addEventListener('input', (e) => applyAndSaveSetting('paddingBovenTijd', parseInt(e.target.value), tijdElement, 'paddingTop'));
    fontDatumInput.addEventListener('input', (e) => applyAndSaveSetting('fontDatum', e.target.value, datumElement, 'fontFamily'));
    grootteDatumInput.addEventListener('input', (e) => applyAndSaveSetting('grootteDatum', parseFloat(e.target.value), datumElement, 'fontSize'));
    paddingOnderDatumInput.addEventListener('input', (e) => applyAndSaveSetting('paddingOnderDatum', parseInt(e.target.value), datumElement, 'paddingBottom'));
    fontBatterijInput.addEventListener('input', (e) => applyAndSaveSetting('fontBatterij', e.target.value, batterijStatusElement, 'fontFamily'));
    grootteBatterijInput.addEventListener('input', (e) => applyAndSaveSetting('grootteBatterij', parseFloat(e.target.value), batterijStatusElement, 'fontSize'));
    paddingOnderBatterijInput.addEventListener('input', (e) => applyAndSaveSetting('paddingOnderBatterij', parseInt(e.target.value), batterijStatusElement, 'paddingBottom'));
    breedteBatterijInput.addEventListener('input', (e) => applyAndSaveSetting('breedteBatterij', parseFloat(e.target.value), batterijStatusElement, 'transform'));
    
    if (notepadArea) {
        notepadArea.addEventListener('input', saveNotepadContent);
        let resizeTimeout;
        const resizeObserver = new ResizeObserver(() => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => chrome.storage.local.set({ notepadHeight: notepadArea.offsetHeight }), 500);
        });
        resizeObserver.observe(notepadArea);
    }
    if (notepadTextAlignSelect) notepadTextAlignSelect.addEventListener('input', (e) => applyAndSaveSetting('notepadTextAlign', e.target.value, notepadArea, 'textAlign'));
    if (fontNotepadInput) fontNotepadInput.addEventListener('input', (e) => applyAndSaveSetting('fontNotepad', e.target.value, notepadArea, 'fontFamily'));
    if (grootteNotepadInput) grootteNotepadInput.addEventListener('input', (e) => applyAndSaveSetting('grootteNotepad', parseFloat(e.target.value), notepadArea, 'fontSize'));

    kleurTijdInput.addEventListener('input', (e) => applyAndSaveSetting('kleurTijd', e.target.value, tijdElement, 'color'));
    kleurDatumInput.addEventListener('input', (e) => applyAndSaveSetting('kleurDatum', e.target.value, datumElement, 'color'));
    kleurBatterijInput.addEventListener('input', (e) => applyAndSaveSetting('kleurBatterij', e.target.value, batterijStatusElement, 'color'));
    achtergrondKleurInput.addEventListener('input', (e) => applyAndSaveSetting('achtergrondKleur', e.target.value, document.body, 'backgroundColor'));    
    
    window.addEventListener('resize', async () => {
        if (isScreensaverActive) {
            try {
                const currentWindow = await chrome.windows.getCurrent();
                if (currentWindow.state !== 'fullscreen') await toggleScreensaver();
            } catch (e) { /* Ignore errors if window is already closed */ }
        }
        clearTimeout(windowResizeTimer);
        windowResizeTimer = setTimeout(() => {
            chrome.windows.getCurrent(currentWindow => {
                if (currentWindow.state === 'normal') {
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
    setInterval(updateKlok, 1000);
}


document.addEventListener('DOMContentLoaded', initializeClock);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'alarm-triggered') {
        document.body.classList.add('alarm-active');
        setTimeout(() => {
            document.body.classList.remove('alarm-active');
        }, 3000);
    }
});
