import { getVehicle } from "./config";
import type { ArenaSnapshot, CarSnapshot } from "./types";

function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawPlatform(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, angle = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
  rect(ctx, -w / 2, -h / 2, w, h, "#24172f"); rect(ctx, -w / 2, -h / 2, w, 6, "#a875ff");
  for (let px = -w / 2 + 14; px < w / 2; px += 30) rect(ctx, px, 4, 13, 5, "#49305c");
  ctx.restore();
}

function drawArena(ctx: CanvasRenderingContext2D, snapshot: ArenaSnapshot, time: number) {
  const map = snapshot.map;
  if (map === "pit" || map === "islands") {
    drawPlatform(ctx, 170, 495, 340, 50); drawPlatform(ctx, 790, 495, 340, 50);
    if (map === "islands") { drawPlatform(ctx, 480, 385, 145, 18); drawPlatform(ctx, 275, 315, 115, 16); drawPlatform(ctx, 685, 315, 115, 16); }
  } else if (map === "ramps") {
    drawPlatform(ctx, 480, 505, 960, 40); drawPlatform(ctx, 335, 410, 280, 24, -.34); drawPlatform(ctx, 625, 410, 280, 24, .34);
  } else if (map === "center") {
    drawPlatform(ctx, 480, 500, 960, 40); drawPlatform(ctx, 480, 365, 270, 22);
  } else if (map === "crumbly") {
    for (let x = 45; x < 960; x += 70) drawPlatform(ctx, x, 495, 66, 38, Math.sin(time + x) * .02);
  } else {
    drawPlatform(ctx, 480, 500, 960, 40);
  }
  if (map === "ice") { rect(ctx, 0, 476, 960, 8, "#93eaff"); rect(ctx, 50, 462, 160, 3, "rgba(255,255,255,.55)"); }
  if (map === "moon") {
    ctx.fillStyle = "#dce1ff"; ctx.beginPath(); ctx.arc(818, 108, 62, 0, Math.PI * 2); ctx.fill();
    rect(ctx, 792, 78, 16, 10, "#b0b9df"); rect(ctx, 837, 125, 18, 8, "#b0b9df");
  }
}

