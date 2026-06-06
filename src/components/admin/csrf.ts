let cachedCsrf: string | null = null;
let inflight: Promise<string | null> | null = null;

async function readCsrfCookie(): Promise<string | null> {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)ha_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export async function getCsrfToken(): Promise<string | null> {
  if (cachedCsrf) return cachedCsrf;
  const fromCookie = await readCsrfCookie();
  if (fromCookie) {
    cachedCsrf = fromCookie;
    return fromCookie;
  }
  if (inflight) return inflight;
  inflight = fetch("/api/admin/csrf", { method: "GET", credentials: "same-origin" })
    .then(async (r) => {
      if (!r.ok) return null;
      const j = await r.json().catch(() => ({}));
      cachedCsrf = j.token || null;
      return cachedCsrf;
    })
    .catch(() => null)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function getCsrfCookie(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)ha_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = await getCsrfToken();
  const headers = new Headers(init.headers || {});
  if (init.method && init.method.toUpperCase() !== "GET") {
    headers.set("Content-Type", "application/json");
    if (token) headers.set("X-CSRF-Token", token);
  }
  return fetch(input, { ...init, headers, credentials: "same-origin" });
}
