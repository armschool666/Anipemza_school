import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Stateless signed-cookie sessions.
 *
 * Token format: `<expiresAt>:<nonce>:<HMAC-SHA256(ADMIN_TOKEN, payload)>`
 * No server-side storage needed — the signature proves authenticity and
 * the expiry is embedded in the payload.
 */

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function getKey(): string {
  const key = process.env.ADMIN_TOKEN;
  if (!key) throw new Error("ADMIN_TOKEN is not configured");
  return key;
}

export function createSession(): { token: string; maxAgeSec: number } {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const nonce = randomBytes(16).toString("hex");
  const payload = `${expiresAt}:${nonce}`;
  const mac = createHmac("sha256", getKey()).update(payload).digest("hex");
  return {
    token: `${payload}:${mac}`,
    maxAgeSec: Math.floor(SESSION_TTL_MS / 1000),
  };
}

export function isSessionValid(token: string | undefined): boolean {
  if (!token) return false;
  const lastColon = token.lastIndexOf(":");
  if (lastColon === -1) return false;
  const payload = token.slice(0, lastColon);
  const mac = token.slice(lastColon + 1);
  const expectedMac = createHmac("sha256", getKey()).update(payload).digest("hex");
  try {
    if (mac.length !== expectedMac.length) return false;
    if (!timingSafeEqual(Buffer.from(mac, "hex"), Buffer.from(expectedMac, "hex"))) return false;
  } catch {
    return false;
  }
  const expiresAt = Number(payload.split(":")[0]);
  return !isNaN(expiresAt) && Date.now() < expiresAt;
}

// Stateless — logout is handled client-side by clearing the cookie
export async function revokeSession(_token: string | undefined): Promise<void> {}
