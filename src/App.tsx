import { useEffect, useState } from "react";
import { calculate, Car } from "./util";
import "./App.css";
import { Button } from "./Button";
import { UpgradeButton } from "./UpgradeButton";
import { Zegar } from "./Zegar";

function App() {
  const [cars, setCars] = useState<Car[]>([
    { position: 0, lap: 0, speed: 10, acceleration: 3 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCars((cars) => calculate(cars));
    }, 1000 / 64);

    return () => clearInterval(interval);
  }, [setCars]);

  return (
    <main>
      <div className="upgrades">
        <UpgradeButton name="Drag" />
        <UpgradeButton name="Speed" />
        <UpgradeButton name="Mass" />
      </div>

      {cars.map((car, index) => {
        return (
          <div
            key={index}
            style={{
              height: "100px",
              width: `${car.position / 10}%`,
              background: "red",
            }}
          ></div>
        );
      })}

      <Button
        onClick={() => {
          const car = cars[0];
          car.acceleration += 1;
          setCars(cars);
        }}
      />
      <Zegar speed={cars[0].speed} maxSpeed={6} />
    </main>
  );
}

export default App;
