// === exports =======================================================

export { getCached };

// === exported functions ============================================

const cache = new Map<string, any>();

function getCached<T>(key: string, getter: () => T): T {
  return cache.has(key)
    ? cache.get(key)
    : (() => {
        const subject = getter();
        cache.set(key, subject);
        return subject;
      })();
}
