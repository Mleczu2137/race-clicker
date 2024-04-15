export type MessageIn =
  | { type: "click" }
  | { type: "upgrade"; name: "aerodynamics" | "velocity" | "mass" | "tempo" };

export type MessageOut =
  | { type: "update"; cars: CarClient[] }
  | ({ type: "user" } & Partial<User>);

export type Handshake = {
  user: User;
  cars: CarClient[];
};

export type User = {
  money: number;
  fans: number;
  upgrades: Upgrades;
  speed: number;
  ws: any;
};

export type Upgrades = {
  aerodynamics: number;
  velocity: number;
  mass: number;
  tempo: number;
};

export type Car = {
  username: string;
  clicks: number;

  speed: number;
  acceleration: number;
  position: number;
  lap: number;
} & User;

export type CarClient = {
  username: string;
  speed: number;
  position: number;
  lap: number;
};

export const TRACK_LENGTH = 1000; //meters
export const TICK_RATE = 64;

export function getPrice(level: number): number {
  if (level === 0) {
    return 1;
  }
  return Math.round(1 * Math.pow(1.15, level) * 100) / 100;
}
