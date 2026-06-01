import { getLocationHistory } from "@/lib/quikkred-agent/location";

export interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

function getPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

/**
 * Best-effort browser geolocation for address verification.
 *
 * Resolves with the device's latitude/longitude when the user grants
 * permission. To maximise the chance of getting a value on every call it
 * first tries a high-accuracy GPS fix, then falls back to a fast
 * network-based fix, and finally to the last cached location. It never
 * throws or blocks indefinitely, so it is safe to await directly inside
 * auth flows (login / signup / DigiLocker).
 */
export async function getCoordinates(timeoutMs = 15000): Promise<Coordinates> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    return fromCache();
  }

  // 1) High-accuracy GPS fix.
  try {
    const pos = await getPosition({
      enableHighAccuracy: true,
      timeout: timeoutMs,
      maximumAge: 30000,
    });
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  } catch {
    /* fall through to a faster, lower-accuracy attempt */
  }

  // 2) Fast network/IP-based fix — accepts a slightly stale cached position
  //    so a slow or unavailable GPS lock doesn't leave us with nulls.
  try {
    const pos = await getPosition({
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 120000,
    });
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  } catch {
    // Permission denied, position unavailable, or timed out — use last known.
    return fromCache();
  }
}

function fromCache(): Coordinates {
  const [last] = getLocationHistory();
  return {
    latitude: last?.latitude ?? null,
    longitude: last?.longitude ?? null,
  };
}
