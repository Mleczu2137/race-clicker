type ClientData = { name: string };
type Car = {
  speed: number;
  acceleration: number;
  position: number;
  lap: number;
};

const TRACK_LENGTH = 1000; //meters
const MAX_PLAYERS = 2;
const cars = new Map<string, Car>();

// const server = Bun.serve<ClientData>({
//   port: 25555,
//   fetch(req, server) {
//     if (cars.size >= MAX_PLAYERS) {
//       return new Response("Server is full", { status: 400 });
//     }
//     const name = new URL(req.url).searchParams.get("name");

//     if (!name) {
//       return new Response("Name is required", { status: 400 });
//     }
//     if (cars.has(name)) {
//       return new Response("Name is already taken", { status: 400 });
//     }

//     server.upgrade(req, {
//       data: { name },
//     });

//     cars.set(name, { speed: 0, acceleration: 0, position: 0 });
//   },
//   websocket: {
//     open(ws) {
//       ws.subscribe("cars");
//     },
//     message(ws, message) {
//       const car = cars.get(ws.data.name);
//       if (!car) {
//         ws.close();
//         return;
//       }

//       car.speed += 1;
//     },
//     close(ws) {
//       cars.delete(ws.data.name);
//     },
//   },
// });

cars.set("player1", { speed: 0, acceleration: 9, position: 0, lap: 0 });

const TICK_RATE = 64;
const DRAG_COEFFICIENT = 0.5;
const MASS = 1;

const loop = setInterval(() => {
  cars.forEach((car) => {
    const drag = car.speed ** 2 * DRAG_COEFFICIENT;
    console.log("drag", drag);
    console.log("drag/MASS", drag / MASS);
    console.log("acceleration before drag", car.acceleration);
    car.acceleration -= drag / MASS;
    console.log("acceleration after drag", car.acceleration);

    //car.speed += car.acceleration;
    car.speed = Math.max(0, car.speed + car.acceleration);
    car.position += car.speed;

    car.lap += Math.floor(car.position / TRACK_LENGTH);
    car.position %= TRACK_LENGTH;

    car.acceleration = 0;

    console.log(car);
  });

  //server.publish("cars", JSON.stringify(cars));
}, 1000 / TICK_RATE);

setTimeout(() => {
  clearInterval(loop);
}, 500);
