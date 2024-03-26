type ClientData = { id: number; car: Car };
type Car = {
  username?: string;
  clicks?: number;
  tempo?: number;

  speed: number;
  acceleration: number;
  position: number;
  lap: number;
};

let cars: Car[] = [];

const server = Bun.serve<ClientData>({
  port: 25555,
  fetch(req, server) {
    if (cars.length >= MAX_PLAYERS) {
      return new Response("Server is full", { status: 400 });
    }

    server.upgrade(req, {
      data: {
        id: cars.length,
        car: { speed: 0, acceleration: 0, position: 0, lap: 0 },
      },
    });
  },
  websocket: {
    open(ws) {
      console.log(`Player ${ws.data.id} connected to server`);
      cars.push(ws.data.car);

      ws.send(JSON.stringify({ user: ws.data, cars: cars }));
      ws.subscribe("cars");
    },
    message(ws, message) {
      ws.data.car.acceleration += 5;
    },
    close(ws) {
      console.log(`Player ${ws.data.id} disconnected from the server`);
      cars = [];
    },
  },
});

const MAX_PLAYERS = 2;
const TRACK_LENGTH = 1000; //meters
const TICK_RATE = 64;
const DRAG_COEFFICIENT = 0.1;
const GRAVITY = 0.05;
const MASS = 1;

function calculate(cars: Car[]) {
  cars.forEach((car) => {
    car.acceleration /= MASS;
    const drag = (car.speed ** 2 * DRAG_COEFFICIENT) / MASS;
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
