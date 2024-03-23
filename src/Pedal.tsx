import { useState } from "react";
import PedalImg from "./assets/pedal.webp";

export function Pedal({ onClick }: { onClick: () => void }) {
  const [clicks, setClicks] = useState(0);

  return (
    <div
      onClick={() => {
        setClicks(clicks + 1);
        onClick();
      }}
    >
      <p>Clicks: {clicks}</p>
      <img id="pedal" src={PedalImg} />
    </div>
  );
}
