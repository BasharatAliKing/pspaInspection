export async function fetchWithTokenCheck(input, init = {}) {
  const token = localStorage.getItem("token");

  const incomingHeaders = init.headers || {};

  const headers = new Headers(incomingHeaders);

  if (token && !headers.get("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // If body is present and Content-Type not set, default to JSON
  if (init.body && !headers.get("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    // unauthorized — clear token and redirect to login so user can re-authenticate
    try {
      localStorage.removeItem("token");
    } catch (e) {
      // ignore
    }
    // navigate to login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  return response;
}

export default fetchWithTokenCheck;
