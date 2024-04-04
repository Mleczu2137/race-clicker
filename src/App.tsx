import React, { useState } from "react";
import "./App.css";
import { Pedal } from "./components/Pedal";
import { UpgradeButton } from "./components/UpgradeButton";
import { Zegar } from "./components/Zegar";
import { useWebsocket } from "./lib/use-websocket";
import { TRACK_LENGTH } from "../server/shared";

function MoneyDisplay({ money }: { money: number }) {
  return <div>${money}</div>;
}

function FansDisplay({ fans }: { fans: number }) {
  return <div>{fans} fans</div>;
}

function App() {
  const { status, cars, click, clicks, upgrade } = useWebsocket("hatfu");
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
          <FansDisplay fans={0} />
        </div>
        <div className="upgrades">
          <UpgradeButton
            name="Aerodynamika"
            image="assets/aerodynamika.png"
            onClick={(s) => upgrade(s)}
          />
          <UpgradeButton name="Prędkość" onClick={(s) => upgrade(s)} />
          <UpgradeButton name="Waga" onClick={(s) => upgrade(s)} />
          <UpgradeButton name="Tempomat" onClick={(s) => upgrade(s)} />
        </div>
        <Zegar speed={0} maxSpeed={5} />
        <Pedal onClick={addMoneyOnClick} />
      </div>
    </main>
  );
}

export default App;
