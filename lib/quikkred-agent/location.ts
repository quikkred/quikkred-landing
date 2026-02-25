/**
 * Enhanced Location Service
 * GPS with speed/heading/altitude, IP fallback, WebRTC local IP, VPN detection
 */

export interface EnhancedLocation {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  speed: number | null;
  heading: number | null;
  source: 'gps' | 'ip' | 'cached' | 'unavailable';
  vpnDetected: boolean;
  webrtcIPs: string[];
  timestamp: number;
}

const LOCATION_CACHE_KEY = 'qk_location_history';
const MAX_HISTORY = 20;

function saveToHistory(loc: EnhancedLocation): void {
  try {
    const raw = localStorage.getItem(LOCATION_CACHE_KEY);
    const history: EnhancedLocation[] = raw ? JSON.parse(raw) : [];
    history.unshift(loc);
    if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
    localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(history));
  } catch { /* ignore */ }
}

export function getLocationHistory(): EnhancedLocation[] {
  try {
    const raw = localStorage.getItem(LOCATION_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function getWebRTCLocalIPs(): Promise<string[]> {
  if (typeof window === 'undefined') return [];
  const RTC = window.RTCPeerConnection || (window as any).webkitRTCPeerConnection;
  if (!RTC) return [];

  const ips: string[] = [];
  try {
    const pc = new RTC({ iceServers: [] });
    pc.createDataChannel('');
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    await new Promise<void>((resolve) => {
      const timeout = setTimeout(resolve, 2000);
      pc.onicecandidate = (e) => {
        if (!e.candidate) { clearTimeout(timeout); resolve(); return; }
        const match = e.candidate.candidate.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/);
        if (match && !ips.includes(match[0])) ips.push(match[0]);
      };
    });
    pc.close();
  } catch { /* ignore */ }
  return ips;
}

function isPrivateIP(ip: string): boolean {
  return ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip);
}

function detectVPN(webrtcIPs: string[]): boolean {
  // If WebRTC reveals only private IPs or no IPs, no VPN detected from this signal
  // VPN detection: if WebRTC shows a public IP different from what the server sees,
  // it may indicate a VPN. We flag when we see public WebRTC IPs (unusual for VPN users
  // who typically block WebRTC).
  const publicIPs = webrtcIPs.filter(ip => !isPrivateIP(ip) && ip !== '0.0.0.0');
  // Having multiple public IPs or no WebRTC IPs at all can be suspicious
  // For now: flag if we detect multiple distinct public IPs (suggests proxy/VPN leak)
  return publicIPs.length > 1;
}

export async function captureLocation(): Promise<EnhancedLocation> {
  if (typeof window === 'undefined') {
    return { latitude: null, longitude: null, accuracy: null, altitude: null, altitudeAccuracy: null, speed: null, heading: null, source: 'unavailable', vpnDetected: false, webrtcIPs: [], timestamp: Date.now() };
  }

  const webrtcIPs = await getWebRTCLocalIPs();
  const vpnDetected = detectVPN(webrtcIPs);

  // Try GPS
  if (navigator.geolocation) {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        });
      });

      const loc: EnhancedLocation = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        altitude: pos.coords.altitude,
        altitudeAccuracy: pos.coords.altitudeAccuracy,
        speed: pos.coords.speed,
        heading: pos.coords.heading,
        source: 'gps',
        vpnDetected,
        webrtcIPs,
        timestamp: pos.timestamp,
      };
      saveToHistory(loc);
      return loc;
    } catch { /* fall through to cached */ }
  }

  // Fallback to cached
  const history = getLocationHistory();
  if (history.length > 0) {
    return { ...history[0], source: 'cached', vpnDetected, webrtcIPs, timestamp: Date.now() };
  }

  return { latitude: null, longitude: null, accuracy: null, altitude: null, altitudeAccuracy: null, speed: null, heading: null, source: 'unavailable', vpnDetected, webrtcIPs, timestamp: Date.now() };
}
