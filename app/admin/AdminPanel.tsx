"use client";

import { useState } from "react";
import type { SiteState } from "@/lib/site-state";

export default function AdminPanel({ initialState }: { initialState: SiteState }) {
  const [state, setState] = useState(initialState);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const run = async (action: "toggle-countdown" | "reset-boost") => {
    setBusy(true);
    setNotice("");
    const response = await fetch("/api/admin/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const result = await response.json();
    setBusy(false);

    if (!response.ok) {
      setNotice(result.error || "Не получилось выполнить действие.");
      return;
    }

    setState(result);
    setNotice(action === "reset-boost" ? "Буст снова доступен всем посетителям." : result.countdownOnly ? "Включён режим таймера." : "Полный сайт снова открыт.");
  };

  return (
    <main className="adminPage">
      <section className="adminPanel">
        <p className="eyebrow">PRIVATE CONTROL ROOM • LVL 16</p>
        <h1>Управление сайтом</h1>
        <div className={`adminStatus ${state.countdownOnly ? "timer" : "open"}`}><i /><span>Сейчас посетители видят</span><strong>{state.countdownOnly ? "Только таймер" : "Полный сайт"}</strong></div>
        <div className="adminActions">
          <button disabled={busy} onClick={() => run("toggle-countdown")}><span>01</span><strong>{state.countdownOnly ? "Открыть полный сайт" : "Включить только таймер"}</strong><small>Переключение увидят все посетители максимум через несколько секунд.</small></button>
          <button disabled={busy} onClick={() => run("reset-boost")}><span>02</span><strong>Перезапустить буст для всех</strong><small>Даже те, кто уже нажимал, смогут получить эффект ещё один раз.</small></button>
        </div>
        {notice && <p className="adminNotice">{notice}</p>}
        <a href="/">Открыть сайт ↗</a>
      </section>
    </main>
  );
}
