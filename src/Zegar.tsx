export function Zegar({
  speed,
  maxSpeed,
}: {
  speed: number;
  maxSpeed: number;
}) {
  return (
    <div className="zegar">
      <div style={{ transform: `rotate(${speed / maxSpeed}turn)` }}></div>
    </div>
  );
}
