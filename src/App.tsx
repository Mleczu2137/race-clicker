import { TRACK_LENGTH } from "./util";
import "./App.css";
import { Pedal } from "./Pedal";
import { UpgradeButton } from "./UpgradeButton";
import { Zegar } from "./Zegar";
import { useWebsocket } from "./use-websocket";

//https://cdn.pixabay.com/photo/2019/10/01/22/23/pedals-4519485_1280.png

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
          <UpgradeButton name="Aerodynamika" />
          <UpgradeButton name="Prędkość" />
          <UpgradeButton name="Waga" />
          <UpgradeButton name="Tempomat" />
        </div>
        <Zegar speed={0} maxSpeed={1} />
        <Pedal
          onClick={() => {
            click()
          }}
        />
      </div>
    </main>
  );
}

export default App;
