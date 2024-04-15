import {
  Car,
  Handshake,
  MessageIn,
  MessageOut,
  TICK_RATE,
  TRACK_LENGTH,
  getPrice,
} from "./shared";

class CarManager {
  private cars: Car[] = [];

  add(car: Car) {
    this.cars.push(car);
  }

  remove(username: string) {
    const index = this.cars.findIndex((car) => car.username === username);
    this.cars.splice(index, 1);
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

const MAX_PLAYERS = 2;
const cars = new CarManager();
let serverTick = 0;

const server = Bun.serve<Car>({
  port: 25555,
  fetch(req, server) {
    if (cars.size() >= MAX_PLAYERS) {
      return new Response("Server is full", { status: 400 });
    }

    const username = new URL(req.url).searchParams.get("username");
    if (!username) {
      return new Response("Username is required", { status: 400 });
    }
    if (cars.all().find((car) => car.username === username)) {
      return new Response("Username is already taken", { status: 400 });
    }

    server.upgrade(req, {
      data: {
        username,
        speed: 0,
        acceleration: 0,
        position: 0,
        lap: 0,
        upgrades: { aerodynamics: 0, velocity: 0, mass: 0, tempo: 0 },
        clicks: 0,
        money: 0,
        fans: 0,
        ws: null,
      },
    });
  },
  websocket: {
    open(ws) {
      console.log(`Player ${ws.data.username} connected to server`);
      ws.data.ws = ws;
      cars.add(ws.data);

      const handshake: Handshake = {
        user: ws.data,
        cars: cars.all(),
      };

      ws.send(
        JSON.stringify(handshake, [
          "user",
          "tick",
          "cars",
          "username",
          "upgrades",
          "aerodynamics",
          "velocity",
          "mass",
          "tempo",
          "position",
          "lap",
          "money",
        ])
      );
      ws.subscribe("cars");
    },
    message(ws, message) {
      const data: MessageIn = JSON.parse(message.toString());

      if (data.type === "click") {
        ws.data.clicks++;
      } else if (data.type === "upgrade") {
        const upgrade = data.name;
        const price = getPrice(ws.data.upgrades[upgrade]);
        if (ws.data.money < price) {
          return;
        }

        ws.data.money -= price;
        ws.data.upgrades[upgrade]++;

        const message: MessageOut = {
          type: "user",
          money: ws.data.money,
          upgrades: ws.data.upgrades,
        };

        ws.send(JSON.stringify(message));
      }
    },
    close(ws) {
      console.log(`Player ${ws.data.username} disconnected from the server`);
      cars.remove(ws.data.username);
    },
  },
});

setInterval(() => {
  cars.all().forEach((car) => {
    calculate(car);
  });

  const message: MessageOut = {
    type: "update",
    cars: cars.all(),
  };

  server.publish(
    "cars",
    JSON.stringify(message, ["type", "cars", "username", "position", "lap"])
  );

  serverTick++;
}, 1000 / TICK_RATE);

const DRAG_COEFFICIENT = 0.1;
const GRAVITY = 0.05;
const MASS = 1;

function calculate(car: Car): Car {
  const dragCoefficient = DRAG_COEFFICIENT - car.upgrades.aerodynamics * 0.001;
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

  const lap_completed = Math.floor(car.position / TRACK_LENGTH);

  const message: MessageOut = {
    type: "user",
    speed: car.speed,
  };

  if (lap_completed > 0) {
    car.position %= TRACK_LENGTH;
    car.money += lap_completed + car.fans;
    car.lap += lap_completed;

    message.money = car.money;
  }

  car.ws.send(JSON.stringify(message));

  car.acceleration = 0;

  return car;
}
