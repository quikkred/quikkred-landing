/**
 * Behavioral Biometrics
 * Captures typing rhythm, mouse/touch patterns, scroll behavior, form interaction.
 * Privacy-safe: timing only, never actual keystrokes.
 */

export interface TypingRhythm {
  avgKeyInterval: number;
  keyIntervalStdDev: number;
  avgDwellTime: number;
  sampleSize: number;
}

export interface MousePatterns {
  avgSpeed: number;
  avgAcceleration: number;
  straightness: number; // ratio of straight-line to actual distance
  clickCount: number;
  rightClickCount: number;
  sampleSize: number;
}

export interface ScrollBehavior {
  totalScrollDistance: number;
  avgScrollSpeed: number;
  directionChanges: number;
  maxScrollDepth: number;
}

export interface FormInteraction {
  pasteDetected: boolean;
  pasteFields: string[];
  hesitationCount: number; // pauses > 3s while typing
  correctionRate: number; // backspace ratio
  tabSwitchCount: number;
  focusLostCount: number;
  totalFieldTime: number;
}

export interface BehavioralData {
  typing: TypingRhythm;
  mouse: MousePatterns;
  scroll: ScrollBehavior;
  form: FormInteraction;
  collectedAt: number;
}

class BehavioralCollector {
  // Typing
  private keyTimestamps: number[] = [];
  private keyDownTimes: Map<string, number> = new Map();
  private dwellTimes: number[] = [];
  private backspaceCount = 0;
  private totalKeyCount = 0;
  private hesitationCount = 0;
  private lastKeyTime = 0;

  // Mouse
  private mousePositions: { x: number; y: number; t: number }[] = [];
  private clickCount = 0;
  private rightClickCount = 0;

  // Scroll
  private scrollDistances: number[] = [];
  private lastScrollY = 0;
  private scrollDirectionChanges = 0;
  private lastScrollDirection: 'up' | 'down' | null = null;
  private maxScrollDepth = 0;

  // Form
  private pasteFields: Set<string> = new Set();
  private tabSwitchCount = 0;
  private focusLostCount = 0;
  private fieldStartTime = 0;
  private totalFieldTime = 0;

  private listeners: Array<[EventTarget, string, EventListener]> = [];
  private active = false;

  start(): void {
    if (this.active || typeof window === 'undefined') return;
    this.active = true;

    const add = (target: EventTarget, event: string, handler: EventListener) => {
      target.addEventListener(event, handler, { passive: true });
      this.listeners.push([target, event, handler]);
    };

    // Typing (on document to catch all inputs)
    add(document, 'keydown', ((e: KeyboardEvent) => {
      const now = performance.now();
      if (this.lastKeyTime > 0 && now - this.lastKeyTime > 3000) {
        this.hesitationCount++;
      }
      this.keyTimestamps.push(now);
      this.keyDownTimes.set(e.code, now);
      this.totalKeyCount++;
      if (e.key === 'Backspace' || e.key === 'Delete') this.backspaceCount++;
      this.lastKeyTime = now;
    }) as EventListener);

    add(document, 'keyup', ((e: KeyboardEvent) => {
      const downTime = this.keyDownTimes.get(e.code);
      if (downTime) {
        this.dwellTimes.push(performance.now() - downTime);
        this.keyDownTimes.delete(e.code);
      }
    }) as EventListener);

    // Mouse movement (throttled)
    let lastMouseCapture = 0;
    add(document, 'mousemove', ((e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseCapture < 100) return; // 10 samples/sec max
      lastMouseCapture = now;
      this.mousePositions.push({ x: e.clientX, y: e.clientY, t: now });
      if (this.mousePositions.length > 500) this.mousePositions.shift();
    }) as EventListener);

    add(document, 'click', (() => { this.clickCount++; }) as EventListener);
    add(document, 'contextmenu', (() => { this.rightClickCount++; }) as EventListener);

    // Scroll
    add(window, 'scroll', (() => {
      const y = window.scrollY;
      const dist = Math.abs(y - this.lastScrollY);
      this.scrollDistances.push(dist);

      const dir = y > this.lastScrollY ? 'down' : 'up';
      if (this.lastScrollDirection && dir !== this.lastScrollDirection) {
        this.scrollDirectionChanges++;
      }
      this.lastScrollDirection = dir;
      this.lastScrollY = y;

      const depth = (y + window.innerHeight) / document.documentElement.scrollHeight;
      if (depth > this.maxScrollDepth) this.maxScrollDepth = depth;
    }) as EventListener);

    // Paste detection
    add(document, 'paste', ((e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      const fieldName = (target as HTMLInputElement).name || target.id || target.className.slice(0, 30);
      if (fieldName) this.pasteFields.add(fieldName);
    }) as EventListener);

