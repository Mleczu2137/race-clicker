export function Zegar({
  speed,
  maxSpeed,
}: {
  speed: number;
  maxSpeed: number;
}) {
  return (
    <div className="zegar">
      <div className="zegar-wskazowka" style={{ transform: `rotate(${(speed / maxSpeed) * 360}deg)` }}></div>
    </div>
  );
}
