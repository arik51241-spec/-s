export const runtime = "nodejs";

export function GET() {
  return Response.json({ ok: true, service: "sweet16-pixel-arena" });
}
