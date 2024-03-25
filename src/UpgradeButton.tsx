export function UpgradeButton({
  name,
  image,
  level = 1,
  price = 1
}: {
  name: string;
  image?: string;
  level: number;
  price: number;
}) {
  return (
    <button className="button">
      <p>{level}</p>
      <img height={96} width={96} src={image} />
      <p>{name}</p>
      <p>CENA: {price}$</p>
    </button>
  );
}
