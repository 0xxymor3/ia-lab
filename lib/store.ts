import { Redis } from "@upstash/redis";

// Stockage clé-valeur minimal utilisé par le sandbox et le testeur.
// Upstash Redis en production ; repli en mémoire (non persistant) sinon.
export interface Store {
  readonly persistent: boolean;
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, opts?: { ex?: number }): Promise<void>;
  del(...keys: string[]): Promise<void>;
  hget<T>(key: string, field: string): Promise<T | null>;
  hset(key: string, values: Record<string, unknown>): Promise<void>;
  hgetall<T>(key: string): Promise<Record<string, T>>;
  hdel(key: string, ...fields: string[]): Promise<void>;
  lpush(key: string, ...values: unknown[]): Promise<void>;
  lrange<T>(key: string, start: number, stop: number): Promise<T[]>;
  ltrim(key: string, start: number, stop: number): Promise<void>;
  incr(key: string, ttlSeconds?: number): Promise<number>;
  keys(pattern: string): Promise<string[]>;
}

class UpstashStore implements Store {
  readonly persistent = true;
  constructor(private redis: Redis) {}
  async get<T>(key: string) {
    return (await this.redis.get<T>(key)) ?? null;
  }
  async set(key: string, value: unknown, opts?: { ex?: number }) {
    if (opts?.ex) await this.redis.set(key, value, { ex: opts.ex });
    else await this.redis.set(key, value);
  }
  async del(...keys: string[]) {
    if (keys.length) await this.redis.del(...keys);
  }
  async hget<T>(key: string, field: string) {
    return (await this.redis.hget<T>(key, field)) ?? null;
  }
  async hset(key: string, values: Record<string, unknown>) {
    const entries = Object.entries(values);
    for (let i = 0; i < entries.length; i += 200) {
      await this.redis.hset(key, Object.fromEntries(entries.slice(i, i + 200)));
    }
  }
  async hgetall<T>(key: string) {
    return ((await this.redis.hgetall<Record<string, T>>(key)) ?? {}) as Record<string, T>;
  }
  async hdel(key: string, ...fields: string[]) {
    if (fields.length) await this.redis.hdel(key, ...fields);
  }
  async lpush(key: string, ...values: unknown[]) {
    if (values.length) await this.redis.lpush(key, ...values);
  }
  async lrange<T>(key: string, start: number, stop: number) {
    return (await this.redis.lrange<T>(key, start, stop)) ?? [];
  }
  async ltrim(key: string, start: number, stop: number) {
    await this.redis.ltrim(key, start, stop);
  }
  async incr(key: string, ttlSeconds?: number) {
    const n = await this.redis.incr(key);
    if (ttlSeconds && n === 1) await this.redis.expire(key, ttlSeconds);
    return n;
  }
  async keys(pattern: string) {
    const out: string[] = [];
    let cursor: string | number = 0;
    do {
      const [next, batch]: [string | number, string[]] = await this.redis.scan(cursor, { match: pattern, count: 500 });
      out.push(...batch);
      cursor = next;
    } while (String(cursor) !== "0");
    return out;
  }
}

type Entry = { value: unknown; expires?: number };

class MemoryStore implements Store {
  readonly persistent = false;
  private data = new Map<string, Entry>();
  private clone<T>(v: T): T {
    return v === undefined ? v : (JSON.parse(JSON.stringify(v)) as T);
  }
  private read(key: string) {
    const e = this.data.get(key);
    if (!e) return undefined;
    if (e.expires && e.expires < Date.now()) {
      this.data.delete(key);
      return undefined;
    }
    return e.value;
  }
  async get<T>(key: string) {
    const v = this.read(key);
    return v === undefined ? null : this.clone(v as T);
  }
  async set(key: string, value: unknown, opts?: { ex?: number }) {
    this.data.set(key, { value: this.clone(value), expires: opts?.ex ? Date.now() + opts.ex * 1000 : undefined });
  }
  async del(...keys: string[]) {
    for (const k of keys) this.data.delete(k);
  }
  private hash(key: string, create = false) {
    let h = this.read(key) as Record<string, unknown> | undefined;
    if (!h && create) {
      h = {};
      this.data.set(key, { value: h });
    }
    return h;
  }
  async hget<T>(key: string, field: string) {
    const v = this.hash(key)?.[field];
    return v === undefined ? null : this.clone(v as T);
  }
  async hset(key: string, values: Record<string, unknown>) {
    const h = this.hash(key, true)!;
    for (const [f, v] of Object.entries(values)) h[f] = this.clone(v);
  }
  async hgetall<T>(key: string) {
    return this.clone((this.hash(key) ?? {}) as Record<string, T>);
  }
  async hdel(key: string, ...fields: string[]) {
    const h = this.hash(key);
    if (h) for (const f of fields) delete h[f];
  }
  private list(key: string, create = false) {
    let l = this.read(key) as unknown[] | undefined;
    if (!l && create) {
      l = [];
      this.data.set(key, { value: l });
    }
    return l;
  }
  async lpush(key: string, ...values: unknown[]) {
    const l = this.list(key, true)!;
    for (const v of values) l.unshift(this.clone(v));
  }
  async lrange<T>(key: string, start: number, stop: number) {
    const l = this.list(key) ?? [];
    return this.clone(l.slice(start, stop === -1 ? undefined : stop + 1) as T[]);
  }
  async ltrim(key: string, start: number, stop: number) {
    const l = this.list(key);
    if (l) this.data.set(key, { value: l.slice(start, stop === -1 ? undefined : stop + 1) });
  }
  async incr(key: string, ttlSeconds?: number) {
    const n = Number(this.read(key) ?? 0) + 1;
    const existing = this.data.get(key);
    this.data.set(key, { value: n, expires: existing?.expires ?? (ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined) });
    return n;
  }
  async keys(pattern: string) {
    const re = new RegExp(`^${pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`);
    return [...this.data.keys()].filter((k) => re.test(k) && this.read(k) !== undefined);
  }
}

const globalStore = globalThis as unknown as { __labStore?: Store };

export function getStore(): Store {
  if (globalStore.__labStore) return globalStore.__labStore;
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  globalStore.__labStore = url && token ? new UpstashStore(new Redis({ url, token })) : new MemoryStore();
  return globalStore.__labStore;
}

// Réservé aux tests.
export function createMemoryStore(): Store {
  return new MemoryStore();
}
