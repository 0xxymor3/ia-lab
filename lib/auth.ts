import crypto from "node:crypto";

export const SESSION_COOKIE = "lab_session";
const SESSION_DAYS = 14;

function secret() {
  const s = process.env.SANDBOX_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") throw new Error("SANDBOX_SECRET manquant");
  return "dev-secret-a-remplacer";
}

export function labPasswordConfigured() {
  return Boolean(process.env.LAB_PASSWORD) || process.env.NODE_ENV !== "production";
}

export function checkPassword(candidate: string) {
  const expected = process.env.LAB_PASSWORD ?? (process.env.NODE_ENV !== "production" ? "lab" : undefined);
  if (!expected) return false;
  const a = crypto.createHash("sha256").update(candidate).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

function hmac(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function createSessionToken() {
  const exp = Date.now() + SESSION_DAYS * 86400000;
  return { token: `${exp}.${hmac(`session:${exp}`)}`, maxAge: SESSION_DAYS * 86400 };
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return false;
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
