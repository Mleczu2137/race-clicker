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

export default function Game(props: { username: string }) {
  const { status, user, cars, click, clicks, upgrade } = useWebsocket(
    props.username
  );

  if (status === "connecting") {
    return <div>Connecting...</div>;
  } else if (status === "closed") {
    return <div>Connection closed</div>;
  }

  return (
    <main>
      <div className="track">
        {cars.map((car) => (
          <div
            key={car.username}
            style={{
              transform: `translateX(${
                ((car.position >= TRACK_LENGTH / 2
                  ? car.position - TRACK_LENGTH
                  : car.position) /
                  TRACK_LENGTH) *
                (window.innerWidth + 202)
              }px)`,
            }}
          >
            <h2>{car.username}</h2>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="stats">
          <div>{clicks} clicks</div>
          <div>${user?.money}</div>
          <div>{0} fans</div>
        </div>
        <div className="upgrades">
          <UpgradeButton
            name="Aerodynamika"
            image={AerodynamicImage}
            level={user?.upgrades.aerodynamics}
            onClick={() => upgrade("aerodynamics")}
          />
          <UpgradeButton
            name="Prędkość"
            image={VelocityImage}
            level={user?.upgrades.velocity}
            onClick={() => upgrade("velocity")}
          />
          <UpgradeButton
            name="Waga"
            image={MassImage}
            level={user?.upgrades.mass}
            onClick={() => upgrade("mass")}
          />
          <UpgradeButton
            name="Tempomat"
            image={TempomatImage}
            level={user?.upgrades.tempo}
            onClick={() => upgrade("tempo")}
          />
        </div>
        <Zegar speed={0} maxSpeed={100} />
        <Pedal onClick={click} />
      </div>
    </main>
  );
}
