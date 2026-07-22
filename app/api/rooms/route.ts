import { createRoom, getRoom, joinRoom } from "../../../db/rooms";

export const runtime = "nodejs";

const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(request: Request) {
  try {
    const code = new URL(request.url).searchParams.get("code")?.trim().toUpperCase();
    if (!code || !/^[A-Z2-9]{6}$/.test(code)) return json({ error: "Неверный код комнаты" }, 400);
    const room = await getRoom(code);
    if (!room) return json({ error: "Комната не найдена" }, 404);
    return json({ code: room.code, offer: JSON.parse(room.host_signal), answer: room.guest_signal ? JSON.parse(room.guest_signal) : null });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Ошибка комнаты" }, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { action?: string; code?: string; signal?: unknown };
    const signal = JSON.stringify(body.signal ?? null);
    if (signal.length > 24_000) return json({ error: "Слишком большой сигнал" }, 413);
    if (body.action === "create") return json({ code: await createRoom(signal) }, 201);
    if (body.action === "join") {
      const code = body.code?.trim().toUpperCase();
      if (!code || !/^[A-Z2-9]{6}$/.test(code)) return json({ error: "Неверный код комнаты" }, 400);
      return (await joinRoom(code, signal)) ? json({ ok: true }) : json({ error: "Комната не найдена" }, 404);
    }
    return json({ error: "Неизвестное действие" }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Ошибка комнаты" }, 500);
  }
}
