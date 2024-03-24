import { useEffect, useState } from "react";
import { calculate, Car, TRACK_LENGTH } from "./util";
import "./App.css";
import { Pedal } from "./Pedal";
import { UpgradeButton } from "./UpgradeButton";
import { Zegar } from "./Zegar";

//https://cdn.pixabay.com/photo/2019/10/01/22/23/pedals-4519485_1280.png

function App() {
  const [cars, setCars] = useState<Car[]>([
    { position: 0, lap: 0, speed: 0, acceleration: 0 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCars(calculate);
    }, 1000 / 64);

    return () => clearInterval(interval);
  }, [setCars]);

  return (
    <main>
      <div id="track">
        {cars.map((car, index) => (
          <div
            key={index}
            style={{
              transform: `translateX(${
                (car.position / TRACK_LENGTH) * window.innerWidth
              }px)`,
            }}
          ></div>
        ))}
      </div>

      <div id="panel">
        <div className="upgrades">
          <UpgradeButton name="Aerodynamika" />
          <UpgradeButton name="Prędkość" />
          <UpgradeButton name="Waga" />
          <UpgradeButton name="Tempomat" />
        </div>
        <Zegar speed={cars[0].speed} maxSpeed={1} />
        <Pedal
          onClick={() => {
            const car = cars[0];
            car.acceleration += 1;
            setCars(cars);
          }}
        />
      </div>
    </main>
  );
}

export default App;
