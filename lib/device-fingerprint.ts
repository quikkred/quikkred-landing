/**
 * Device Fingerprinting Service for Quikkred
 * Comprehensive browser data collection for fraud prevention & risk assessment
 *
 * Collects:
 * - Device & Hardware info
 * - Browser fingerprint (Canvas, WebGL, Audio)
 * - Network information
 * - Geolocation (with permission)
 * - Session & behavior data
 */

// ============================================
// TYPES
// ============================================

export interface DeviceFingerprint {
  // Unique fingerprint hash
  fingerprintId: string;

  // Basic Device Info
  device: {
    platform: string;
    userAgent: string;
    vendor: string;
    language: string;
    languages: string[];
    cookieEnabled: boolean;
    doNotTrack: string | null;
    hardwareConcurrency: number;
    deviceMemory: number | null;
    maxTouchPoints: number;
    colorDepth: number;
    pixelRatio: number;
  };

  // Screen Info
  screen: {
    width: number;
    height: number;
    availWidth: number;
    availHeight: number;
    colorDepth: number;
    pixelDepth: number;
    orientation: string;
  };

  // Browser Info
  browser: {
    name: string;
    version: string;
    engine: string;
    plugins: string[];
    mimeTypes: string[];
    pdfViewerEnabled: boolean;
    webdriver: boolean;
  };

  // Timezone & Location
  timezone: {
    offset: number;
    name: string;
    locale: string;
  };

  // Network Info
  network: {
    connectionType: string | null;
    effectiveType: string | null;
    downlink: number | null;
    rtt: number | null;
    saveData: boolean;
    onLine: boolean;
  };

  // Canvas Fingerprint
  canvas: {
    hash: string;
    supported: boolean;
  };

  // WebGL Fingerprint
  webgl: {
    vendor: string | null;
    renderer: string | null;
    hash: string;
    supported: boolean;
  };

  // Audio Fingerprint
  audio: {
    hash: string;
    supported: boolean;
  };

  // Storage & Features
  features: {
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    webSockets: boolean;
    webWorkers: boolean;
    serviceWorker: boolean;
    webRTC: boolean;
    geolocation: boolean;
    notifications: boolean;
    clipboard: boolean;
    bluetooth: boolean;
    usb: boolean;
    midi: boolean;
    speechSynthesis: boolean;
    speechRecognition: boolean;
  };

  // Battery Info (if available)
  battery: {
    charging: boolean | null;
    level: number | null;
    chargingTime: number | null;
    dischargingTime: number | null;
  } | null;

  // Geolocation (if permitted)
  geolocation: {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    timestamp: number | null;
    error: string | null;
  } | null;

  // WebRTC Local IPs
  webrtcIPs: string[];

  // Installed Fonts (sample)
  fonts: string[];

  // Session Info
  session: {
    referrer: string;
    landingPage: string;
    currentPage: string;
    historyLength: number;
    sessionStart: number;
    pageLoadTime: number;
  };

  // Behavior Signals
  behavior: {
    hasTouch: boolean;
    hasMouse: boolean;
    hasKeyboard: boolean;
    hasGamepad: boolean;
  };

  // Risk Indicators
  riskIndicators: {
    isIncognito: boolean;
    isBot: boolean;
    isVirtualMachine: boolean;
    isEmulator: boolean;
    hasAutomation: boolean;
    suspiciousPlugins: boolean;
    timezoneAnomaly: boolean;
  };

