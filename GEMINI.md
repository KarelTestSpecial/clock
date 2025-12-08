# Very Practical Clock - Project Context

## Project Overview
"Very Practical Clock" is a Chrome Extension (Manifest V3) that provides a customizable, always-on-top-capable clock window. It features a digital clock, date display, battery status, notepad, screensaver, and persistent alarms.

### Key Features
- **Dynamic Icon:** The extension toolbar icon updates in real-time to show the current time (analog style).
- **Customizable UI:** Users can adjust fonts, sizes, colors (including background element colors), and layout for time, date, battery, and notepad.
- **Alarms:** Supports two independent alarms with sound playback via an offscreen document. Modern time picking is provided via **Flatpickr**.
- **Screensaver:** Prevents screen burn-in.
- **Persistence:** Settings are saved to `chrome.storage.local`.

## Architecture

### Components
1.  **Manifest V3 (`manifest.json`):**
    -   Permissions: `windows`, `storage`, `system.display`, `alarms`, `offscreen`.
    -   Background: Service Worker (`background.js`).
    -   Action: Opens `clock_window.html`.

2.  **Background Service Worker (`background.js`):**
    -   **Icon Management:** Draws the current time on an `OffscreenCanvas` and updates the browser action icon every minute.
    -   **Window Management:** Creates and manages the popup window (`clock_window.html`), ensuring only one instance exists. Positions it based on user settings.
    -   **Alarm Handling:** Listens for alarms, wakes the clock window, and triggers audio playback.
    -   **Offscreen Audio:** Spawns `offscreen.html` to play alarm sounds (workaround for Service Worker limitations).

3.  **Clock Window (`clock_window.html`, `clock_script.js`, `clock_style.css`):**
    -   **UI:** Digital clock, date, battery info, notepad, and a hidden settings panel. Uses **Flatpickr** for alarm time inputs.
    -   **Logic:** Handles the "tick" (time update), user interactions, saving/loading settings, and responding to messages from the background script.
    -   **Theming:** Dynamically switches Flatpickr themes (Light/Dark) based on the OS system theme preference (`prefers-color-scheme`).

4.  **Offscreen Document (`offscreen.html`, `offscreen.js`):**
    -   Sole purpose is to play audio files (`sounds/`) when requested by the background script for alarms.

## Development & Usage

### Setup
1.  This is a "Load Unpacked" extension. No build process (webpack/parcel) is currently used; it is mostly raw HTML/CSS/JS, with 3rd party libraries stored in `lib/`.
2.  Navigate to `chrome://extensions/`.
3.  Enable "Developer mode".
4.  Click "Load unpacked" and select this directory.

### Dependencies (Vendor)
-   **Flatpickr:** Located in `lib/flatpickr/`. Used for the alarm time picker UI.
    -   `flatpickr.min.js`
    -   `flatpickr.min.css` (Light theme)
    -   `flatpickr.dark.min.css` (Dark theme)

### Conventions
-   **JavaScript:** ES6+ features (async/await, arrow functions).
-   **Storage:** `chrome.storage.local` is used for all persistence.
-   **Internationalization:** Uses `_locales/` (e.g., `__MSG_extName__`). Code likely uses `chrome.i18n.getMessage`.
-   **Styling:** Plain CSS in `clock_style.css`.
-   **HTML Structure:**
    -   `#klok-container`: Main wrapper.
    -   `.instellingen-paneel`: Settings UI (hidden by default).
    -   IDs are heavily used for DOM manipulation.

### Key Files
-   `manifest.json`: Configuration and entry points.
-   `background.js`: Core logic for icon, windows, and alarms.
-   `clock_window.html`: Main user interface.
-   `clock_script.js`: UI logic, setting management, and Flatpickr initialization.
-   `lib/`: Contains external libraries.