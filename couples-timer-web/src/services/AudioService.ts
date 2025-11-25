// Define the paths to our audio files
export const AUDIO_PATHS = {
  BOWL_DEEP_SINGLE: '/audio/bowl_deep_single.wav',
  BOWL_RISING: '/audio/bowl_rising.wav',
  BOWL_CLEAR: '/audio/bowl_clear.wav',
  BOWL_DOUBLE: '/audio/bowl_double.wav',
  BOWL_FADE: '/audio/bowl_fade.wav',
  BOWL_TRIPLE: '/audio/bowl_triple.wav',
} as const;

export type AudioFileName = keyof typeof AUDIO_PATHS;

// In a real implementation, we would pre-load the audio files here
// For now, we'll just define the interface
export interface AudioServiceProtocol {
  playSound: (audioEvent: AudioFileName) => Promise<void>;
  setVolume: (volume: number) => void;
  getVolume: () => number;
}

class AudioService implements AudioServiceProtocol {
  private volume: number = 0.7; // Default volume at 70%
  private audioElements: Map<AudioFileName, HTMLAudioElement> = new Map();

  constructor() {
    // Preload audio files
    this.preloadAudio();
  }

  private preloadAudio() {
    (Object.keys(AUDIO_PATHS) as Array<AudioFileName>).forEach(key => {
      const audio = new Audio(AUDIO_PATHS[key]);
      audio.preload = 'auto';
      this.audioElements.set(key, audio);
    });
  }

  async playSound(audioEvent: AudioFileName): Promise<void> {
    try {
      const audio = this.audioElements.get(audioEvent);
      if (audio) {
        audio.currentTime = 0; // Reset to beginning
        audio.volume = this.volume;
        await audio.play();
      }
    } catch (error) {
      console.warn(`Could not play audio for ${audioEvent}:`, error);
      // Fallback: some browsers require user interaction before playing audio
      // In a real implementation, we would handle this with a user consent flow
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
  }

  getVolume(): number {
    return this.volume;
  }
}

// Singleton instance
export const audioService = new AudioService();