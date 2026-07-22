import Matter from "matter-js/build/matter.min.js";
import { getArena, getVehicle } from "./config";
import type { ArenaSnapshot, CarSnapshot, DirectionInput, GameMode, VehicleConfig } from "./types";

const { Body, Bodies, Composite, Constraint, Engine, Events, World } = Matter;
const WIDTH = 960;
const HEIGHT = 540;
const BOOST_TEXT = "лови один буст, тебе хватит, не забывай, что я у тебя один";

type VehicleBodies = {
  chassis: Matter.Body;
  wheelA: Matter.Body;
  wheelB: Matter.Body;
  head: Matter.Body;
  config: VehicleConfig;
  color: string;
  boostUntil: number;
};

type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };

export class ArenaEngine {
  readonly engine = Engine.create({ enableSleeping: false });
  private vehicles: [VehicleBodies, VehicleBodies] | null = null;
  private arenaBodies: Matter.Body[] = [];
  private hazardBodies: Matter.Body[] = [];
  private particles: Particle[] = [];
  private inputs: [DirectionInput, DirectionInput] = [{ left: false, right: false }, { left: false, right: false }];
  private score: [number, number] = [0, 0];
  private winner: number | null = null;
  private matchWinner: number | null = null;
  private countdownUntil = 0;
  private roundEndUntil = 0;
  private shake = 0;
  private boostBody: Matter.Body | null = null;
  private boostTaken = false;
  private boostMessageUntil = 0;
  private warning = "";
  private warningUntil = 0;
  private lastHazardCycle = -1;
  private floorBroken = false;
  private mapId = "flat";
  private mode: GameMode = "bot";
  private p1Model = "city";
  private p2Model = "monster";
  private p1Color = "#b9ff45";
  private p2Color = "#a875ff";
  private onEvent?: (name: string, value?: number) => void;

  constructor(onEvent?: (name: string, value?: number) => void) {
    this.onEvent = onEvent;
    this.engine.gravity.scale = .001;
    Events.on(this.engine, "collisionStart", (event) => this.handleCollisions(event));
  }

  startMatch(options: { map: string; mode: GameMode; p1Model: string; p2Model: string; p1Color: string; p2Color: string }) {
    this.mapId = options.map;
    this.mode = options.mode;
    this.p1Model = options.p1Model;
    this.p2Model = options.p2Model;
    this.p1Color = options.p1Color;
    this.p2Color = options.p2Color;
    this.score = [0, 0];
    this.matchWinner = null;
    this.boostTaken = false;
    this.startRound(performance.now());
  }

  setInput(player: 0 | 1, input: DirectionInput) { this.inputs[player] = input; }

  private createVehicle(player: 0 | 1, x: number, config: VehicleConfig, color: string): VehicleBodies {
    const group = Body.nextGroup(true);
    const options: Matter.IChamferableBodyDefinition = {
      label: `car:${player}:chassis`,
      friction: .22,
      frictionAir: .012,
      restitution: config.bounce,
      chamfer: { radius: 5 },
      collisionFilter: { group },
    };
    const chassis = Bodies.rectangle(x, 330, config.width, config.height, options);
    Body.setMass(chassis, config.mass);
    const wheelY = 330 + config.height * .48;
    const wheelOffset = config.width * .31;
    const wheelOptions: Matter.IBodyDefinition = {
      label: `car:${player}:wheel`,
      friction: config.grip,
      frictionStatic: 1.2,
      restitution: config.bounce,
      density: .0022,
      collisionFilter: { group },
    };
    const wheelA = Bodies.circle(x - wheelOffset, wheelY, config.wheelRadius, wheelOptions);
    const wheelB = Bodies.circle(x + wheelOffset, wheelY, config.wheelRadius, wheelOptions);
    const headX = player === 0 ? config.headX : -config.headX;
    const head = Bodies.circle(x + headX, 330 + config.headY, 11, {
      label: `car:${player}:head`, isSensor: true, frictionAir: .03, collisionFilter: { group },
    });
    const suspension = [
      Constraint.create({ bodyA: chassis, pointA: { x: -wheelOffset, y: config.height * .42 }, bodyB: wheelA, stiffness: .48, damping: .24, length: 4 }),
      Constraint.create({ bodyA: chassis, pointA: { x: wheelOffset, y: config.height * .42 }, bodyB: wheelB, stiffness: .48, damping: .24, length: 4 }),
      Constraint.create({ bodyA: chassis, pointA: { x: headX, y: config.headY }, bodyB: head, stiffness: .98, damping: .25, length: 0 }),
    ];
    World.add(this.engine.world, [chassis, wheelA, wheelB, head, ...suspension]);
    return { chassis, wheelA, wheelB, head, config, color, boostUntil: 0 };
  }

