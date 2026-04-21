// Simple two-tone chime generated via Web Audio API.
// No audio asset file required; works across modern browsers.

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (audioCtx) return audioCtx;
  try {
    const Ctor =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
    return audioCtx;
  } catch {
    return null;
  }
}

export function playNotificationSound() {
  const ctx = getCtx();
  if (!ctx) return;

  // Autoplay policy: some browsers keep the context suspended until a user gesture.
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const playTone = (freq: number, startOffset: number, duration: number, peak = 0.15) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const start = ctx.currentTime + startOffset;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(peak, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  };

  // Two-note "di-ding" — pleasant, short, not alarming.
  playTone(880, 0, 0.18);   // A5
  playTone(1318.5, 0.1, 0.25); // E6
}

export function requestNotificationPermission(): void {
  if (typeof window === 'undefined') return;
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
  }
}

export function showBrowserNotification(title: string, body: string, tag?: string): void {
  if (typeof window === 'undefined') return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  try {
    const n = new Notification(title, {
      body,
      tag,
      icon: '/favicon.ico',
      silent: true, // we play our own sound so the OS chime doesn't double-fire
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch {
    // Ignore — some browsers throw on Notification() outside a ServiceWorker (e.g. Android Chrome).
  }
}
