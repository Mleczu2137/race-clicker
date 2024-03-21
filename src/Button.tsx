import { useState } from "react";

export function Button({ onClick }: { onClick: () => void }) {
  const [clicks, setClicks] = useState(0);

  return (
    <>
      <p>Clicks: {clicks}</p>
      <button
        onClick={() => {
          setClicks(clicks + 1);
          onClick();
        }}
      >
        SPEEDUJ
      </button>
    </>
  );
}
