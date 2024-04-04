import { getPrice } from "../../server/shared";

export function UpgradeButton({
  name,
  image,
  level = 0,
  onClick,
}: {
  name: string;
  image?: string;
  level?: number;
  onClick?: () => void;
}) {
  return (
    <button className={`button ${name}`} onClick={onClick}>
      <img height={96} width={96} src={image} />
      <p className="name">{name}</p>
      <p>
        {level} level - {getPrice(level)} $
      </p>
    </button>
  );
}
