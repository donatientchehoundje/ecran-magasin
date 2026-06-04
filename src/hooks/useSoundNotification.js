export function useSoundNotification() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const playTone = (frequency, duration) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const playSequence = async (tones) => {
    for (const { frequency, duration } of tones) {
      playTone(frequency, duration);
      await new Promise(resolve => setTimeout(resolve, duration * 1000 + 100));
    }
  };

  return {
    // 📥 Nouvelle facture - son ascendant
    playNew: () => {
      playSequence([
        { frequency: 440, duration: 0.15 },  // La4
        { frequency: 550, duration: 0.15 },  // Do#5
        { frequency: 660, duration: 0.2 },   // Mi5
      ]);
    },

    // ✓ Facture livrée - son descendant double (succès)
    playDelivered: () => {
      playSequence([
        { frequency: 784, duration: 0.1 },   // Sol5
        { frequency: 523, duration: 0.2 },   // Do5
      ]);
    },

    // ⚠️ Erreur/Alerte - son court aigu
    playError: () => {
      playTone(1000, 0.3);
    },

    // 🔔 Son neutre (pour actions manuelles si besoin)
    playNotification: () => {
      playTone(600, 0.2);
    },
  };
}
