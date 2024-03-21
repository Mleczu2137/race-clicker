export function UpgradeButton({
  name,
  image,
}: {
  name: string;
  image?: string;
}) {
  return (
    <button className="button">
      <img height={96} width={96} src={image} />
      <p>{name}</p>
    </button>
  );
}
