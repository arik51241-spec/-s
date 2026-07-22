import { Pool } from "pg";

export type GameRoom = {
  code: string;
  host_signal: string;
  guest_signal: string | null;
  created_at: number;
  updated_at: number;
};

type RoomStore = Map<string, GameRoom>;
type RoomGlobals = typeof globalThis & {
  __birthdayRoomPool?: Pool;
  __birthdayMemoryRooms?: RoomStore;
};

const globals = globalThis as RoomGlobals;
const databaseUrl = process.env.DATABASE_URL;
const pool = databaseUrl
  ? (globals.__birthdayRoomPool ??= new Pool({
      connectionString: databaseUrl,
      ssl: process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : undefined,
    }))
  : null;
const memoryRooms = (globals.__birthdayMemoryRooms ??= new Map());
let tableReady: Promise<void> | null = null;

async function ensureRooms() {
  if (!pool) return;
  tableReady ??= (async () => {
    await pool.query(`CREATE TABLE IF NOT EXISTS game_rooms (
      code TEXT PRIMARY KEY,
      host_signal TEXT NOT NULL,
      guest_signal TEXT,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL
    )`);
    await pool.query("CREATE INDEX IF NOT EXISTS game_rooms_updated_idx ON game_rooms(updated_at)");
  })();
  await tableReady;
}

function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

function cleanupMemory(now: number) {
  for (const [code, room] of memoryRooms) {
    if (room.updated_at < now - 6 * 60 * 60 * 1000) memoryRooms.delete(code);
  }
}

export async function createRoom(hostSignal: string) {
  const now = Date.now();
  if (!pool) {
    cleanupMemory(now);
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = makeCode();
      if (memoryRooms.has(code)) continue;
      memoryRooms.set(code, { code, host_signal: hostSignal, guest_signal: null, created_at: now, updated_at: now });
      return code;
    }
    throw new Error("Не удалось создать уникальную комнату");
  }

  await ensureRooms();
  await pool.query("DELETE FROM game_rooms WHERE updated_at < $1", [now - 6 * 60 * 60 * 1000]);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = makeCode();
    const result = await pool.query(
      `INSERT INTO game_rooms (code, host_signal, guest_signal, created_at, updated_at)
       VALUES ($1, $2, NULL, $3, $4) ON CONFLICT DO NOTHING RETURNING code`,
      [code, hostSignal, now, now],
    );
    if (result.rowCount) return code;
  }
  throw new Error("Не удалось создать уникальную комнату");
}

export async function joinRoom(code: string, guestSignal: string) {
  const now = Date.now();
  if (!pool) {
    cleanupMemory(now);
    const room = memoryRooms.get(code);
    if (!room) return false;
    memoryRooms.set(code, { ...room, guest_signal: guestSignal, updated_at: now });
    return true;
  }

  await ensureRooms();
  const result = await pool.query(
    "UPDATE game_rooms SET guest_signal = $1, updated_at = $2 WHERE code = $3 AND updated_at > $4",
    [guestSignal, now, code, now - 6 * 60 * 60 * 1000],
  );
  return Boolean(result.rowCount);
}

export async function getRoom(code: string) {
  const cutoff = Date.now() - 6 * 60 * 60 * 1000;
  if (!pool) {
    const room = memoryRooms.get(code);
    return room && room.updated_at > cutoff ? room : null;
  }

  await ensureRooms();
  const result = await pool.query<GameRoom>(
    `SELECT code, host_signal, guest_signal, created_at, updated_at
     FROM game_rooms WHERE code = $1 AND updated_at > $2`,
    [code, cutoff],
  );
  return result.rows[0] ?? null;
}
