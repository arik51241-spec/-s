export class AudioManager {
  private context: AudioContext | null = null;
  enabled = true;

  setEnabled(enabled: boolean) { this.enabled = enabled; }

  private tone(frequency: number, duration: number, type: OscillatorType = "square", endFrequency?: number) {
    if (!this.enabled || typeof window === "undefined") return;
    this.context ??= new AudioContext();
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
    gain.gain.setValueAtTime(.08, now);
    gain.gain.exponentialRampToValueAtTime(.001, now + duration);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(now); oscillator.stop(now + duration);
  }

  click() { this.tone(240, .05); }
  countdown(value: number) { this.tone(value === 0 ? 680 : 320 + value * 60, .12); }
  impact(strength = 1) { this.tone(95 + strength * 20, .12, "sawtooth", 48); }
  headHit() { this.tone(760, .25, "square", 120); window.setTimeout(() => this.tone(980, .18), 90); }
  boost() { this.tone(220, .35, "square", 880); }
  victory() { [0, 100, 210].forEach((delay, index) => window.setTimeout(() => this.tone([440, 660, 880][index], .18), delay)); }
  warning() { this.tone(150, .16, "square", 90); }
}
