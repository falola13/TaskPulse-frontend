// Lightweight JWT helper focused on client/server-friendly expiry checks.
// It does NOT verify signatures; it only decodes the payload and inspects `exp`.

type JwtPayload = {
  exp?: number;
  [key: string]: unknown;
};

function decodeBase64Url(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");

  if (typeof atob === "function") {
    // Edge / browser environments
    return atob(base64);
  }

  // Node.js environment (used in server components/route handlers)
  // eslint-disable-next-line no-undef
  return Buffer.from(base64, "base64").toString("utf8");
}

export function isJwtValid(token: string | undefined | null): boolean {
  if (!token) return false;

  try {
    const parts = token.split(".");
    if (parts.length < 2) return false;

    const payloadPart = parts[1];
    const json = decodeBase64Url(payloadPart);
    const payload = JSON.parse(json) as JwtPayload;

    if (!payload.exp) {
      // No exp claim → treat as valid (or adjust per your policy)
      return true;
    }

    const nowMs = Date.now();
    const expMs = payload.exp * 1000;

    return expMs > nowMs;
  } catch {
    return false;
  }
}

