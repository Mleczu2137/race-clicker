type ClientData = { id: number; car: Car };

type MessageIn =
  | { type: "click" }
  | { type: "upgrade"; name: "aerodynamics" | "velocity" | "mass" | "tempo" };

type MessageOut = Car[];

type Upgrades = {
  aerodynamics: number;
  velocity: number;
  mass: number;
  tempo: number;
};

type Car = {
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

class CarManager {
  private cars: Car[] = [];

  add(car: Car) {
    this.cars.push(car);
  }

  remove(username: string) {
    const index = this.cars.findIndex((car) => car.username === username);
    delete this.cars[index];
  }

  get(username: string) {
    const index = this.cars.findIndex((car) => car.username === username);
    return this.cars[index];
  }

  all() {
    return Array.from(this.cars.values());
  }

  size() {
    return this.cars.length;
  }
}

const cars = new CarManager();

const server = Bun.serve<ClientData>({
  port: 25555,
  fetch(req, server) {
    if (cars.size() >= MAX_PLAYERS) {
      return new Response("Server is full", { status: 400 });
    }

    const username = new URL(req.url).searchParams.get("username");
    if (!username) {
      return new Response("Username is required", { status: 400 });
    }

    server.upgrade(req, {
      data: {
        id: cars,
        car: {
          username,
          speed: 0,
          acceleration: 0,
          position: 0,
          lap: 0,
          upgrades: { aerodynamics: 0, velocity: 0, mass: 0, tempo: 0 },
          clicks: 0,
          money: 0,
        },
      },
    });
  },
  websocket: {
    open(ws) {
      console.log(`Player ${ws.data.id} connected to server`);
      cars.add(ws.data.car);

      ws.send(JSON.stringify({ user: ws.data, cars: cars }));
      ws.subscribe("cars");
    },
    message(ws, message) {
      const data: MessageIn = JSON.parse(message.toString());

      ws.data.car.hasUpdated = true;
      if (data.type === "click") {
        ws.data.car.clicks++;
      } else if (data.type === "upgrade") {
        const upgrade = data.name;

        const price = getPrice(ws.data.car.upgrades[upgrade]);
        if (ws.data.car.money >= price) {
          ws.data.car.money -= price;
          ws.data.car.upgrades[upgrade]++;
        }
      }
    },
    close(ws) {
      console.log(`Player ${ws.data.id} disconnected from the server`);
      cars.remove(ws.data.car.username);
    },
  },
});

function getPrice(level: number): number {
  return Math.round(1 * Math.pow(1.15, level) * 100) / 100;
}

const MAX_PLAYERS = 2;
const TRACK_LENGTH = 1000; //meters
const TICK_RATE = 64;
const DRAG_COEFFICIENT = 0.1;
const GRAVITY = 0.05;
const MASS = 1;

function calculate(cars: Car[]) {
  cars.forEach((car) => {
    const dragCoefficient =
      DRAG_COEFFICIENT - car.upgrades.aerodynamics * 0.001;
    const speedMultiplier = 1 + car.upgrades.velocity;
    const mass = MASS - car.upgrades.mass * 0.01;
    const tempo = car.upgrades.tempo * 0.25;

    car.acceleration = tempo + car.clicks * speedMultiplier;
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
  });
}

setInterval(() => {
  const carsToSend = cars.all().filter((car) => car.hasUpdated);

  if (carsToSend.length > 0) {
    server.publish(
      "cars",
      JSON.stringify(carsToSend, [
        "username",
        "upgrades",
        "speed",
        "acceleration",
        "position",
        "lap",
      ])
    );
  }

  calculate(cars.all());
  cars.all().forEach((car) => (car.hasUpdated = false));
}, 1000 / TICK_RATE);
