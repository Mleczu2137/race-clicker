type ClientData = { id: number };
type Car = {
  speed: number;
  acceleration: number;
  position: number;
  lap: number;
};

const MAX_PLAYERS = 2;
let cars: Car[] = [];

const server = Bun.serve<ClientData>({
  port: 25555,
  fetch(req, server) {
    if (cars.length >= MAX_PLAYERS) {
      return new Response("Server is full", { status: 400 });
    }

    server.upgrade(req, { data: { id: cars.length } });
  },
  websocket: {
    open(ws) {
      console.log(`Player ${ws.data.id} connected to server`);
      cars.push({ speed: 0, acceleration: 0, position: 0, lap: 0 });

      ws.send(JSON.stringify({ user: ws.data, cars: cars }));
      ws.subscribe("cars");
    },
    message(ws, message) {
      const car = cars[ws.data.id];
      if (!car) {
        ws.close();
        return;
      }

      car.acceleration += 5;
    },
    close(ws) {
      console.log(`Player ${ws.data.id} disconnected from the server`);
      cars = [];
    },
  },
});

const TRACK_LENGTH = 1000; //meters
const TICK_RATE = 64;
const DRAG_COEFFICIENT = 0.1;
const MASS = 1;

function calculate(cars: Car[]) {
  cars.forEach((car) => {
    car.acceleration /= MASS;
    const drag = (car.speed ** 2 * DRAG_COEFFICIENT) / MASS;
    car.acceleration -= drag;
    // gravity
    car.acceleration -= 0.05 / TICK_RATE;
    car.speed = Math.max(0, car.speed + car.acceleration);
    car.position += car.speed;

    car.lap += Math.floor(car.position / TRACK_LENGTH);
    car.position %= TRACK_LENGTH;

    car.acceleration = 0;
  });
}

const loop = setInterval(() => {
  const carsToSend = Object.assign(
    {},
    cars.map((car) => (car.acceleration > 0 ? car : undefined))
  );

  if (carsToSend[0]) {
    server.publish("cars", JSON.stringify(carsToSend));
  }

  calculate(cars);
}, 1000 / TICK_RATE);