  // Timestamps
  collectedAt: string;
  processingTime: number;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Generate hash from string
async function hashString(str: string): Promise<string> {
  if (typeof window === 'undefined') return '';

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback simple hash
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

// Detect browser name and version
function detectBrowser(): { name: string; version: string; engine: string } {
  if (typeof window === 'undefined') return { name: 'unknown', version: '0', engine: 'unknown' };

  const ua = navigator.userAgent;
  let name = 'unknown';
  let version = '0';
  let engine = 'unknown';

  if (ua.includes('Firefox/')) {
    name = 'Firefox';
    version = ua.match(/Firefox\/(\d+)/)?.[1] || '0';
    engine = 'Gecko';
  } else if (ua.includes('Edg/')) {
    name = 'Edge';
    version = ua.match(/Edg\/(\d+)/)?.[1] || '0';
    engine = 'Blink';
  } else if (ua.includes('Chrome/')) {
    name = 'Chrome';
    version = ua.match(/Chrome\/(\d+)/)?.[1] || '0';
    engine = 'Blink';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    name = 'Safari';
    version = ua.match(/Version\/(\d+)/)?.[1] || '0';
    engine = 'WebKit';
  } else if (ua.includes('Opera') || ua.includes('OPR/')) {
    name = 'Opera';
    version = ua.match(/(?:Opera|OPR)\/(\d+)/)?.[1] || '0';
    engine = 'Blink';
  }

  return { name, version, engine };
}

// Get Canvas fingerprint
async function getCanvasFingerprint(): Promise<{ hash: string; supported: boolean }> {
  if (typeof window === 'undefined') return { hash: '', supported: false };

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return { hash: '', supported: false };

    canvas.width = 200;
    canvas.height = 50;

    // Draw complex pattern
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Quikkred Fingerprint', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Risk Assessment', 4, 17);

    // Add some shapes
    ctx.beginPath();
    ctx.arc(50, 25, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#ff5500';
    ctx.fill();

    const dataUrl = canvas.toDataURL();
    const hash = await hashString(dataUrl);

    return { hash, supported: true };
  } catch {
    return { hash: '', supported: false };
  }
}

// Get WebGL fingerprint
function getWebGLFingerprint(): { vendor: string | null; renderer: string | null; hash: string; supported: boolean } {
  if (typeof window === 'undefined') return { vendor: null, renderer: null, hash: '', supported: false };

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;

    if (!gl) return { vendor: null, renderer: null, hash: '', supported: false };

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);

    const hash = `${vendor}~${renderer}`;

    return { vendor, renderer, hash, supported: true };
  } catch {
    return { vendor: null, renderer: null, hash: '', supported: false };
  }
}

// Get Audio fingerprint
async function getAudioFingerprint(): Promise<{ hash: string; supported: boolean }> {
  if (typeof window === 'undefined') return { hash: '', supported: false };

  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return { hash: '', supported: false };

    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const analyser = context.createAnalyser();
    const gainNode = context.createGain();
    const scriptProcessor = context.createScriptProcessor(4096, 1, 1);

    gainNode.gain.value = 0; // Mute
    oscillator.type = 'triangle';
    oscillator.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(0);

    const fingerprint = await new Promise<string>((resolve) => {
      scriptProcessor.onaudioprocess = (e) => {
        const output = e.inputBuffer.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < output.length; i++) {
          sum += Math.abs(output[i]);
        }
        oscillator.disconnect();
        scriptProcessor.disconnect();
        gainNode.disconnect();
        context.close();
        resolve(sum.toString());
      };
    });

    const hash = await hashString(fingerprint);
    return { hash, supported: true };
  } catch {
    return { hash: '', supported: false };
  }
}

// Get WebRTC local IPs
async function getWebRTCIPs(): Promise<string[]> {
  if (typeof window === 'undefined') return [];

  try {
    const ips: string[] = [];
    const RTCPeerConnection = window.RTCPeerConnection || (window as any).webkitRTCPeerConnection || (window as any).mozRTCPeerConnection;

    if (!RTCPeerConnection) return [];

    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');

    await pc.createOffer().then(offer => pc.setLocalDescription(offer));

    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => resolve(), 1000);

      pc.onicecandidate = (event) => {
        if (!event.candidate) {
          clearTimeout(timeout);
          resolve();
          return;
        }

        const candidate = event.candidate.candidate;
        const ipMatch = candidate.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/);
        if (ipMatch && !ips.includes(ipMatch[0])) {
          ips.push(ipMatch[0]);
        }
      };
    });

    pc.close();
    return ips;
  } catch {
    return [];
  }
}

