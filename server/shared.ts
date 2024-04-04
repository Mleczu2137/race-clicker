export type MessageIn =
  | { type: "click" }
  | { type: "upgrade"; name: "aerodynamics" | "velocity" | "mass" | "tempo" };

export type MessageOut =
  | { type: "update"; tick: number; cars: Car[] }
  | { type: "sync"; tick: number }
  | { type: "remove"; username: string };

export type Handshake = {
  user: string;
  tick: number;
  cars: Car[];
};

export type Upgrades = {
  aerodynamics: number;
  velocity: number;
  mass: number;
  tempo: number;
};

export type Car = {
  username: string;

  hasUpdated: boolean;
  clicks: number;
  money: number;

  upgrades: Upgrades;

  speed: number;
  acceleration: number;
  position: number;
  lap: number;
};

export type CarClient = {
  username: string;
  money: number;
  upgrades: Upgrades;
  speed: number;
  acceleration: number;
  position: number;
  lap: number;
};

export const TRACK_LENGTH = 1000; //meters
export const TICK_RATE = 64;
const DRAG_COEFFICIENT = 0.1;
const GRAVITY = 0.05;
const MASS = 1;

export function calculate(car: Car): Car {
  const dragCoefficient = DRAG_COEFFICIENT - car.upgrades.aerodynamics * 0.0001;
  const speedMultiplier = 1 + car.upgrades.velocity;
  const mass = MASS - car.upgrades.mass * 0.001;
  const tempo = car.upgrades.tempo * 0.1;

  car.acceleration = tempo;
  if (car.clicks !== undefined) {
    car.acceleration += car.clicks * speedMultiplier;
    car.clicks = 0;
  }
  car.acceleration /= mass;

  const drag = (car.speed ** 2 * dragCoefficient) / mass;
  car.acceleration -= drag;
  // gravity
  car.acceleration -= GRAVITY / TICK_RATE;

  car.speed = Math.max(0, car.speed + car.acceleration);
  car.position += car.speed;

  car.lap += Math.floor(car.position / TRACK_LENGTH);
  car.position %= TRACK_LENGTH;

  car.acceleration = 0;

  return car;
}

export function getPrice(level: number): number {
  if (level === 0) {
    return 1;
  }
  return Math.round(1 * Math.pow(1.15, level) * 100) / 100;
}
