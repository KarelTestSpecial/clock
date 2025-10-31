# Technische Beschrijving: Chrome Klok Extensie

Dit document beschrijft de technische architectuur en functionaliteiten van de Chrome Klok Extensie.

## 1. Architectuur

De extensie is gebouwd volgens de **Manifest V3** specificaties van Chrome, wat impliceert dat er gebruik wordt gemaakt van een Service Worker voor achtergrondprocessen.

### 1.1 Kerncomponenten

- **Service Worker (`background.js`):** Het hart van de extensie. Deze is verantwoordelijk voor:
    - Het programmatisch openen en beheren van het klokvenster (`clock_window.html`).
    - Het schedulen en afhandelen van alarmen via de `chrome.alarms` API.
    - Communicatie coördineren tussen de verschillende onderdelen van de extensie.
    - Het beheren van de `offscreen` document-levenscyclus.

- **Hoofdvenster (`clock_window.html`, `clock_script.js`, `clock_style.css`):** De gebruikersinterface van de extensie.
    - Toont de klok, datum, en batterijstatus.
    - Bevat het instellingenpaneel waar de gebruiker de weergave kan aanpassen.
    - Communiceert met de Service Worker om instellingen op te slaan en alarmen in te stellen.

- **Offscreen Document (`offscreen.html`, `offscreen.js`):** Een minimaal HTML-document dat in de achtergrond draait met als enige doel het afspelen van audio. Dit is een vereiste onder Manifest V3, omdat Service Workers geen directe toegang hebben tot DOM-elementen zoals `<audio>`.
    - Bevat een persistent `<audio>` element.
    - `offscreen.js` wacht op berichten van de Service Worker om het afspelen van alarmgeluiden te starten of te stoppen.

### 1.2 Permissies

De extensie vereist de volgende permissies:
- `windows`: Om het klokvenster te kunnen beheren (maken, positioneren).
- `storage`: Voor het persistent opslaan van gebruikersinstellingen in `chrome.storage.local`.
- `system.display`: Om informatie over de schermen van de gebruiker te verkrijgen voor correcte positionering van het venster.
- `alarms`: Voor het betrouwbaar inplannen van alarmen.
- `offscreen`: Om het document voor het afspelen van audio te kunnen gebruiken.

### 1.3 Dataopslag

- **`chrome.storage.local`:** Alle gebruikersinstellingen, inclusief klokconfiguratie en alarmdetails, worden hier opgeslagen. Dit zorgt ervoor dat de instellingen behouden blijven, ook als de browser wordt afgesloten.

### 1.4 Internationalisatie (i18n)

- De extensie maakt gebruik van `_locales/*/messages.json` bestanden voor vertalingen, wat te zien is aan `__MSG_...__` placeholders in `manifest.json`.

## 2. Kernfunctionaliteiten

### 2.1 Visuele Componenten

- **Klok, Datum en Batterij:** De primaire weergave-elementen. De gebruiker kan via de instellingen de zichtbaarheid en het uiterlijk van deze componenten aanpassen.
- **Instellingenpaneel:**
    - Maakt gebruik van een 4-koloms CSS Grid (`grid-template-columns: repeat(4, 1fr);`) voor een visueel gebalanceerde en uitgelijnde layout.
    - De volgorde van instellingengroepen is logisch gerangschikt (Tijd, Datum, Batterij) om de verticale layout van de klok te spiegelen.
- **Schermbeveiliging (Screensaver):**
    - Een geanimeerde modus waarbij de klok over het scherm glijdt.
    - De animatie wordt aangestuurd door CSS (`@keyframes` en `transform: translate`).
    - JavaScript activeert de animatie door een CSS-klasse op de `body` te toggelen en de start/eind coördinaten via CSS-variabelen door te geven.

### 2.2 Alarm Systeem

- **Scheduling:** De `chrome.alarms` API wordt gebruikt voor het inplannen van alarmen. Dit is robuust en werkt zelfs als de Service Worker inactief is.
- **Audio Playback:**
    - Om te voldoen aan de autoplay-policy van browsers en de beperkingen van Manifest V3, wordt audio afgespeeld via het `offscreen` document.
    - Een `Promise` (`creatingOffscreenDocument`) in `background.js` fungeert als een mutex om race conditions te voorkomen bij het aanmaken van dit document.
    - `offscreen.js` wacht op de `canplaythrough` event van het audio-element voordat `.play()` wordt aangeroepen, om `DOMException` race conditions te voorkomen.
- **Visuele Indicatie:** Wanneer een alarm afgaat, stuurt de Service Worker een bericht naar het hoofdvenster om een visuele indicator te tonen (bv. een flitsende achtergrond).

### 2.3 Communicatie & State Management

- **Message Passing:** De verschillende componenten communiceren via `chrome.runtime.sendMessage` en `chrome.runtime.onMessage`.
    - **Frontend -> Service Worker:** Voor het opslaan van instellingen of het instellen van een alarm.
    - **Service Worker -> Frontend:** Voor het activeren van visuele alarmen.
    - **Service Worker -> Offscreen:** Voor het starten/stoppen van alarmgeluiden.
- **State:** Er wordt bewust niet vertrouwd op in-memory variabelen in de Service Worker voor kritieke state (zoals window ID's), omdat de worker inactief kan worden. State wordt actief opgevraagd wanneer nodig (bv. het raam zoeken op basis van zijn URL).
- **Asynchrone Listeners:** `onMessage` listeners die een asynchroon antwoord moeten geven, `return true` om te voorkomen dat het berichtkanaal voortijdig wordt gesloten.

### 2.4 Layout en Styling

- **Thema:** De extensie heeft standaard een donker thema. Er is geen 'light mode' geïmplementeerd.
- **Centrering & Scrolling:** De `body` van het hoofdvenster gebruikt `display: grid` met `place-content` voor een robuuste centrering van de inhoud. Dit loste een hardnekkige bug op waarbij horizontaal scrollen niet correct werkte in combinatie met flexbox-centrering.
- **Initialisatie:** De `body` is standaard verborgen (`visibility: hidden;`) en wordt pas zichtbaar gemaakt door `clock_script.js` nadat de applicatie succesvol is geïnitialiseerd.
