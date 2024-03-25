import { useState } from "react";
import { TRACK_LENGTH } from "./util";
import "./App.css";
import { Pedal } from "./Pedal";
import { UpgradeButton } from "./UpgradeButton";
import { Zegar } from "./Zegar";
import { useWebsocket } from "./use-websocket";


function MoneyDisplay() {
  const [money, setMoney] = useState(0);

  return <div className="money">Money: ${money}</div>; 
}

function FansDisplay() {
  const [fans, setFans] = useState(0);

  return <div className="fans">Fans: {fans}</div>; 
}

function App() {
  const { cars, click } = useWebsocket();

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
          <UpgradeButton name="Aerodynamika" image="assets/aerodynamika.png"/>
          <UpgradeButton name="Prędkość" />
          <UpgradeButton name="Waga" />
          <UpgradeButton name="Tempomat" />
        </div>
        <Zegar speed={cars[0].speed} maxSpeed={5} />
        <Pedal
          onClick={() => {
            click()
          }}
        />
        <MoneyDisplay />
        <FansDisplay />
      </div>
    </main>
  );
}

export default App;
