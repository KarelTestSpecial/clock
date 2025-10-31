const audioPlayer = document.getElementById('alarm-audio-player');
let stopTimer = null;

chrome.runtime.onMessage.addListener((message) => {
  if (message.target !== 'offscreen') return;

  if (message.action === 'play-alarm-sound') {
    if (stopTimer) {
      clearTimeout(stopTimer);
    }
    audioPlayer.pause();

    const soundFile = `sounds/${message.sound}.mp3`;
    audioPlayer.src = chrome.runtime.getURL(soundFile);
    audioPlayer.loop = true;

    audioPlayer.oncanplaythrough = () => {
        audioPlayer.play().catch(e => {});
    };

    stopTimer = setTimeout(() => {
      audioPlayer.pause();
      audioPlayer.src = '';
      stopTimer = null;
    }, message.duration * 1000);
  }
  return false;
});

// Signal that the offscreen document is ready to receive messages.
chrome.runtime.sendMessage({ action: 'offscreen-ready' });
