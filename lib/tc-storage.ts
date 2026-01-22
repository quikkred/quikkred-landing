// Shared in-memory store for verification status
export const tcStorage = new Map<string, { status: string; data: any; timestamp: number }>();

// Auto-cleanup: remove entries older than 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, value] of tcStorage.entries()) {
            if (now - value.timestamp > 300000) tcStorage.delete(key);
        }
    }, 300000);
}