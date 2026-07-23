import { NextResponse } from "next/server";
import { getSiteState } from "@/lib/site-state";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await getSiteState();
  return NextResponse.json(state, { headers: { "Cache-Control": "no-store" } });
}
