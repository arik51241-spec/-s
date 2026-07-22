import type { ArenaConfig, VehicleConfig } from "./types";

export const VEHICLES: VehicleConfig[] = [
  { id: "city", name: "Городская искра", kind: "city", mass: 1.5, power: .00135, maxSpeed: 8.5, wheelRadius: 11, width: 58, height: 25, grip: .88, bounce: .34, airTorque: .0015, headX: 8, headY: -25, color: "#b9ff45" },
  { id: "sport", name: "Фиолетовая молния", kind: "sport", mass: 1.25, power: .0017, maxSpeed: 10.5, wheelRadius: 10, width: 66, height: 20, grip: .84, bounce: .3, airTorque: .0019, headX: -2, headY: -22, color: "#a875ff" },
  { id: "pickup", name: "Пикап Бунтарь", kind: "pickup", mass: 2.15, power: .00145, maxSpeed: 8, wheelRadius: 13, width: 76, height: 27, grip: .91, bounce: .28, airTorque: .00125, headX: 14, headY: -27, color: "#ffb13b" },
  { id: "suv", name: "Ночной внедорожник", kind: "suv", mass: 2.35, power: .0014, maxSpeed: 7.7, wheelRadius: 15, width: 70, height: 31, grip: .92, bounce: .32, airTorque: .00118, headX: 4, headY: -31, color: "#64f0b4" },
  { id: "truck", name: "Тяжёлый гром", kind: "truck", mass: 3.4, power: .00125, maxSpeed: 6.6, wheelRadius: 17, width: 86, height: 38, grip: .95, bounce: .22, airTorque: .00082, headX: 25, headY: -38, color: "#ff5858" },
  { id: "bus", name: "Неоновый автобус", kind: "bus", mass: 3.8, power: .00105, maxSpeed: 6, wheelRadius: 14, width: 108, height: 42, grip: .9, bounce: .2, airTorque: .0007, headX: 38, headY: -38, color: "#52d9ff" },
  { id: "tractor", name: "Кибер-трактор", kind: "tractor", mass: 2.8, power: .00128, maxSpeed: 6.5, wheelRadius: 19, width: 73, height: 34, grip: .96, bounce: .36, airTorque: .001, headX: 10, headY: -38, color: "#9be23f" },
  { id: "formula", name: "Формула Пульс", kind: "formula", mass: 1.05, power: .0019, maxSpeed: 11.5, wheelRadius: 9, width: 82, height: 16, grip: .82, bounce: .29, airTorque: .0021, headX: -6, headY: -18, color: "#f5efff" },
  { id: "police", name: "Пиксельный патруль", kind: "police", mass: 1.85, power: .00148, maxSpeed: 9, wheelRadius: 12, width: 68, height: 28, grip: .89, bounce: .31, airTorque: .00142, headX: 2, headY: -28, color: "#5b8dff" },
  { id: "loader", name: "Ковш любви", kind: "loader", mass: 3.1, power: .0012, maxSpeed: 6.2, wheelRadius: 16, width: 88, height: 34, grip: .94, bounce: .25, airTorque: .0009, headX: -2, headY: -36, color: "#ffd342" },
  { id: "monster", name: "Монстр 16", kind: "monster", mass: 2.6, power: .0015, maxSpeed: 7.5, wheelRadius: 22, width: 70, height: 26, grip: .9, bounce: .5, airTorque: .00128, headX: 0, headY: -34, color: "#ff4f8b" },
  { id: "limo", name: "Длинная ночь", kind: "limo", mass: 2.45, power: .00125, maxSpeed: 8.2, wheelRadius: 11, width: 112, height: 22, grip: .87, bounce: .24, airTorque: .00096, headX: 28, headY: -24, color: "#bd79ff" },
];

export const ARENAS: ArenaConfig[] = [
  { id: "flat", name: "Чёрный асфальт", subtitle: "Прямая дуэль", gravity: 1, friction: .82, hazard: "none" },
  { id: "center", name: "Фиолетовый пьедестал", subtitle: "Платформа в центре", gravity: 1, friction: .8, hazard: "none" },
  { id: "pit", name: "Разлом", subtitle: "Яма между игроками", gravity: 1, friction: .84, hazard: "pit" },
  { id: "ramps", name: "Двойной трамплин", subtitle: "Две встречные рампы", gravity: 1, friction: .81, hazard: "none" },
  { id: "islands", name: "Пиксельные острова", subtitle: "Маленькие платформы", gravity: .96, friction: .8, hazard: "pit" },
  { id: "elevator", name: "Лифт 16", subtitle: "Движущаяся платформа", gravity: 1, friction: .82, hazard: "elevator" },
  { id: "spinner", name: "Крутилка", subtitle: "Вращающаяся перекладина", gravity: 1, friction: .83, hazard: "spinner" },
  { id: "blocks", name: "Падающий потолок", subtitle: "Сверху летят блоки", gravity: 1, friction: .82, hazard: "blocks" },
  { id: "crumbly", name: "Хрупкий пол", subtitle: "Пол разваливается", gravity: 1, friction: .8, hazard: "crumbly" },
  { id: "liquid", name: "Зелёная волна", subtitle: "Опасность поднимается", gravity: 1, friction: .82, hazard: "liquid" },
  { id: "press", name: "Пресс любви", subtitle: "Стены сходятся", gravity: 1, friction: .84, hazard: "press" },
  { id: "train", name: "Ночной экспресс", subtitle: "Поезд пересекает арену", gravity: 1, friction: .8, hazard: "train" },
  { id: "moon", name: "Лунная орбита", subtitle: "Низкая гравитация", gravity: .42, friction: .76, hazard: "none" },
  { id: "ice", name: "Ледяной неон", subtitle: "Очень скользко", gravity: 1, friction: .08, hazard: "none" },
  { id: "closing", name: "Последний квадрат", subtitle: "Арена постепенно сужается", gravity: 1, friction: .82, hazard: "closing" },
];

export const PALETTE = ["#b9ff45", "#a875ff", "#ff4f8b", "#52d9ff", "#ffb13b", "#f5efff", "#ff5858", "#64f0b4"];

export const getVehicle = (id: string) => VEHICLES.find((vehicle) => vehicle.id === id) ?? VEHICLES[0];
export const getArena = (id: string) => ARENAS.find((arena) => arena.id === id) ?? ARENAS[0];
