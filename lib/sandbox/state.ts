import crypto from "node:crypto";
import { getStore, type Store } from "@/lib/store";
import { datasetFor, type Row } from "@/lib/data/generator";
import type { CasePack, Ressource } from "@/lib/schema/case-pack";

export const SEED_TIMESTAMP = "2026-09-01T06:00:00.000Z";

export const k = (caseId: string, ...parts: string[]) => `lab:${caseId}:${parts.join(":")}`;

export type InboxMessage = {
  id: string;
  message_id: string;
  run_id: string | null;
  scenario_id: string | null;
  canal: "email" | "formulaire";
  de: string;
  nom?: string;
  objet: string;
  corps: string;
  pieces_jointes?: string[];
  recu_le: string;
  statut: "nouveau" | "traite";
  traite_le?: string;
  resultat?: unknown;
};

export type OutboxMessage = {
  id: string;
  to: string;
  subject: string;
  body: string;
  statut: "brouillon" | "a_valider" | "envoye";
  source_message_id?: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
};

export type LogEntry = {
  ts: string;
  method: string;
  path: string;
  status: number;
  ms: number;
  apercu?: string;
  erreur?: string;
};

export type ChaosSettings = {
  actif: boolean;
  limite_par_minute: number;
  taux_erreur_503: number;
  latence_ms: number;
};

export type CaseSettings = {
  chaos: ChaosSettings;
  webhook_url?: string;
};

export const DEFAULT_SETTINGS: CaseSettings = {
  chaos: { actif: false, limite_par_minute: 30, taux_erreur_503: 0.1, latence_ms: 800 },
};