// Detect installed fonts (sampling common fonts)
function detectFonts(): string[] {
  if (typeof window === 'undefined') return [];

  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testFonts = [
    'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia',
    'Impact', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings',
    'Lucida Console', 'Lucida Sans Unicode', 'Tahoma', 'Microsoft Sans Serif',
    'Palatino Linotype', 'Segoe UI', 'Roboto', 'Open Sans', 'Noto Sans',
    // Indian language fonts
    'Mangal', 'Nirmala UI', 'Latha', 'Gautami', 'Tunga', 'Kartika',
    'Vrinda', 'Raavi', 'Shruti', 'Kalinga', 'Aparajita'
  ];

  const detectedFonts: string[] = [];

  const testString = 'mmmmmmmmmmlli';
  const testSize = '72px';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  const baseSizes: Record<string, number> = {};

  baseFonts.forEach(baseFont => {
    ctx.font = `${testSize} ${baseFont}`;
    baseSizes[baseFont] = ctx.measureText(testString).width;
  });

  testFonts.forEach(font => {
    let detected = false;

    for (const baseFont of baseFonts) {
      ctx.font = `${testSize} "${font}", ${baseFont}`;
      const width = ctx.measureText(testString).width;

      if (width !== baseSizes[baseFont]) {
        detected = true;
        break;
      }
    }

    if (detected) {
      detectedFonts.push(font);
    }
  });

  return detectedFonts;
}

// Check for incognito/private mode
async function isIncognito(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    // Check storage quota (smaller in incognito)
    const storage = await navigator.storage?.estimate?.();
    if (storage && storage.quota && storage.quota < 120000000) {
      return true;
    }

    // Check IndexedDB behavior
    const fs = (window as any).RequestFileSystem || (window as any).webkitRequestFileSystem;
    if (fs) {
      return new Promise((resolve) => {
        fs(0, 0, () => resolve(false), () => resolve(true));
      });
    }

    return false;
  } catch {
    return false;
  }
}

// Detect bot/automation
function detectBot(): boolean {
  if (typeof window === 'undefined') return false;

  const indicators = [
    navigator.webdriver,
    !!(window as any).callPhantom,
    !!(window as any).__nightmare,
    !!(window as any).domAutomation,
    !!(window as any).domAutomationController,
    !!document.documentElement.getAttribute('webdriver'),
    navigator.userAgent.toLowerCase().includes('headless'),
    navigator.userAgent.toLowerCase().includes('phantom'),
    navigator.languages?.length === 0,
    !navigator.plugins || navigator.plugins.length === 0,
  ];

  return indicators.some(Boolean);
}

// Detect virtual machine
function detectVirtualMachine(): boolean {
  if (typeof window === 'undefined') return false;

  const webglInfo = getWebGLFingerprint();
  const renderer = webglInfo.renderer?.toLowerCase() || '';

  const vmIndicators = [
    'virtualbox', 'vmware', 'parallels', 'hyper-v', 'qemu',
    'virtual', 'vbox', 'xen', 'kvm', 'bochs'
  ];

  return vmIndicators.some(vm => renderer.includes(vm));
}

// Get battery info
async function getBatteryInfo(): Promise<DeviceFingerprint['battery']> {
  if (typeof window === 'undefined') return null;

  try {
    const battery = await (navigator as any).getBattery?.();
    if (!battery) return null;

    return {
      charging: battery.charging,
      level: battery.level,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime
    };
  } catch {
    return null;
  }
}

// Get geolocation
async function getGeolocation(): Promise<DeviceFingerprint['geolocation']> {
  if (typeof window === 'undefined') return null;

  try {
    if (!navigator.geolocation) {
      return { latitude: null, longitude: null, accuracy: null, timestamp: null, error: 'Not supported' };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            error: null
          });
        },
        (error) => {
          resolve({
            latitude: null,
            longitude: null,
            accuracy: null,
            timestamp: null,
            error: error.message
          });
        },
        { timeout: 5000, maximumAge: 60000 }
      );
    });
  } catch (e) {
    return { latitude: null, longitude: null, accuracy: null, timestamp: null, error: 'Failed' };
  }
}

// Get network info
function getNetworkInfo(): DeviceFingerprint['network'] {
  if (typeof window === 'undefined') {
    return { connectionType: null, effectiveType: null, downlink: null, rtt: null, saveData: false, onLine: true };
  }

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

  return {
    connectionType: connection?.type || null,
    effectiveType: connection?.effectiveType || null,
    downlink: connection?.downlink || null,
    rtt: connection?.rtt || null,
    saveData: connection?.saveData || false,
    onLine: navigator.onLine
  };
}

