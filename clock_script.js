
document.addEventListener('DOMContentLoaded', async () => {
    const notepadArea = document.getElementById('notepad-area');

    if (notepadArea) {
        // Load saved content from storage
        const data = await chrome.storage.local.get('notepadContent');
        if (data.notepadContent) {
            notepadArea.value = data.notepadContent;
        }

        // Save content to storage on input
        notepadArea.addEventListener('input', async () => {
            await chrome.storage.local.set({ notepadContent: notepadArea.value });
        });
    }
    
    // Make the page visible after setup
    document.body.style.visibility = 'visible';
});
