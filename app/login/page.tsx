import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkPassword, createSessionToken, labConfigured, SESSION_COOKIE } from "@/lib/auth";

export const metadata: Metadata = { title: "Connexion" };

async function login(formData: FormData) {
  "use server";
  const next = String(formData.get("next") ?? "/lab");
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/lab";
  if (!checkPassword(String(formData.get("password") ?? ""))) redirect(`/login?erreur=1&next=${encodeURIComponent(safeNext)}`);
  const { token, maxAge } = createSessionToken();
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge, path: "/" });
  redirect(safeNext);
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const sp = await searchParams;
  const erreur = sp.erreur === "1";
  const next = typeof sp.next === "string" ? sp.next : "/lab";
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-serif text-2xl font-semibold">Espace candidat</h1>
      <p className="text-sm text-muted mt-2">Le hub d&apos;immersion et le testeur sont réservés au candidat.</p>
      {!labConfigured() ? (
        <p className="mt-6 text-sm text-danger">Espace candidat non configuré : définissez les variables LAB_PASSWORD et SANDBOX_SECRET dans Vercel, puis redéployez.</p>
      ) : (
        <form action={login} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />
          <label className="block">
            <span className="text-sm font-medium">Mot de passe</span>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          {erreur && <p className="text-sm text-danger">Mot de passe incorrect.</p>}
          <button className="w-full rounded-lg bg-accent text-accent-fg py-2 font-medium hover:opacity-90">Entrer</button>
        </form>
      )}
    </div>
  );
}
