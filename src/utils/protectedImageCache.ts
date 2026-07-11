type CacheEntry = {
    url: string;
    refCount: number;
};

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<string>>();

const fetchAndCache = async (src: string, token: string): Promise<string> => {
    const response = await fetch(src, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
        throw new Error(`Failed to load image (${response.status}): ${src}`);
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    cache.set(src, { url: objectUrl, refCount: 0 });
    return objectUrl;
};

/** Resolves the URL to render, reusing an in-flight or cached fetch for the same src. */
export const acquireImageUrl = async (src: string, token: string | null): Promise<string> => {
    if (!token) return src;

    const existing = cache.get(src);
    if (existing) {
        existing.refCount += 1;
        return existing.url;
    }

    let promise = inflight.get(src);
    if (!promise) {
        promise = fetchAndCache(src, token);
        inflight.set(src, promise);
        promise.finally(() => inflight.delete(src));
    }

    const url = await promise;
    const entry = cache.get(src);
    if (entry) entry.refCount += 1;
    return url;
};

/** Call on unmount. Revokes the blob URL only once nothing else is using it. */
export const releaseImageUrl = (src: string) => {
    const entry = cache.get(src);
    if (!entry) return;

    entry.refCount -= 1;
    if (entry.refCount <= 0) {
        if (entry.url.startsWith("blob:")) URL.revokeObjectURL(entry.url);
        cache.delete(src);
    }
};

export const invalidateImageUrl = (src: string) => {
    const entry = cache.get(src);
    if (entry) {
        if (entry.url.startsWith("blob:")) URL.revokeObjectURL(entry.url);
        cache.delete(src);
    }
    inflight.delete(src);
};
