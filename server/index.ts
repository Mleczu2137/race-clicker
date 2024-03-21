type ClientData = { name: string; id: number };
type Car = {
  speed: number;
  acceleration: number;
  position: number;
  lap: number;
};

const MAX_PLAYERS = 2;
const cars: Car[] = [];

const server = Bun.serve<ClientData>({
  port: 25555,
  fetch(req, server) {
    if (cars.length >= MAX_PLAYERS) {
      return new Response("Server is full", { status: 400 });
    }
    const name = new URL(req.url).searchParams.get("name");

    if (!name) {
      return new Response("Name is required", { status: 400 });
    }
    // if (cars.has(name)) {
    //   return new Response("Name is already taken", { status: 400 });
    // }

    server.upgrade(req, {
      data: { name },
    });

    cars.push({ speed: 0, acceleration: 0, position: 0, lap: 0 });
  },
  websocket: {
    open(ws) {
      ws.subscribe("cars");
    },
    message(ws, message) {
      const car = cars[ws.data.id];
      if (!car) {
        ws.close();
        return;
      }

      car.speed += 1;
    },
    close(ws) {
      //cars.delete(ws.data.name);
    },
  },
});

cars.push({ speed: 0, acceleration: 100, position: 0, lap: 0 });

const TRACK_LENGTH = 1000; //meters
const TICK_RATE = 64;
const DRAG_COEFFICIENT = 0.5;
const MASS = 1;

function calculate(cars: Car[]) {
  cars.forEach((car) => {
    const drag = car.speed ** 2 * DRAG_COEFFICIENT;
    car.acceleration -= drag / MASS;

    car.speed = Math.max(0, car.speed + car.acceleration);
    car.position += car.speed;

    car.lap += Math.floor(car.position / TRACK_LENGTH);
    car.position %= TRACK_LENGTH;

    car.acceleration = 0;
  });
}

const loop = setInterval(() => {
  const carsToSend = cars.filter((car) => car.acceleration > 0);

  calculate(cars)

  //server.publish("cars", JSON.stringify(carsToSend));
}, 1000 / TICK_RATE);

setTimeout(() => {
  clearInterval(loop);
}, 500);