  private wall(x: number, y: number, w: number, h: number, angle = 0, label = "arena") {
    const arena = getArena(this.mapId);
    const body = Bodies.rectangle(x, y, w, h, { isStatic: true, angle, label, friction: arena.friction, restitution: .18, chamfer: { radius: 2 } });
    this.arenaBodies.push(body); World.add(this.engine.world, body); return body;
  }

  private buildArena() {
    this.arenaBodies = []; this.hazardBodies = []; this.floorBroken = false; this.lastHazardCycle = -1;
    this.wall(480, -30, 1100, 60); this.wall(-30, 270, 60, 620); this.wall(990, 270, 60, 620);
    const id = this.mapId;
    if (id === "pit" || id === "islands") {
      this.wall(170, 495, 340, 50); this.wall(790, 495, 340, 50);
      if (id === "islands") { this.wall(480, 385, 145, 18); this.wall(275, 315, 115, 16); this.wall(685, 315, 115, 16); }
    } else if (id === "ramps") {
      this.wall(480, 505, 960, 40); this.wall(335, 410, 280, 24, -.34); this.wall(625, 410, 280, 24, .34);
    } else if (id === "center") {
      this.wall(480, 500, 960, 40); this.wall(480, 365, 270, 22);
    } else if (id === "elevator") {
      this.wall(480, 500, 960, 40); const moving = this.wall(480, 360, 260, 20, 0, "hazard:elevator"); this.hazardBodies.push(moving);
    } else if (id === "spinner") {
      this.wall(480, 500, 960, 40); const spinner = this.wall(480, 365, 330, 18, 0, "hazard:spinner"); this.hazardBodies.push(spinner);
    } else if (id === "crumbly") {
      for (let x = 45; x < 960; x += 70) this.wall(x, 495, 66, 38, 0, "hazard:crumbly");
    } else {
      this.wall(480, 500, 960, 40);
    }
    if (id === "blocks" || id === "liquid" || id === "press" || id === "train" || id === "closing") {
      if (!this.arenaBodies.some((body) => body.position.y > 470)) this.wall(480, 500, 960, 40);
    }
  }

  private startRound(now: number) {
    World.clear(this.engine.world, false);
    this.engine.gravity.y = getArena(this.mapId).gravity;
    this.engine.timing.timeScale = 1;
    this.buildArena();
    this.vehicles = [
      this.createVehicle(0, 205, getVehicle(this.p1Model), this.p1Color),
      this.createVehicle(1, 755, getVehicle(this.p2Model), this.p2Color),
    ];
    this.winner = null; this.countdownUntil = now + 3000; this.roundEndUntil = 0; this.particles = []; this.shake = 0;
    if (!this.boostTaken) {
      this.boostBody = Bodies.circle(480, 295, 15, { isStatic: true, isSensor: true, label: "boost" });
      World.add(this.engine.world, this.boostBody);
    } else this.boostBody = null;
  }

  private playerFromLabel(label: string) {
    const match = /^car:(0|1):/.exec(label); return match ? Number(match[1]) as 0 | 1 : null;
  }

  private partFromLabel(label: string) { return label.split(":")[2] ?? ""; }

  private handleCollisions(event: Matter.IEventCollision<Matter.Engine>) {
    const now = performance.now();
    for (const pair of event.pairs) {
      const a = pair.bodyA, b = pair.bodyB;
      if ((a.label === "boost" || b.label === "boost") && !this.boostTaken) {
        const carBody = a.label === "boost" ? b : a;
        const player = this.playerFromLabel(carBody.label);
        if (player !== null && this.vehicles) {
          this.boostTaken = true; this.vehicles[player].boostUntil = now + 3500; this.boostMessageUntil = now + 4200;
          if (this.boostBody) World.remove(this.engine.world, this.boostBody); this.boostBody = null;
          this.spawnParticles(480, 275, "#b9ff45", 24); this.onEvent?.("boost");
        }
      }

      const checkHead = (head: Matter.Body, other: Matter.Body) => {
        if (this.partFromLabel(head.label) !== "head" || this.winner !== null || this.matchWinner !== null || now < this.countdownUntil) return;
        const victim = this.playerFromLabel(head.label); if (victim === null) return;
        const attacker = this.playerFromLabel(other.label);
        const isOpponent = attacker !== null && attacker !== victim;
        const isHazard = other.label.startsWith("hazard:");
        if (!isOpponent && !isHazard) return;
        const relative = Matter.Vector.magnitude(Matter.Vector.sub(head.velocity, other.velocity));
        if (relative < 2.7) return;
        this.finishRound(victim === 0 ? 1 : 0, head.position.x, head.position.y, relative);
      };
      checkHead(a, b); checkHead(b, a);

      if (this.playerFromLabel(a.label) !== null && this.playerFromLabel(b.label) !== null) {
        const relative = Matter.Vector.magnitude(Matter.Vector.sub(a.velocity, b.velocity));
        if (relative > 3.4) { this.shake = Math.min(8, relative); this.onEvent?.("impact", relative); }
      }
    }
  }

