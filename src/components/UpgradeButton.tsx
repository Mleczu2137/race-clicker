export function UpgradeButton({
  name,
  image,
  level = 1,
  price = 1,
}: {
  name: string;
  image?: string;
  level?: number;
  price?: number;
}) {
  return (
    <button className={`button ${name}`}>
      <img height={96} width={96} src={image} />
      <p className="name">{name}</p>
      <p>
        {level} level - {Math.pow(level, 1.5).toFixed(2)} $
      </p>
    </button>
  );
}
