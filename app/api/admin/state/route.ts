import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getSiteState, updateSiteState } from "@/lib/site-state";

export const dynamic = "force-dynamic";

function forbidden() {
  return NextResponse.json({ error: "Доступ разрешён только владельцу." }, { status: 403 });
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request.headers)) return forbidden();
  return NextResponse.json(await getSiteState(), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request.headers)) return forbidden();

  const body = (await request.json().catch(() => ({}))) as { action?: string };
  const current = await getSiteState();

  if (body.action === "toggle-countdown") {
    return NextResponse.json(await updateSiteState({ countdownOnly: !current.countdownOnly }));
  }

  if (body.action === "reset-boost") {
    return NextResponse.json(await updateSiteState({ boostVersion: current.boostVersion + 1 }));
  }

  return NextResponse.json({ error: "Неизвестное действие." }, { status: 400 });
}
