import {
  Car,
  Handshake,
  MessageIn,
  MessageOut,
  calculate,
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

const cars = new CarManager();

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
        hasUpdated: true,
      },
    });
  },
  websocket: {
    open(ws) {
      console.log(`Player ${ws.data.username} connected to server`);
      cars.add(ws.data);

      const handshake: Handshake = { user: ws.data.username, cars: cars.all() };

      ws.send(
        JSON.stringify(handshake, [
          "user",
          "cars",
          "username",
          "upgrades",
          "aerodynamics",
          "velocity",
          "mass",
          "tempo",
          "speed",
          "acceleration",
          "position",
          "lap",
          "money",
        ])
      );
      ws.subscribe("cars");
    },
    message(ws, message) {
      const data: MessageIn = JSON.parse(message.toString());

      ws.data.hasUpdated = true;
      if (data.type === "click") {
        ws.data.clicks++;
      } else if (data.type === "upgrade") {
        const upgrade = data.name;

        const price = getPrice(ws.data.upgrades[upgrade]);
        if (ws.data.money >= price) {
          ws.data.money -= price;
          ws.data.upgrades[upgrade]++;
        }
      }
    },
    close(ws) {
      console.log(`Player ${ws.data.username} disconnected from the server`);
      cars.remove(ws.data.username);
      const message: MessageOut = {
        type: "remove",
        username: ws.data.username,
      };
      ws.publish("cars", JSON.stringify(message));
    },
  },
});

const MAX_PLAYERS = 2;
const TICK_RATE = 64;

setInterval(() => {
  cars.all().forEach((car) => {
    calculate(car);
  });

  const carsToSend = cars.all().filter((car) => car.hasUpdated);
  if (carsToSend.length > 0) {
    console.log(carsToSend);

    const message: MessageOut = {
      type: "update",
      cars: carsToSend,
    };

    server.publish(
      "cars",
      JSON.stringify(message, [
        "type",
        "cars",
        "username",
        "upgrades",
        "aerodynamics",
        "velocity",
        "mass",
        "tempo",
        "speed",
        "acceleration",
        "position",
        "lap",
        "money",
      ])
    );
  }

  cars.all().forEach((car) => {
    car.hasUpdated = false;
  });
}, 1000 / TICK_RATE);