// Get plugins list
function getPlugins(): string[] {
  if (typeof window === 'undefined' || !navigator.plugins) return [];

  const plugins: string[] = [];
  for (let i = 0; i < navigator.plugins.length; i++) {
    plugins.push(navigator.plugins[i].name);
  }
  return plugins;
}

// Get MIME types
function getMimeTypes(): string[] {
  if (typeof window === 'undefined' || !navigator.mimeTypes) return [];

  const mimeTypes: string[] = [];
  for (let i = 0; i < navigator.mimeTypes.length; i++) {
    mimeTypes.push(navigator.mimeTypes[i].type);
  }
  return mimeTypes;
}

// ============================================
// MAIN FINGERPRINT COLLECTION
// ============================================

export async function collectDeviceFingerprint(
  options: {
    includeGeolocation?: boolean;
    includeWebRTC?: boolean;
  } = {}
): Promise<DeviceFingerprint> {
  const startTime = performance.now();

  if (typeof window === 'undefined') {
    throw new Error('Device fingerprinting requires browser environment');
  }

  const browser = detectBrowser();
  const canvasFingerprint = await getCanvasFingerprint();
  const webglFingerprint = getWebGLFingerprint();
  const audioFingerprint = await getAudioFingerprint();
  const webrtcIPs = options.includeWebRTC !== false ? await getWebRTCIPs() : [];
  const fonts = detectFonts();
  const batteryInfo = await getBatteryInfo();
  const isIncognitoMode = await isIncognito();
  const isBot = detectBot();
  const isVM = detectVirtualMachine();
  const geolocation = options.includeGeolocation ? await getGeolocation() : null;

  // Build comprehensive fingerprint
  const fingerprint: DeviceFingerprint = {
    fingerprintId: '', // Will be generated

    device: {
      platform: navigator.platform || 'unknown',
      userAgent: navigator.userAgent,
      vendor: navigator.vendor || 'unknown',
      language: navigator.language,
      languages: Array.from(navigator.languages || []),
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      deviceMemory: (navigator as any).deviceMemory || null,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio || 1
    },

    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth || screen.colorDepth,
      orientation: screen.orientation?.type || 'unknown'
    },

    browser: {
      name: browser.name,
      version: browser.version,
      engine: browser.engine,
      plugins: getPlugins(),
      mimeTypes: getMimeTypes(),
      pdfViewerEnabled: (navigator as any).pdfViewerEnabled || false,
      webdriver: navigator.webdriver || false
    },

    timezone: {
      offset: new Date().getTimezoneOffset(),
      name: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: Intl.DateTimeFormat().resolvedOptions().locale
    },

    network: getNetworkInfo(),

    canvas: canvasFingerprint,
    webgl: webglFingerprint,
    audio: audioFingerprint,

    features: {
      localStorage: (() => { try { return !!localStorage; } catch { return false; } })(),
      sessionStorage: (() => { try { return !!sessionStorage; } catch { return false; } })(),
      indexedDB: !!window.indexedDB,
      webSockets: 'WebSocket' in window,
      webWorkers: 'Worker' in window,
      serviceWorker: 'serviceWorker' in navigator,
      webRTC: 'RTCPeerConnection' in window,
      geolocation: 'geolocation' in navigator,
      notifications: 'Notification' in window,
      clipboard: 'clipboard' in navigator,
      bluetooth: 'bluetooth' in navigator,
      usb: 'usb' in navigator,
      midi: 'requestMIDIAccess' in navigator,
      speechSynthesis: 'speechSynthesis' in window,
      speechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    },

    battery: batteryInfo,
    geolocation: geolocation,
    webrtcIPs: webrtcIPs,
    fonts: fonts,

    session: {
      referrer: document.referrer,
      landingPage: sessionStorage.getItem('qk_landing_page') || window.location.pathname,
      currentPage: window.location.pathname,
      historyLength: history.length,
      sessionStart: parseInt(sessionStorage.getItem('qk_session_start') || Date.now().toString()),
      pageLoadTime: performance.timing?.loadEventEnd - performance.timing?.navigationStart || 0
    },

    behavior: {
      hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      hasMouse: window.matchMedia('(pointer: fine)').matches,
      hasKeyboard: true, // Assumed
      hasGamepad: 'getGamepads' in navigator
    },

    riskIndicators: {
      isIncognito: isIncognitoMode,
      isBot: isBot,
      isVirtualMachine: isVM,
      isEmulator: webglFingerprint.renderer?.toLowerCase().includes('swiftshader') || false,
      hasAutomation: navigator.webdriver || false,
      suspiciousPlugins: getPlugins().some(p =>
        p.toLowerCase().includes('selenium') ||
        p.toLowerCase().includes('puppeteer')
      ),
      timezoneAnomaly: Math.abs(new Date().getTimezoneOffset() - 330) > 60 &&
                       navigator.language.startsWith('hi') // Indian timezone check
    },

    collectedAt: new Date().toISOString(),
    processingTime: 0 // Will be updated
  };

  // Generate unique fingerprint ID from key attributes
  const fingerprintString = [
    fingerprint.canvas.hash,
    fingerprint.webgl.hash,
    fingerprint.audio.hash,
    fingerprint.device.userAgent,
    fingerprint.screen.width,
    fingerprint.screen.height,
    fingerprint.timezone.name,
    fingerprint.fonts.join(',')
  ].join('|');

  fingerprint.fingerprintId = await hashString(fingerprintString);
  fingerprint.processingTime = Math.round(performance.now() - startTime);

  // Store landing page for session tracking
  if (!sessionStorage.getItem('qk_landing_page')) {
    sessionStorage.setItem('qk_landing_page', window.location.pathname);
  }
  if (!sessionStorage.getItem('qk_session_start')) {
    sessionStorage.setItem('qk_session_start', Date.now().toString());
  }

  return fingerprint;
}

