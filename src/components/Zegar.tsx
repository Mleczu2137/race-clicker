export function Zegar({
  speed = 0,
  maxSpeed,
}: {
  speed?: number;
  maxSpeed: number;
}) {
  return (
    <div className="zegar">
      <div style={{ transform: `rotate(${speed / maxSpeed}turn)` }}></div>
    </div>
  );
}
