import { list, put } from "@vercel/blob";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";

export interface JsonStore<T> {
  read(): Promise<T>;
  write(value: T): Promise<void>;
  update(mutator: (current: T) => T | Promise<T>): Promise<T>;
}

// ── Local filesystem (development) ───────────────────────────────────────────

const dataDir = path.join(process.cwd(), "data");
const locks = new Map<string, Promise<unknown>>();

function withLock<T>(filePath: string, task: () => Promise<T>): Promise<T> {
  const previous = locks.get(filePath) ?? Promise.resolve();
  const next = previous.then(task, task);
  locks.set(filePath, next.catch(() => undefined));
  return next;
}

async function atomicWrite(filePath: string, contents: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  const tmp = `${filePath}.${randomBytes(6).toString("hex")}.tmp`;
  await writeFile(tmp, contents, "utf8");
  await rename(tmp, filePath);
}

function createFsStore<T>(fileName: string, fallback: T): JsonStore<T> {
  const filePath = path.join(dataDir, fileName);

  async function readRaw(): Promise<T> {
    try {
      const raw = await readFile(filePath, "utf8");
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  async function writeRaw(value: T): Promise<void> {
    await atomicWrite(filePath, JSON.stringify(value, null, 2));
  }

  return {
    read: () => withLock(filePath, readRaw),
    write: (value) => withLock(filePath, () => writeRaw(value)),
    update: (mutator) =>
      withLock(filePath, async () => {
        const current = await readRaw();
        const next = await mutator(current);
        await writeRaw(next);
        return next;
      }),
  };
}

// ── Vercel Blob (production) ─────────────────────────────────────────────────

function createBlobStore<T>(fileName: string, fallback: T): JsonStore<T> {
  const blobKey = `data/${fileName}`;

  async function readRaw(): Promise<T> {
    try {
      const { blobs } = await list({ prefix: blobKey, limit: 1 });
      if (!blobs[0]) return fallback;
      const res = await fetch(blobs[0].url, { cache: "no-store" });
      if (!res.ok) return fallback;
      return (await res.json()) as T;
    } catch {
      return fallback;
    }
  }

  async function writeRaw(value: T): Promise<void> {
    await put(blobKey, JSON.stringify(value, null, 2), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });
  }

  return {
    read: readRaw,
    write: writeRaw,
    update: async (mutator) => {
      const current = await readRaw();
      const next = await mutator(current);
      await writeRaw(next);
      return next;
    },
  };
}

// ── Factory ──────────────────────────────────────────────────────────────────

export function createJsonStore<T>(fileName: string, fallback: T): JsonStore<T> {
  return process.env.BLOB_READ_WRITE_TOKEN
    ? createBlobStore(fileName, fallback)
    : createFsStore(fileName, fallback);
}
