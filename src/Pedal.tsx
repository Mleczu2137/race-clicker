import { useState } from "react";
import PedalImg from "./assets/pedal.webp";

export function Pedal({ onClick }: { onClick: () => void }) {
  const [clicks, setClicks] = useState(0);

  return (
    <div>
      <p>Clicks: {clicks}</p>
      <img
        id="pedal"
        onClick={() => {
          setClicks(clicks + 1);
          onClick();
        }}
        src={PedalImg}
      />
    </div>
  );
}
