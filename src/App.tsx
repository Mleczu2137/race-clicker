import "./App.css";
import { Pedal } from "./components/Pedal";
import { UpgradeButton } from "./components/UpgradeButton";
import { Zegar } from "./components/Zegar";
import { useWebsocket } from "./lib/use-websocket";
import { TRACK_LENGTH } from "../server/shared";
import AerodynamicImage from "./assets/aerodynamika.svg";
import VelocityImage from "./assets/predkosc.svg";
import MassImage from "./assets/waga.svg";
import TempomatImage from "./assets/tempomat_icon.svg";

function App() {
  const { status, userCar, cars, click, clicks, upgrade } =
    useWebsocket("hatfu");

  if (status === "connecting") {
    return <div>Connecting...</div>;
  } else if (status === "closed") {
    return <div>Connection closed</div>;
  }

  return (
    <main>
      <div className="track">
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
          <div>${userCar?.money}</div>
          <div>{0} fans</div>
        </div>
        <div className="upgrades">
          <UpgradeButton
            name="Aerodynamika"
            image={AerodynamicImage}
            level={userCar?.upgrades.aerodynamics}
            onClick={() => upgrade("aerodynamics")}
          />
          <UpgradeButton
            name="Prędkość"
            image={VelocityImage}
            level={userCar?.upgrades.velocity}
            onClick={() => upgrade("velocity")}
          />
          <UpgradeButton
            name="Waga"
            image={MassImage}
            level={userCar?.upgrades.mass}
            onClick={() => upgrade("mass")}
          />
          <UpgradeButton
            name="Tempomat"
            image={TempomatImage}
            level={userCar?.upgrades.tempo}
            onClick={() => upgrade("tempo")}
          />
        </div>
        <Zegar speed={userCar?.speed} maxSpeed={100} />
        <Pedal onClick={click} />
      </div>
    </main>
  );
}

export default App;
