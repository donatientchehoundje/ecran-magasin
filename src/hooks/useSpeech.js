export function useSpeech() {
  const speak = (text, options = {}) => {
    // Vérifier que le navigateur supporte Web Speech API
    const synth = window.speechSynthesis;
    if (!synth) {
      console.warn('Web Speech API non supportée');
      return;
    }

    // Arrêter la parole précédente
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Configuration
    utterance.rate = options.rate || 1.0; // Vitesse (0.1 à 10)
    utterance.pitch = options.pitch || 1.0; // Tonalité (0 à 2)
    utterance.volume = options.volume || 1.0; // Volume (0 à 1)
    utterance.lang = options.lang || 'fr-FR'; // Langue

    // Événements optionnels
    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;

    // Chercher voix française si disponible
    const voices = synth.getVoices();
    const frenchVoice = voices.find(v => v.lang.startsWith('fr'));
    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    // Parler
    synth.speak(utterance);
  };

  return { speak };
}
