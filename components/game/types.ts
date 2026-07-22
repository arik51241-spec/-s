export type DirectionInput = { left: boolean; right: boolean };

export type VehicleConfig = {
  id: string;
  name: string;
  kind: string;
  mass: number;
  power: number;
  maxSpeed: number;
  wheelRadius: number;
  width: number;
  height: number;
  grip: number;
  bounce: number;
  airTorque: number;
  headX: number;
  headY: number;
  color: string;
};

export type ArenaConfig = {
  id: string;
  name: string;
  subtitle: string;
  gravity: number;
  friction: number;
  hazard: string;
};

export type GameMode = "bot" | "local" | "training" | "online";
export type BotDifficulty = "easy" | "normal" | "hard";

export type CarSnapshot = {
  x: number;
  y: number;
  angle: number;
  wheelA: { x: number; y: number; angle: number };
  wheelB: { x: number; y: number; angle: number };
  head: { x: number; y: number };
  model: string;
  color: string;
};

export type ArenaSnapshot = {
  cars: [CarSnapshot, CarSnapshot];
  score: [number, number];
  countdown: number;
  winner: number | null;
  matchWinner: number | null;
  timeScale: number;
  shake: number;
  particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string }>;
  boost: { x: number; y: number; visible: boolean };
  boostMessage: string;
  warning: string;
  map: string;
  hazards: Array<{ type: string; x: number; y: number; w: number; h: number; angle: number }>;
};

export type GameSettings = {
  p1Car: string;
  p2Car: string;
  p1Color: string;
  p2Color: string;
  map: string;
  sound: boolean;
  difficulty: BotDifficulty;
};
