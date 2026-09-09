const SESSION_KEY = "cyclone-ai-session";

export function startLocalSession() {
  window.localStorage.setItem(SESSION_KEY, "active");
}

export function endLocalSession() {
  window.localStorage.removeItem(SESSION_KEY);
}