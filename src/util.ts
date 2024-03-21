export type Car = {
  speed: number;
  acceleration: number;
  position: number;
  lap: number;
};

const TRACK_LENGTH = 1000; //meters
const TICK_RATE = 64;
const DRAG_COEFFICIENT = 0.1;
const MASS = 1;

export function calculate(cars: Car[]) {
  return cars.map((car) => {
    car.acceleration /= MASS;
    const drag = (car.speed ** 2 * DRAG_COEFFICIENT) / MASS;
    car.acceleration -= drag;
    car.speed = Math.max(0, car.speed + car.acceleration);
    car.position += car.speed;

    car.lap += Math.floor(car.position / TRACK_LENGTH);
    car.position %= TRACK_LENGTH;

    car.acceleration = 0;

    return car;
  });
}
