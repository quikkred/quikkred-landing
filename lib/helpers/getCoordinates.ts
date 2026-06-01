import { getLocationHistory } from "@/lib/quikkred-agent/location";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type LocationErrorCode = "unsupported" | "denied" | "unavailable";

/**
 * Thrown by {@link getCoordinates} when a location fix cannot be obtained.
 * Callers can inspect `code` to decide which message to show.
 */
export class LocationError extends Error {
  code: LocationErrorCode;
  constructor(code: LocationErrorCode, message: string) {
    super(message);
    this.name = "LocationError";
    this.code = code;
  }
}

function getPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function isPermissionDenied(err: unknown): boolean {
  // GeolocationPositionError.PERMISSION_DENIED === 1
  return (
    typeof err === "object" &&
    err !== null &&
    (err as GeolocationPositionError).code === 1
  );
}

/**
 * Returns the device's current latitude/longitude, prompting the browser
 * for permission when needed.
 *
 * Location is REQUIRED: instead of falling back to nulls, this throws a
 * {@link LocationError} when a fix cannot be obtained (permission denied,
 * unsupported, or unavailable) so the caller can block the action and show
 * the user a message. It tries a high-accuracy GPS fix first, then a fast
 * network-based fix, then the last cached location, before giving up.
 */
export async function getCoordinates(timeoutMs = 15000): Promise<Coordinates> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    throw new LocationError(
      "unsupported",
      "Location services are not available on this device."
    );
  }

  // 1) High-accuracy GPS fix.
  try {
    const pos = await getPosition({
      enableHighAccuracy: true,
      timeout: timeoutMs,
      maximumAge: 30000,
    });
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  } catch (err) {
    if (isPermissionDenied(err)) {
      throw new LocationError("denied", "Location permission was denied.");
    }
    /* fall through to a faster, lower-accuracy attempt */
  }

  // 2) Fast network/IP-based fix — accepts a slightly stale cached position
  //    so a slow or unavailable GPS lock doesn't block the user.
  try {
    const pos = await getPosition({
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 120000,
    });
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  } catch (err) {
    if (isPermissionDenied(err)) {
      throw new LocationError("denied", "Location permission was denied.");
    }
  }

  // 3) Last known location as a final fallback.
  const [last] = getLocationHistory();
  if (last && last.latitude != null && last.longitude != null) {
    return { latitude: last.latitude, longitude: last.longitude };
  }

  throw new LocationError(
    "unavailable",
    "Could not determine your location. Please try again."
  );
}

/**
 * User-facing message for a location failure, tuned to the failure reason.
 */
export function locationErrorMessage(err: unknown): string {
  if (err instanceof LocationError && err.code === "denied") {
    return "Location access is required to continue. Please allow location permission in your browser settings and try again.";
  }
  if (err instanceof LocationError && err.code === "unsupported") {
    return "Your device or browser does not support location, which is required to continue.";
  }
  return "We couldn't detect your location. Please enable location services and try again.";
}
