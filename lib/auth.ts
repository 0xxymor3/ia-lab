import crypto from "node:crypto";

export const SESSION_COOKIE = "lab_session";
const SESSION_DAYS = 14;

// En production, les secrets DOIVENT être définis (le dépôt est public : aucun secret par défaut).
// Sans eux, l'espace candidat et l'API sandbox restent désactivés, les pages publiques fonctionnent.
function secret(): string | null {
  if (process.env.SANDBOX_SECRET) return process.env.SANDBOX_SECRET;
  return process.env.NODE_ENV === "production" ? null : "dev-secret-a-remplacer";
}

function password(): string | null {
  if (process.env.LAB_PASSWORD) return process.env.LAB_PASSWORD;
  return process.env.NODE_ENV === "production" ? null : "lab";
}

export function labConfigured() {
  return Boolean(secret() && password());
}

export function checkPassword(candidate: string) {
  const expected = password();
  if (!expected || !secret()) return false;
  const a = crypto.createHash("sha256").update(candidate).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

function hmac(value: string) {
  const s = secret();
  if (!s) throw new Error("SANDBOX_SECRET manquant");
  return crypto.createHmac("sha256", s).update(value).digest("hex");
}

export function createSessionToken() {
  const exp = Date.now() + SESSION_DAYS * 86400000;
  return { token: `${exp}.${hmac(`session:${exp}`)}`, maxAge: SESSION_DAYS * 86400 };
}

export function verifySessionToken(token: string | undefined) {
  if (!token || !secret()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const expected = hmac(`session:${exp}`);
  return sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

// Clé d'API du sandbox : dérivée du secret et de l'identifiant du cas.
export function sandboxApiKey(caseId: string) {
  return `lab_${hmac(`sandbox:${caseId}`).slice(0, 32)}`;
}

export function signPayload(body: string) {
  return `sha256=${hmac(`webhook:${body}`)}`;
}
