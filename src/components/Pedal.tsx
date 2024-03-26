import PedalImg from "../assets/pedal.webp";

export function Pedal({ onClick }: { onClick: () => void }) {
  return (
    <div onClick={onClick}>
      <img id="pedal" src={PedalImg} />
    </div>
  );
}