export const newId = (prefix: string) => `${prefix}${crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;

function idPrefix(pack: CasePack, ressource: Ressource) {
  const table = pack.donnees.tables.find((t) => t.nom === ressource.table);
  const idField = table?.champs.find((c) => c.type === "id");
  return idField?.options?.prefixe ?? `${ressource.nom.slice(0, 3).toUpperCase()}-`;
}

export class Sandbox {
  constructor(
    readonly pack: CasePack,
    readonly store: Store = getStore(),
  ) {}

  get caseId() {
    return this.pack.meta.id;
  }

  ressource(nom: string) {
    return this.pack.api.ressources.find((r) => r.nom === nom);
  }

  // ─── Ressources ────────────────────────────────────────────────────────────
  private async ensureSeeded(r: Ressource) {
    const flag = k(this.caseId, "seeded", r.nom);
    if (await this.store.get(flag)) return;
    if (r.table) {
      const rows = datasetFor(this.pack)[r.table] ?? [];
      const values: Record<string, unknown> = {};
      for (const row of rows) {
        const id = String(row.id ?? newId(idPrefix(this.pack, r)));
        values[id] = { ...row, id, created_at: row.created_at ?? SEED_TIMESTAMP, updated_at: row.updated_at ?? SEED_TIMESTAMP };
      }
      if (Object.keys(values).length) await this.store.hset(k(this.caseId, "r", r.nom), values);
    }
    await this.store.set(flag, 1);
  }

  async records(nom: string): Promise<Row[]> {
    const r = this.ressource(nom);
    if (!r) return [];
    await this.ensureSeeded(r);
    const all = await this.store.hgetall<Row>(k(this.caseId, "r", nom));
    return Object.values(all).sort((a, b) => String(a.id).localeCompare(String(b.id), "fr", { numeric: true }));
  }

  async record(nom: string, id: string) {
    const r = this.ressource(nom);
    if (!r) return null;
    await this.ensureSeeded(r);
    return this.store.hget<Row>(k(this.caseId, "r", nom), id);
  }

  validate(r: Ressource, data: Row, partial: boolean) {
    const erreurs: string[] = [];
    if (!partial)
      for (const champ of r.champs_requis ?? [])
        if (data[champ] === undefined || data[champ] === null || data[champ] === "") erreurs.push(`Champ requis manquant : ${champ}`);
    for (const [champ, valeurs] of Object.entries(r.enums ?? {})) {
      const v = data[champ];
      if (v !== undefined && v !== null && !valeurs.includes(String(v)))
        erreurs.push(`Valeur invalide pour ${champ} : « ${String(v)} » (attendu : ${valeurs.join(", ")})`);
    }
    return erreurs;
  }

  async create(nom: string, data: Row) {
    const r = this.ressource(nom)!;
    await this.ensureSeeded(r);
    const now = new Date().toISOString();
    const id = typeof data.id === "string" && data.id ? data.id : newId(idPrefix(this.pack, r));
    const exists = await this.store.hget(k(this.caseId, "r", nom), id);
    if (exists) return { conflit: true as const, id };
    const rec: Row = { ...data, id, created_at: now, updated_at: now };
    await this.store.hset(k(this.caseId, "r", nom), { [id]: rec });
    return { conflit: false as const, rec };
  }

  async update(nom: string, id: string, patch: Row) {
    const current = await this.record(nom, id);
    if (!current) return null;
    const rec: Row = { ...current, ...patch, id, created_at: current.created_at, updated_at: new Date().toISOString() };
    await this.store.hset(k(this.caseId, "r", nom), { [id]: rec });
    return rec;
  }

  async remove(nom: string, id: string) {
    const current = await this.record(nom, id);
    if (!current) return false;
    await this.store.hdel(k(this.caseId, "r", nom), id);
    return true;
  }

  // ─── Inbox / outbox ────────────────────────────────────────────────────────
  async inbox(): Promise<InboxMessage[]> {
    const all = await this.store.hgetall<InboxMessage>(k(this.caseId, "inbox"));
    return Object.values(all).sort((a, b) => a.recu_le.localeCompare(b.recu_le));
  }

  async inboxMessage(id: string) {
    return this.store.hget<InboxMessage>(k(this.caseId, "inbox"), id);
  }

  async pushInbox(messages: InboxMessage[]) {
    await this.store.hset(k(this.caseId, "inbox"), Object.fromEntries(messages.map((m) => [m.id, m])));
  }

  async ackInbox(id: string, resultat?: unknown) {
    const m = await this.inboxMessage(id);
    if (!m) return null;
    const updated: InboxMessage = { ...m, statut: "traite", traite_le: new Date().toISOString(), resultat: resultat ?? m.resultat };
    await this.store.hset(k(this.caseId, "inbox"), { [id]: updated });
    return updated;
  }

  async outbox(): Promise<OutboxMessage[]> {
    const all = await this.store.hgetall<OutboxMessage>(k(this.caseId, "outbox"));
    return Object.values(all).sort((a, b) => a.created_at.localeCompare(b.created_at));
  }

  async createOutbox(data: Row) {
    const now = new Date().toISOString();
    const statut = (data.statut as OutboxMessage["statut"]) ?? "brouillon";
    const msg: OutboxMessage = {
      ...data,
      id: newId("OUT-"),
      to: String(data.to ?? ""),
      subject: String(data.subject ?? ""),
      body: String(data.body ?? ""),
      statut,
      source_message_id: (data.source_message_id as string | undefined) ?? null,
      created_at: now,
      updated_at: now,
    };
    await this.store.hset(k(this.caseId, "outbox"), { [msg.id]: msg });
    return msg;
  }

  async updateOutbox(id: string, patch: Row) {
    const current = await this.store.hget<OutboxMessage>(k(this.caseId, "outbox"), id);
    if (!current) return null;
    const msg = { ...current, ...patch, id, updated_at: new Date().toISOString() } as OutboxMessage;
    await this.store.hset(k(this.caseId, "outbox"), { [id]: msg });
    return msg;
  }

  // ─── Webhooks capturés ─────────────────────────────────────────────────────
  async pushHook(name: string, entry: unknown) {
    await this.store.lpush(k(this.caseId, "hooks", name), entry);
    await this.store.ltrim(k(this.caseId, "hooks", name), 0, 199);
  }

  async hooks(name: string) {
    return this.store.lrange<Row>(k(this.caseId, "hooks", name), 0, 199);
  }

  async hookNames() {
    const keys = await this.store.keys(k(this.caseId, "hooks", "*"));
    return keys.map((key) => key.split(":").pop()!).sort();
  }

  // ─── Journal ───────────────────────────────────────────────────────────────
  async log(entry: LogEntry) {
    await this.store.lpush(k(this.caseId, "logs"), entry);
    await this.store.ltrim(k(this.caseId, "logs"), 0, 499);
  }

  async logs(limit = 200) {
    return this.store.lrange<LogEntry>(k(this.caseId, "logs"), 0, limit - 1);
  }

  // ─── Réglages ──────────────────────────────────────────────────────────────
  async settings(): Promise<CaseSettings> {
    const s = await this.store.get<CaseSettings>(k(this.caseId, "settings"));
    return { ...DEFAULT_SETTINGS, ...s, chaos: { ...DEFAULT_SETTINGS.chaos, ...s?.chaos } };
  }

  async saveSettings(s: CaseSettings) {
    await this.store.set(k(this.caseId, "settings"), s);
  }

  async rateLimitHit() {
    const minute = Math.floor(Date.now() / 60000);
    const n = await this.store.incr(k(this.caseId, "rl", String(minute)), 120);
    return { n, retryAfter: 60 - Math.floor((Date.now() / 1000) % 60) };
  }

  // ─── Réinitialisation ──────────────────────────────────────────────────────
  async reset(scope: "tout" | "donnees" = "tout") {
    const keys = await this.store.keys(k(this.caseId, "*"));
    const keep = scope === "donnees" ? (key: string) => /:(runs|settings|rag)(:|$)/.test(key) : () => false;
    await this.store.del(...keys.filter((key) => !keep(key)));
  }
}