// ============================================
// STORAGE & RETRIEVAL
// ============================================

const FINGERPRINT_KEY = 'qk_device_fingerprint';

export function storeFingerprint(fingerprint: DeviceFingerprint): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(FINGERPRINT_KEY, JSON.stringify({
      ...fingerprint,
      storedAt: new Date().toISOString()
    }));
  } catch (e) {
    console.error('[Fingerprint] Failed to store:', e);
  }
}

export function getStoredFingerprint(): DeviceFingerprint | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(FINGERPRINT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function clearStoredFingerprint(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FINGERPRINT_KEY);
}

// ============================================
// SINGLETON SERVICE
// ============================================

class DeviceFingerprintService {
  private fingerprint: DeviceFingerprint | null = null;
  private collecting: boolean = false;

  async collect(options?: { includeGeolocation?: boolean; includeWebRTC?: boolean }): Promise<DeviceFingerprint> {
    if (this.collecting) {
      // Wait for ongoing collection
      await new Promise(resolve => setTimeout(resolve, 100));
      if (this.fingerprint) return this.fingerprint;
    }

    this.collecting = true;

    try {
      this.fingerprint = await collectDeviceFingerprint(options);
      storeFingerprint(this.fingerprint);
      return this.fingerprint;
    } finally {
      this.collecting = false;
    }
  }

  get(): DeviceFingerprint | null {
    return this.fingerprint || getStoredFingerprint();
  }

  getFingerprintId(): string | null {
    const fp = this.get();
    return fp?.fingerprintId || null;
  }

  isHighRisk(): boolean {
    const fp = this.get();
    if (!fp) return false;

    const { riskIndicators } = fp;
    return (
      riskIndicators.isBot ||
      riskIndicators.hasAutomation ||
      riskIndicators.isEmulator ||
      (riskIndicators.isIncognito && riskIndicators.timezoneAnomaly)
    );
  }

  getRiskScore(): number {
    const fp = this.get();
    if (!fp) return 0;

    let score = 0;
    const { riskIndicators } = fp;

    if (riskIndicators.isBot) score += 50;
    if (riskIndicators.hasAutomation) score += 40;
    if (riskIndicators.isEmulator) score += 30;
    if (riskIndicators.isIncognito) score += 10;
    if (riskIndicators.isVirtualMachine) score += 20;
    if (riskIndicators.suspiciousPlugins) score += 25;
    if (riskIndicators.timezoneAnomaly) score += 15;

    return Math.min(score, 100);
  }
}

export const deviceFingerprint = new DeviceFingerprintService();
export default deviceFingerprint;
