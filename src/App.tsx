import React, { useState } from "react";
import { TRACK_LENGTH } from "./lib/util";
import "./App.css";
import { Pedal } from "./components/Pedal";
import { UpgradeButton } from "./components/UpgradeButton";
import { Zegar } from "./components/Zegar";
import { useWebsocket } from "./lib/use-websocket";

function MoneyDisplay({ money }) {
  return <div>${money}</div>;
}

function FansDisplay() {
  const [fans, setFans] = useState(0);

  return <div>{fans} fans</div>;
}

function App() {
  const { status, cars, click, clicks } = useWebsocket();
  const [money, setMoney] = useState(0);

  if (status === "connecting") {
    return <div>Connecting...</div>;
  }

  const addMoneyOnClick = () => {
    click()
    setMoney(money + 1);
  };

  return (
    <main>
      <div className="track">
        <div>
          {/* Track */}
        </div>
        <div></div>
        {cars.map((car, index) => (
          <div
            key={index}
            style={{
              transform: `translateX(${
                (car.position / TRACK_LENGTH) * window.innerWidth
              }px)`,
            }}
          />
        ))}
      </div>

      <div className="panel">
        <div className="stats">
          <div>{clicks} clicks</div>
          <MoneyDisplay money={money} />
          <FansDisplay />
        </div>
        <div className="upgrades">
          <UpgradeButton name="Aerodynamika" image="assets/aerodynamika.png" />
          <UpgradeButton name="Prędkość" />
          <UpgradeButton name="Waga" />
          <UpgradeButton name="Tempomat" />
        </div>
        <Zegar speed={0} maxSpeed={5} />
        <Pedal onClick={addMoneyOnClick} />
      </div>
    </main>
  );
}

export default App;