    // Tab switch / focus lost
    add(document, 'visibilitychange', (() => {
      if (document.hidden) {
        this.tabSwitchCount++;
        this.focusLostCount++;
      }
    }) as EventListener);
  }

  /** Call when user focuses a form field */
  onFieldFocus(): void {
    this.fieldStartTime = performance.now();
  }

  /** Call when user blurs a form field */
  onFieldBlur(): void {
    if (this.fieldStartTime > 0) {
      this.totalFieldTime += performance.now() - this.fieldStartTime;
      this.fieldStartTime = 0;
    }
  }

  snapshot(): BehavioralData {
    // Typing rhythm
    const intervals: number[] = [];
    for (let i = 1; i < this.keyTimestamps.length; i++) {
      intervals.push(this.keyTimestamps[i] - this.keyTimestamps[i - 1]);
    }
    const avgKeyInterval = intervals.length > 0 ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 0;
    const variance = intervals.length > 1
      ? intervals.reduce((sum, v) => sum + Math.pow(v - avgKeyInterval, 2), 0) / (intervals.length - 1)
      : 0;
    const avgDwellTime = this.dwellTimes.length > 0
      ? this.dwellTimes.reduce((a, b) => a + b, 0) / this.dwellTimes.length
      : 0;

    // Mouse patterns
    let totalSpeed = 0, totalAccel = 0, straightLine = 0, actualDist = 0;
    const speeds: number[] = [];
    for (let i = 1; i < this.mousePositions.length; i++) {
      const prev = this.mousePositions[i - 1];
      const curr = this.mousePositions[i];
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const dt = (curr.t - prev.t) / 1000;
      if (dt <= 0) continue;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = dist / dt;
      speeds.push(speed);
      totalSpeed += speed;
      actualDist += dist;
    }
    if (this.mousePositions.length >= 2) {
      const first = this.mousePositions[0];
      const last = this.mousePositions[this.mousePositions.length - 1];
      straightLine = Math.sqrt(Math.pow(last.x - first.x, 2) + Math.pow(last.y - first.y, 2));
    }
    for (let i = 1; i < speeds.length; i++) {
      totalAccel += Math.abs(speeds[i] - speeds[i - 1]);
    }

    const mSamples = Math.max(this.mousePositions.length - 1, 0);

    return {
      typing: {
        avgKeyInterval: Math.round(avgKeyInterval),
        keyIntervalStdDev: Math.round(Math.sqrt(variance)),
        avgDwellTime: Math.round(avgDwellTime),
        sampleSize: this.keyTimestamps.length,
      },
      mouse: {
        avgSpeed: mSamples > 0 ? Math.round(totalSpeed / mSamples) : 0,
        avgAcceleration: speeds.length > 1 ? Math.round(totalAccel / (speeds.length - 1)) : 0,
        straightness: actualDist > 0 ? Math.round((straightLine / actualDist) * 100) / 100 : 0,
        clickCount: this.clickCount,
        rightClickCount: this.rightClickCount,
        sampleSize: mSamples,
      },
      scroll: {
        totalScrollDistance: this.scrollDistances.reduce((a, b) => a + b, 0),
        avgScrollSpeed: this.scrollDistances.length > 0
          ? Math.round(this.scrollDistances.reduce((a, b) => a + b, 0) / this.scrollDistances.length)
          : 0,
        directionChanges: this.scrollDirectionChanges,
        maxScrollDepth: Math.round(this.maxScrollDepth * 100) / 100,
      },
      form: {
        pasteDetected: this.pasteFields.size > 0,
        pasteFields: Array.from(this.pasteFields),
        hesitationCount: this.hesitationCount,
        correctionRate: this.totalKeyCount > 0
          ? Math.round((this.backspaceCount / this.totalKeyCount) * 100) / 100
          : 0,
        tabSwitchCount: this.tabSwitchCount,
        focusLostCount: this.focusLostCount,
        totalFieldTime: Math.round(this.totalFieldTime),
      },
      collectedAt: Date.now(),
    };
  }

  reset(): void {
    this.keyTimestamps = [];
    this.keyDownTimes.clear();
    this.dwellTimes = [];
    this.backspaceCount = 0;
    this.totalKeyCount = 0;
    this.hesitationCount = 0;
    this.lastKeyTime = 0;
    this.mousePositions = [];
    this.clickCount = 0;
    this.rightClickCount = 0;
    this.scrollDistances = [];
    this.scrollDirectionChanges = 0;
    this.lastScrollDirection = null;
    this.maxScrollDepth = 0;
    this.pasteFields.clear();
    this.tabSwitchCount = 0;
    this.focusLostCount = 0;
    this.totalFieldTime = 0;
    this.fieldStartTime = 0;
  }

  stop(): void {
    for (const [target, event, handler] of this.listeners) {
      target.removeEventListener(event, handler);
    }
    this.listeners = [];
    this.active = false;
  }
}

export const behavioralCollector = new BehavioralCollector();
