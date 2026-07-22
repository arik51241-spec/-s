"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArenaEngine } from "./game/ArenaEngine";
import { AudioManager } from "./game/AudioManager";
import { BotController } from "./game/BotController";
import { ARENAS, PALETTE, VEHICLES } from "./game/config";
import { renderGame } from "./game/GameRenderer";
import { loadSettings, saveResult, saveSettings } from "./game/SaveManager";
import type { ArenaSnapshot, DirectionInput, GameMode, GameSettings } from "./game/types";

type PeerRole = "host" | "guest" | null;
type Panel = "main" | "cars" | "maps" | "settings";
const EMPTY: DirectionInput = { left: false, right: false };

function waitForIce(peer: RTCPeerConnection) {
  if (peer.iceGatheringState === "complete") return Promise.resolve();
  return new Promise<void>((resolve) => {
    let finished = false;
    const done = () => { if (finished) return; finished = true; peer.removeEventListener("icegatheringstatechange", check); resolve(); };
    const check = () => { if (peer.iceGatheringState === "complete") done(); };
    peer.addEventListener("icegatheringstatechange", check); window.setTimeout(done, 6000);
  });
}

export function PixelArena() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef(new AudioManager());
  const botRef = useRef(new BotController());
  const engineRef = useRef<ArenaEngine | null>(null);
  const snapshotRef = useRef<ArenaSnapshot | null>(null);
  const p1Input = useRef<DirectionInput>({ ...EMPTY });
  const p2Input = useRef<DirectionInput>({ ...EMPTY });
  const remoteInput = useRef<DirectionInput>({ ...EMPTY });
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RTCDataChannel | null>(null);
  const roleRef = useRef<PeerRole>(null);
  const playingRef = useRef(false);
  const pausedRef = useRef(false);
  const onlineFrame = useRef(0);
  const savedWinner = useRef<number | null>(null);
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [panel, setPanel] = useState<Panel>("main");
  const [mode, setMode] = useState<GameMode>("bot");
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [netStatus, setNetStatus] = useState("Создай комнату или введи код друга");
  const [score, setScore] = useState<[number, number]>([0, 0]);

  const patchSettings = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    setSettings((current) => { const next = { ...current, [key]: value }; saveSettings(next); return next; });
  };

  useEffect(() => { audioRef.current.setEnabled(settings.sound); }, [settings.sound]);

  const ensureEngine = useCallback(() => {
    engineRef.current ??= new ArenaEngine((event, value) => {
      if (event === "impact") audioRef.current.impact(value);
      if (event === "headHit") audioRef.current.headHit();
      if (event === "victory") audioRef.current.victory();
      if (event === "boost") audioRef.current.boost();
      if (event === "warning") audioRef.current.warning();
    });
    return engineRef.current;
  }, []);

  const send = useCallback((payload: unknown) => {
    if (channelRef.current?.readyState === "open") channelRef.current.send(JSON.stringify(payload));
  }, []);

  const startMatch = useCallback((nextMode: GameMode, overrides?: Partial<GameSettings>) => {
    const next = { ...settings, ...overrides };
    setMode(nextMode); setPanel("main"); setPlaying(true); setPaused(false); setScore([0, 0]); savedWinner.current = null;
    playingRef.current = true; pausedRef.current = false;
    ensureEngine().startMatch({ map: next.map, mode: nextMode, p1Model: next.p1Car, p2Model: next.p2Car, p1Color: next.p1Color, p2Color: next.p2Color });
    window.setTimeout(() => canvasRef.current?.focus(), 50);
  }, [ensureEngine, settings]);

  const startRandom = () => {
    const random = {
      p1Car: VEHICLES[Math.floor(Math.random() * VEHICLES.length)].id,
      p2Car: VEHICLES[Math.floor(Math.random() * VEHICLES.length)].id,
      map: ARENAS[Math.floor(Math.random() * ARENAS.length)].id,
    };
    setSettings((current) => ({ ...current, ...random })); startMatch("bot", random);
  };

  const setPausedState = useCallback((value: boolean) => {
    pausedRef.current = value; setPaused(value);
  }, []);

  const returnToMenu = useCallback(() => {
    playingRef.current = false; setPlaying(false); setPausedState(false); setPanel("main");
    peerRef.current?.close(); peerRef.current = null; channelRef.current = null; roleRef.current = null; setRoomCode("");
    p1Input.current = { ...EMPTY }; p2Input.current = { ...EMPTY }; remoteInput.current = { ...EMPTY };
  }, [setPausedState]);

  const bindChannel = useCallback((channel: RTCDataChannel, role: Exclude<PeerRole, null>) => {
    channelRef.current = channel;
    channel.onopen = () => {
      setNetStatus("Соединение готово. Битва начинается!");
      if (role === "guest") send({ type: "hello", model: settings.p2Car, color: settings.p2Color });
      else startMatch("online");
    };
    channel.onclose = () => { setNetStatus("Игрок отключился"); playingRef.current = false; setPlaying(false); };
    channel.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (role === "host") {
        if (message.type === "input") remoteInput.current = message.input;
        if (message.type === "hello") startMatch("online", { p2Car: message.model, p2Color: message.color });
        if (message.type === "pause") setPausedState(Boolean(message.value));
        if (message.type === "restart") engineRef.current?.restartRound();
      } else {
        if (message.type === "snapshot") { snapshotRef.current = message.snapshot; setScore(message.snapshot.score); setPlaying(true); playingRef.current = true; }
        if (message.type === "pause") setPausedState(Boolean(message.value));
      }
    };
  }, [send, setPausedState, settings.p2Car, settings.p2Color, startMatch]);

  const newPeer = useCallback(() => {
    peerRef.current?.close();
    const peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.cloudflare.com:3478" }] }); peerRef.current = peer;
    peer.onconnectionstatechange = () => {
      if (peer.connectionState === "failed") setNetStatus("Соединение не удалось. Создай новую комнату");
      if (peer.connectionState === "connected") setNetStatus("Игрок подключён");
    };
    return peer;
  }, []);

  async function createOnlineRoom() {
    try {
      audioRef.current.click(); setNetStatus("Создаю комнату..."); roleRef.current = "host"; setMode("online");
      const peer = newPeer(); const channel = peer.createDataChannel("sweet16-arena"); bindChannel(channel, "host");
      await peer.setLocalDescription(await peer.createOffer()); await waitForIce(peer);
      const response = await fetch("/api/rooms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", signal: peer.localDescription }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      setRoomCode(result.code); setNetStatus("Отправь этот код второму игроку");
      for (let attempt = 0; attempt < 180 && !peer.currentRemoteDescription; attempt += 1) {
        await new Promise((resolve) => window.setTimeout(resolve, 1000));
        const roomResponse = await fetch(`/api/rooms?code=${result.code}`, { cache: "no-store" }); if (!roomResponse.ok) continue;
        const room = await roomResponse.json(); if (room.answer) await peer.setRemoteDescription(room.answer);
      }
    } catch (error) { setNetStatus(error instanceof Error ? error.message : "Не удалось создать комнату"); }
  }

  async function joinOnlineRoom() {
    try {
      const code = joinCode.trim().toUpperCase(); if (code.length !== 6) throw new Error("Нужен код из 6 символов");
      audioRef.current.click(); setNetStatus("Подключаюсь..."); roleRef.current = "guest"; setMode("online");
      const roomResponse = await fetch(`/api/rooms?code=${code}`, { cache: "no-store" }); const room = await roomResponse.json(); if (!roomResponse.ok) throw new Error(room.error);
      const peer = newPeer(); peer.ondatachannel = (event) => bindChannel(event.channel, "guest");
      await peer.setRemoteDescription(room.offer); await peer.setLocalDescription(await peer.createAnswer()); await waitForIce(peer);
      const response = await fetch("/api/rooms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "join", code, signal: peer.localDescription }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      setRoomCode(code); setNetStatus("Жду хозяина комнаты...");
    } catch (error) { setNetStatus(error instanceof Error ? error.message : "Не удалось войти"); }
  }

  useEffect(() => {
    const clear = () => { p1Input.current = { ...EMPTY }; p2Input.current = { ...EMPTY }; };
    const updateKey = (event: KeyboardEvent, value: boolean) => {
      if (!playingRef.current) return;
      if (["KeyA", "KeyD", "ArrowLeft", "ArrowRight"].includes(event.code)) event.preventDefault();
      const guest = roleRef.current === "guest";
      if (event.code === "KeyA") (guest ? p2Input : p1Input).current.left = value;
      if (event.code === "KeyD") (guest ? p2Input : p1Input).current.right = value;
      if (event.code === "ArrowLeft") p2Input.current.left = value;
      if (event.code === "ArrowRight") p2Input.current.right = value;
    };
    const down = (event: KeyboardEvent) => updateKey(event, true); const up = (event: KeyboardEvent) => updateKey(event, false);
    window.addEventListener("keydown", down, { capture: true }); window.addEventListener("keyup", up, { capture: true }); window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    return () => { window.removeEventListener("keydown", down, { capture: true }); window.removeEventListener("keyup", up, { capture: true }); window.removeEventListener("blur", clear); document.removeEventListener("visibilitychange", clear); };
  }, []);

  useEffect(() => {
    let frame = 0; let previous = performance.now();
    const loop = (now: number) => {
      const delta = now - previous; previous = now;
      const guest = roleRef.current === "guest";
      if (playingRef.current && !pausedRef.current && !guest) {
        const engine = ensureEngine(); const before = engine.getSnapshot(now);
        engine.setInput(0, p1Input.current);
        if (mode === "bot") engine.setInput(1, botRef.current.update(now, before.cars[1], before.cars[0], settings.difficulty));
        else if (mode === "training") engine.setInput(1, EMPTY);
        else engine.setInput(1, mode === "online" ? remoteInput.current : p2Input.current);
        engine.update(delta, now); snapshotRef.current = engine.getSnapshot(now);
        if (snapshotRef.current.score[0] !== score[0] || snapshotRef.current.score[1] !== score[1]) setScore(snapshotRef.current.score);
        if (mode === "online" && roleRef.current === "host" && onlineFrame.current++ % 3 === 0) send({ type: "snapshot", snapshot: snapshotRef.current });
      }
      if (playingRef.current && guest && onlineFrame.current++ % 2 === 0) send({ type: "input", input: p2Input.current });
      const snapshot = snapshotRef.current;
      if (snapshot && canvasRef.current) {
        renderGame(canvasRef.current, snapshot, now / 1000);
        if (snapshot.matchWinner !== null && savedWinner.current !== snapshot.matchWinner) { savedWinner.current = snapshot.matchWinner; saveResult(snapshot.matchWinner, mode); }
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop); return () => cancelAnimationFrame(frame);
  }, [ensureEngine, mode, score, send, settings.difficulty]);

  useEffect(() => () => { peerRef.current?.close(); engineRef.current?.destroy(); }, []);

  const direction = (player: 0 | 1, key: keyof DirectionInput, value: boolean) => {
    const target = player === 0 && roleRef.current !== "guest" ? p1Input : p2Input; target.current = { ...target.current, [key]: value };
  };
  const pointer = (player: 0 | 1, key: keyof DirectionInput, value: boolean) => (event: React.PointerEvent) => {
    event.preventDefault(); if (value) event.currentTarget.setPointerCapture(event.pointerId); direction(player, key, value);
  };

  return (
    <section className="pixelArena" id="game" aria-labelledby="game-title">
      <div className="gameTitleRow"><div><p className="gameKicker">ФИЗИЧЕСКАЯ ПИКСЕЛЬНАЯ ДУЭЛЬ</p><h3 id="game-title">HEAD CRASH<br /><span>SWEET 16</span></h3></div><p>Только газ влево и вправо. Переворачивай машину в воздухе и попади корпусом или колесом точно по голове соперника.</p></div>

      <div className="arenaShell">
        {!playing ? (
          <div className="pixelMenu">
            <div className="menuNavigation">
              <button className={panel === "main" ? "active" : ""} onClick={() => setPanel("main")}>Играть</button>
              <button className={panel === "cars" ? "active" : ""} onClick={() => setPanel("cars")}>Машины <b>{VEHICLES.length}</b></button>
              <button className={panel === "maps" ? "active" : ""} onClick={() => setPanel("maps")}>Карты <b>{ARENAS.length}</b></button>
              <button className={panel === "settings" ? "active" : ""} onClick={() => setPanel("settings")}>Настройки</button>
            </div>

            {panel === "main" && <div className="modeGrid">
              <button className="modeCard primary" onClick={() => startMatch("bot")}><small>ГЛАВНЫЙ РЕЖИМ</small><strong>Против бота</strong><span>A / D • матч до 5</span></button>
              <button className="modeCard" onClick={() => startMatch("local")}><small>ОДИН ЭКРАН</small><strong>Два игрока</strong><span>A D против ← →</span></button>
              <button className="modeCard" onClick={startRandom}><small>ХАОС</small><strong>Случайный матч</strong><span>случайные машины и карта</span></button>
              <button className="modeCard" onClick={() => startMatch("training")}><small>БЕЗ СОПЕРНИКА</small><strong>Тренировка</strong><span>перевороты и физика</span></button>
              <div className="onlineCard">
                <div><small>ИГРА ЧЕРЕЗ ИНТЕРНЕТ</small><strong>Комната по коду</strong><span>для двух устройств</span></div>
                <button onClick={createOnlineRoom}>Создать</button><input value={joinCode} onChange={(event) => setJoinCode(event.target.value.toUpperCase().replace(/[^A-Z2-9]/g, "").slice(0, 6))} placeholder="КОД" aria-label="Код комнаты" /><button onClick={joinOnlineRoom}>Войти</button>
                {roomCode && <button className="roomCode" onClick={() => navigator.clipboard?.writeText(roomCode)}><small>КОПИРУЙ КОД</small><strong>{roomCode}</strong></button>}
                <p>{netStatus}</p>
              </div>
            </div>}

            {panel === "cars" && <div className="selectionPanel"><div className="selectionColumn"><h4>Игрок 1</h4><div className="vehicleGrid">{VEHICLES.map((car) => <button key={car.id} className={settings.p1Car === car.id ? "vehicleCard active" : "vehicleCard"} onClick={() => patchSettings("p1Car", car.id)}><i style={{ background: settings.p1Car === car.id ? settings.p1Color : car.color }} /><strong>{car.name}</strong><span>{car.kind}</span></button>)}</div><div className="colorPicker">{PALETTE.map((color) => <button key={color} className={settings.p1Color === color ? "active" : ""} style={{ background: color }} onClick={() => patchSettings("p1Color", color)} aria-label={`Цвет игрока 1 ${color}`} />)}</div></div><div className="selectionColumn"><h4>Игрок 2</h4><div className="vehicleGrid">{VEHICLES.map((car) => <button key={car.id} className={settings.p2Car === car.id ? "vehicleCard active" : "vehicleCard"} onClick={() => patchSettings("p2Car", car.id)}><i style={{ background: settings.p2Car === car.id ? settings.p2Color : car.color }} /><strong>{car.name}</strong><span>{car.kind}</span></button>)}</div><div className="colorPicker">{PALETTE.map((color) => <button key={color} className={settings.p2Color === color ? "active" : ""} style={{ background: color }} onClick={() => patchSettings("p2Color", color)} aria-label={`Цвет игрока 2 ${color}`} />)}</div></div></div>}

            {panel === "maps" && <div className="mapGrid">{ARENAS.map((arena, index) => <button key={arena.id} className={settings.map === arena.id ? "mapCard active" : "mapCard"} onClick={() => patchSettings("map", arena.id)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{arena.name}</strong><small>{arena.subtitle}</small></button>)}</div>}

            {panel === "settings" && <div className="settingsPanel"><label><span>Звук</span><input type="checkbox" checked={settings.sound} onChange={(event) => patchSettings("sound", event.target.checked)} /></label><label><span>Сложность бота</span><select value={settings.difficulty} onChange={(event) => patchSettings("difficulty", event.target.value as GameSettings["difficulty"])}><option value="easy">Лёгкая</option><option value="normal">Обычная</option><option value="hard">Сложная</option></select></label><div className="controlHelp"><strong>Управление</strong><p>Игрок 1: A и D. Игрок 2: стрелки влево и вправо. При русской раскладке клавиши тоже работают.</p></div></div>}
          </div>
        ) : (
          <div className="gameStage">
            <div className="matchTop"><span>P1: A / D</span><b>{score[0]} : {score[1]}</b><span>P2: ← / →</span></div>
            <canvas ref={canvasRef} width="480" height="270" tabIndex={0} aria-label="Пиксельная автомобильная арена" onContextMenu={(event) => event.preventDefault()} />
            <div className="matchActions"><button onClick={() => { const value = !pausedRef.current; setPausedState(value); if (roleRef.current) send({ type: "pause", value }); }}>{paused ? "Продолжить" : "Пауза"}</button><p>{mode === "online" ? netStatus : "Первый, кто ударит водителя по голове пять раз, побеждает"}</p><button onClick={returnToMenu}>В меню</button></div>
            <div className={mode === "local" ? "touchControls twoPlayers" : "touchControls"}>
              <div className="touchPlayer"><small>{roleRef.current === "guest" ? "ТЫ • P2" : "P1"}</small><button onPointerDown={pointer(0, "left", true)} onPointerUp={pointer(0, "left", false)} onPointerCancel={pointer(0, "left", false)}>◀</button><button onPointerDown={pointer(0, "right", true)} onPointerUp={pointer(0, "right", false)} onPointerCancel={pointer(0, "right", false)}>▶</button></div>
              {mode === "local" && <div className="touchPlayer"><small>P2</small><button onPointerDown={pointer(1, "left", true)} onPointerUp={pointer(1, "left", false)} onPointerCancel={pointer(1, "left", false)}>◀</button><button onPointerDown={pointer(1, "right", true)} onPointerUp={pointer(1, "right", false)} onPointerCancel={pointer(1, "right", false)}>▶</button></div>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