function drawVehicle(ctx: CanvasRenderingContext2D, car: CarSnapshot, player: number) {
  const config = getVehicle(car.model);
  const drawWheel = (wheel: CarSnapshot["wheelA"]) => {
    ctx.save(); ctx.translate(wheel.x, wheel.y); ctx.rotate(wheel.angle);
    ctx.fillStyle = "#08070a"; ctx.beginPath(); ctx.arc(0, 0, config.wheelRadius, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#665971"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-config.wheelRadius + 3, 0); ctx.lineTo(config.wheelRadius - 3, 0); ctx.moveTo(0, -config.wheelRadius + 3); ctx.lineTo(0, config.wheelRadius - 3); ctx.stroke(); ctx.restore();
  };
  drawWheel(car.wheelA); drawWheel(car.wheelB);

  ctx.save(); ctx.translate(car.x, car.y); ctx.rotate(car.angle); ctx.scale(player === 1 ? -1 : 1, 1);
  const w = config.width, h = config.height;
  ctx.fillStyle = "rgba(0,0,0,.38)"; ctx.fillRect(-w / 2 - 3, h / 2 + 2, w + 6, 6);
  ctx.fillStyle = car.color;
  switch (config.kind) {
    case "sport": ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillRect(-8, -h / 2 - 10, 30, 11); ctx.fillRect(-w / 2 - 8, 1, 12, 5); break;
    case "pickup": ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillRect(1, -h / 2 - 14, 30, 15); ctx.fillRect(-w / 2 + 4, -h / 2 + 4, 30, 3); break;
    case "suv": ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillRect(-20, -h / 2 - 15, 44, 16); break;
    case "truck": ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillRect(9, -h / 2 - 19, 34, 20); ctx.fillRect(-w / 2 - 10, 4, 16, 10); break;
    case "bus": ctx.fillRect(-w / 2, -h / 2 - 12, w, h + 12); for (let x = -w / 2 + 10; x < w / 2 - 8; x += 20) rect(ctx, x, -h / 2 - 6, 12, 11, "#17131e"); break;
    case "tractor": ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillRect(2, -h / 2 - 20, 28, 21); ctx.fillRect(-w / 2 - 14, -1, 17, 6); break;
    case "formula": ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillRect(-5, -h / 2 - 9, 22, 10); ctx.fillRect(-w / 2 - 11, -5, 14, 3); ctx.fillRect(w / 2 - 3, -15, 5, 15); break;
    case "police": ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillRect(-16, -h / 2 - 12, 34, 13); rect(ctx, -5, -h / 2 - 17, 10, 5, timeColor(player)); break;
    case "loader": ctx.fillRect(-w / 2, -h / 2, w - 8, h); ctx.fillRect(1, -h / 2 - 17, 31, 18); ctx.fillRect(-w / 2 - 18, -5, 22, 18); break;
    case "monster": ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillRect(-12, -h / 2 - 13, 30, 14); ctx.fillRect(-w / 2 - 11, -h / 2 - 10, 12, 5); ctx.fillRect(w / 2 - 1, -h / 2 - 10, 12, 5); break;
    case "limo": ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillRect(2, -h / 2 - 11, 40, 12); break;
    default: ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillRect(-10, -h / 2 - 13, 31, 14);
  }
  rect(ctx, w / 2 - 8, -4, 7, 6, "#f8ffd9"); rect(ctx, -w / 2 + 2, -3, 5, 7, "#ff4f8b");
  ctx.fillStyle = "#0a080d"; ctx.font = "bold 11px monospace"; ctx.textAlign = "center"; ctx.fillText(String(player + 1), 0, 5);
  ctx.restore();

  ctx.fillStyle = player === 0 ? "#ffd7bd" : "#f2c6ff"; ctx.beginPath(); ctx.arc(car.head.x, car.head.y, 11, 0, Math.PI * 2); ctx.fill();
  rect(ctx, car.head.x - 7, car.head.y - 10, 14, 5, player === 0 ? "#211728" : "#101014");
  rect(ctx, car.head.x + (player === 0 ? 3 : -5), car.head.y - 1, 3, 3, "#17131e");
}

function timeColor(player: number) { return player ? "#a875ff" : "#52d9ff"; }

function drawHazards(ctx: CanvasRenderingContext2D, snapshot: ArenaSnapshot) {
  for (const hazard of snapshot.hazards) {
    if (hazard.type === "hazard:liquid") {
      ctx.fillStyle = "rgba(185,255,69,.72)"; ctx.fillRect(hazard.x - hazard.w / 2, hazard.y - hazard.h / 2, hazard.w, hazard.h);
      ctx.fillStyle = "#e5ff86"; for (let x = 0; x < 960; x += 30) ctx.fillRect(x, hazard.y - hazard.h / 2 + (x % 60 ? 4 : 0), 22, 5);
      continue;
    }
    ctx.save(); ctx.translate(hazard.x, hazard.y); ctx.rotate(hazard.angle);
    ctx.fillStyle = hazard.type.includes("train") ? "#ff4f8b" : "#61377e"; ctx.fillRect(-hazard.w / 2, -hazard.h / 2, hazard.w, hazard.h);
    ctx.fillStyle = "#b9ff45"; ctx.fillRect(-hazard.w / 2, -hazard.h / 2, hazard.w, 5); ctx.restore();
  }
}

export function renderGame(canvas: HTMLCanvasElement, snapshot: ArenaSnapshot, time: number) {
  const ctx = canvas.getContext("2d"); if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  const gradient = ctx.createLinearGradient(0, 0, 0, 270); gradient.addColorStop(0, "#170c27"); gradient.addColorStop(1, "#050507");
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = gradient; ctx.fillRect(0, 0, 480, 270);
  ctx.globalAlpha = .18; ctx.strokeStyle = snapshot.map === "ice" ? "#52d9ff" : "#a875ff";
  for (let x = 0; x < 480; x += 16) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 270); ctx.stroke(); }
  for (let y = 0; y < 270; y += 16) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(480, y); ctx.stroke(); }
  ctx.globalAlpha = 1;
  const distance = Math.abs(snapshot.cars[0].x - snapshot.cars[1].x); const zoom = 1 + Math.max(0, 260 - distance) / 3000;
  const shakeX = (Math.random() - .5) * snapshot.shake; const shakeY = (Math.random() - .5) * snapshot.shake;
  ctx.save(); ctx.translate(240 + shakeX, 135 + shakeY); ctx.scale(.5 * zoom, .5 * zoom); ctx.translate(-480, -270);
  drawArena(ctx, snapshot, time); drawHazards(ctx, snapshot);
  if (snapshot.boost.visible) {
    ctx.save(); ctx.translate(snapshot.boost.x, snapshot.boost.y); ctx.rotate(time * 2);
    ctx.shadowBlur = 20; ctx.shadowColor = "#b9ff45"; ctx.fillStyle = "#b9ff45";
    ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(15, 0); ctx.lineTo(0, 20); ctx.lineTo(-15, 0); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0; ctx.restore();
  }
  snapshot.cars.forEach((car, index) => drawVehicle(ctx, car, index));
  for (const particle of snapshot.particles) rect(ctx, particle.x, particle.y, 5, 5, particle.color);
  ctx.restore();

  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.textAlign = "center"; ctx.font = "bold 12px monospace"; ctx.fillStyle = "#f5efff";
  ctx.fillText(`P1  ${snapshot.score[0]}       ДО 5       ${snapshot.score[1]}  P2`, 240, 18);
  if (snapshot.warning) { rect(ctx, 115, 28, 250, 22, "#ff4f8b"); ctx.fillStyle = "#09060c"; ctx.font = "bold 9px monospace"; ctx.fillText(snapshot.warning, 240, 43); }
  if (snapshot.countdown > 0) { ctx.fillStyle = "rgba(5,5,7,.7)"; ctx.fillRect(0, 90, 480, 90); ctx.fillStyle = "#b9ff45"; ctx.font = "bold 54px monospace"; ctx.fillText(String(snapshot.countdown), 240, 152); }
  if (snapshot.winner !== null) { ctx.fillStyle = "rgba(5,5,7,.78)"; ctx.fillRect(0, 92, 480, 86); ctx.fillStyle = snapshot.winner === 0 ? "#b9ff45" : "#a875ff"; ctx.font = "bold 22px monospace"; ctx.fillText(`ПОБЕДА ИГРОКА ${snapshot.winner + 1}`, 240, 133); ctx.fillStyle = "#f5efff"; ctx.font = "10px monospace"; ctx.fillText("ТОЧНО В ГОЛОВУ!", 240, 153); }
  if (snapshot.matchWinner !== null) { ctx.fillStyle = "rgba(5,5,7,.92)"; ctx.fillRect(0, 65, 480, 145); ctx.fillStyle = "#b9ff45"; ctx.font = "bold 25px monospace"; ctx.fillText(`ИГРОК ${snapshot.matchWinner + 1} ВЫИГРАЛ МАТЧ`, 240, 125); ctx.fillStyle = "#f5efff"; ctx.font = "11px monospace"; ctx.fillText("ПЯТЬ ПОБЕД. ЛЕГЕНДА АРЕНЫ.", 240, 151); }
  if (snapshot.boostMessage) { rect(ctx, 34, 210, 412, 38, "#b9ff45"); ctx.fillStyle = "#09060c"; ctx.font = "bold 9px monospace"; ctx.fillText(snapshot.boostMessage, 240, 233); }
}
