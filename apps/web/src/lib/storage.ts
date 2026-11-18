// localStorage can be missing or throw (private browsing, blocked storage).
// Everything kept here is a convenience for one visitor, so failures are ignored.

export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked: the page still works, it just won't remember */
  }
}