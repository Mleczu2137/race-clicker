import { useState } from "react";
import { TRACK_LENGTH } from "./lib/util";
import "./App.css";
import { Pedal } from "./components/Pedal";
import { UpgradeButton } from "./components/UpgradeButton";
import { Zegar } from "./components/Zegar";
import { useWebsocket } from "./lib/use-websocket";

function MoneyDisplay() {
  const [money, setMoney] = useState(0);

  return <div>${money}</div>;
}

function FansDisplay() {
  const [fans, setFans] = useState(0);

  return <div>{fans} fans</div>;
}

function App() {
  const { status, cars, click, clicks } = useWebsocket();

  if (status === "connecting") {
    return <div>Connecting...</div>;
  }

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
        <div className="stats">
          <div>{clicks} clicks</div>
          <MoneyDisplay />
          <FansDisplay />
        </div>
        <div className="upgrades">
          <UpgradeButton name="Aerodynamika" image="assets/aerodynamika.png" />
          <UpgradeButton name="Prędkość" />
          <UpgradeButton name="Waga" />
          <UpgradeButton name="Tempomat" />
        </div>
        <Zegar speed={0} maxSpeed={5} />
        <Pedal onClick={click} />
      </div>
    </main>
  );
}

export default App;