  private finishRound(winner: number, x: number, y: number, force: number) {
    if (this.winner !== null) return;
    this.winner = winner; this.score[winner] += 1; this.shake = 18; this.engine.timing.timeScale = .18;
    this.roundEndUntil = performance.now() + 1450; this.spawnParticles(x, y, winner === 0 ? this.p1Color : this.p2Color, 38);
    this.onEvent?.("headHit", force);
    if (this.score[winner] >= 5) { this.matchWinner = winner; this.onEvent?.("victory", winner); }
  }

  private spawnParticles(x: number, y: number, color: string, count: number) {
    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2; const speed = 2 + Math.random() * 7;
      this.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 28 + Math.random() * 24, color });
    }
  }

  private applyInput(vehicle: VehicleBodies, input: DirectionInput, now: number) {
    const direction = Number(input.right) - Number(input.left); if (!direction) return;
    const boosted = now < vehicle.boostUntil; const multiplier = boosted ? 1.65 : 1;
    const speed = vehicle.chassis.velocity.x;
    if (Math.abs(speed) < vehicle.config.maxSpeed * multiplier) {
      Body.applyForce(vehicle.chassis, vehicle.chassis.position, { x: direction * vehicle.config.power * vehicle.chassis.mass * multiplier, y: 0 });
    }
    Body.setAngularVelocity(vehicle.wheelA, vehicle.wheelA.angularVelocity + direction * .038 * multiplier);
    Body.setAngularVelocity(vehicle.wheelB, vehicle.wheelB.angularVelocity + direction * .038 * multiplier);
    Body.setAngularVelocity(vehicle.chassis, vehicle.chassis.angularVelocity + direction * vehicle.config.airTorque * 9 * multiplier);
  }

  private updateHazards(now: number) {
    const seconds = now / 1000;
    const cycle = Math.floor(seconds / 5);
    this.warning = now < this.warningUntil ? this.warning : "";
    const arena = getArena(this.mapId);
    if (cycle !== this.lastHazardCycle && arena.hazard !== "none") {
      this.lastHazardCycle = cycle; this.warning = "ВНИМАНИЕ: АРЕНА МЕНЯЕТСЯ"; this.warningUntil = now + 900; this.onEvent?.("warning");
    }
    const hazard = arena.hazard;
    if (hazard === "elevator") {
      const body = this.hazardBodies[0]; if (body) Body.setPosition(body, { x: 480, y: 360 + Math.sin(seconds * 1.4) * 105 });
    }
    if (hazard === "spinner") {
      const body = this.hazardBodies[0]; if (body) Body.setAngle(body, seconds * 1.7);
    }
    if (hazard === "blocks" && cycle !== this.lastHazardCycle - 1 && seconds % 5 > 1 && seconds % 5 < 1.05) {
      const block = Bodies.rectangle(150 + Math.random() * 660, 60, 48, 48, { label: "hazard:block", restitution: .35, density: .004 });
      this.hazardBodies.push(block); World.add(this.engine.world, block);
    }
    if (hazard === "crumbly" && !this.floorBroken && seconds % 16 > 8) {
      this.floorBroken = true;
      this.arenaBodies.filter((body) => body.label === "hazard:crumbly").forEach((body, index) => window.setTimeout(() => Body.setStatic(body, false), index * 120));
    }
    if (hazard === "press" || hazard === "closing") {
      const amount = hazard === "press" ? Math.max(0, Math.sin(seconds * .7)) * 120 : Math.min(170, (seconds % 30) * 7);
      const left = this.arenaBodies.find((body) => body.position.x < 0); const right = this.arenaBodies.find((body) => body.position.x > 960);
      if (left && right) { Body.setPosition(left, { x: -30 + amount, y: 270 }); Body.setPosition(right, { x: 990 - amount, y: 270 }); }
    }
    if (hazard === "train") {
      let train = this.hazardBodies[0];
      if (!train) { train = Bodies.rectangle(-170, 430, 250, 70, { isStatic: true, label: "hazard:train", chamfer: { radius: 4 } }); this.hazardBodies.push(train); World.add(this.engine.world, train); }
      const x = ((seconds * 155) % 1300) - 170; Body.setPosition(train, { x, y: 430 });
    }
    if (hazard === "liquid" && this.vehicles) {
      const top = 540 - Math.min(150, (seconds % 18) * 10);
      for (const [index, vehicle] of this.vehicles.entries()) {
        if (vehicle.head.position.y > top && this.winner === null) this.finishRound(index === 0 ? 1 : 0, vehicle.head.position.x, vehicle.head.position.y, 5);
      }
    }
  }

  update(delta: number, now: number) {
    if (!this.vehicles) return;
    this.updateHazards(now);
    if (this.matchWinner === null && this.winner === null && now >= this.countdownUntil) {
      this.applyInput(this.vehicles[0], this.inputs[0], now); this.applyInput(this.vehicles[1], this.inputs[1], now);
    }
    if (this.winner !== null && this.matchWinner === null && now >= this.roundEndUntil) this.startRound(now);
    Engine.update(this.engine, Math.min(32, delta));
    if (this.winner !== null) this.engine.timing.timeScale = Math.min(1, this.engine.timing.timeScale + .012);
    for (const particle of this.particles) { particle.x += particle.vx; particle.y += particle.vy; particle.vy += .2; particle.vx *= .97; particle.life -= 1; }
    this.particles = this.particles.filter((particle) => particle.life > 0);
    this.shake *= .9;
    for (const vehicle of this.vehicles) {
      if (vehicle.chassis.position.y > 650 || vehicle.chassis.position.x < -160 || vehicle.chassis.position.x > 1120) {
        const x = vehicle === this.vehicles[0] ? 205 : 755;
        Body.setPosition(vehicle.chassis, { x, y: 250 }); Body.setVelocity(vehicle.chassis, { x: 0, y: 0 }); Body.setAngle(vehicle.chassis, 0);
        Body.setPosition(vehicle.wheelA, { x: x - 20, y: 280 }); Body.setPosition(vehicle.wheelB, { x: x + 20, y: 280 }); Body.setPosition(vehicle.head, { x, y: 220 });
      }
    }
  }

  restartRound() { this.startRound(performance.now()); }

  private carSnapshot(vehicle: VehicleBodies): CarSnapshot {
    return {
      x: vehicle.chassis.position.x, y: vehicle.chassis.position.y, angle: vehicle.chassis.angle,
      wheelA: { x: vehicle.wheelA.position.x, y: vehicle.wheelA.position.y, angle: vehicle.wheelA.angle },
      wheelB: { x: vehicle.wheelB.position.x, y: vehicle.wheelB.position.y, angle: vehicle.wheelB.angle },
      head: { x: vehicle.head.position.x, y: vehicle.head.position.y }, model: vehicle.config.id, color: vehicle.color,
    };
  }

  getSnapshot(now = performance.now()): ArenaSnapshot {
    const empty = { x: 0, y: 0, angle: 0, wheelA: { x: 0, y: 0, angle: 0 }, wheelB: { x: 0, y: 0, angle: 0 }, head: { x: 0, y: 0 }, model: "city", color: "#fff" };
    const cars: [CarSnapshot, CarSnapshot] = this.vehicles ? [this.carSnapshot(this.vehicles[0]), this.carSnapshot(this.vehicles[1])] : [empty, empty];
    const hazard = getArena(this.mapId).hazard;
    const liquidTop = hazard === "liquid" ? 540 - Math.min(150, ((now / 1000) % 18) * 10) : 0;
    return {
      cars, score: [...this.score], countdown: Math.max(0, Math.ceil((this.countdownUntil - now) / 1000)), winner: this.winner,
      matchWinner: this.matchWinner, timeScale: this.engine.timing.timeScale, shake: this.shake,
      particles: this.particles.map((particle) => ({ ...particle })),
      boost: { x: this.boostBody?.position.x ?? 480, y: this.boostBody?.position.y ?? 295, visible: Boolean(this.boostBody) },
      boostMessage: now < this.boostMessageUntil ? BOOST_TEXT : "", warning: this.warning, map: this.mapId,
      hazards: [
        ...this.hazardBodies.map((body) => ({ type: body.label, x: body.position.x, y: body.position.y, w: body.bounds.max.x - body.bounds.min.x, h: body.bounds.max.y - body.bounds.min.y, angle: body.angle })),
        ...(liquidTop ? [{ type: "hazard:liquid", x: 480, y: (liquidTop + 540) / 2, w: 960, h: 540 - liquidTop, angle: 0 }] : []),
      ],
    };
  }

  destroy() { Events.off(this.engine, "collisionStart"); World.clear(this.engine.world, false); Engine.clear(this.engine); }
}
