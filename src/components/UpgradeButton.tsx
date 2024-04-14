import { useMemo } from "react";
import { getPrice } from "../../server/shared";

export function UpgradeButton({
  name,
  image,
  level = 0,
  onClick,
  money,
}: {
  name: string;
  image?: string;
  level?: number;
  onClick?: () => void;
  money: number;
}) {
  const price = useMemo(() => getPrice(level), [level]);

  return (
    <button className={`button ${name}`} onClick={onClick} disabled={price > money}>
      <img height={96} width={96} src={image} />
      <p className="name">{name}</p>
      <p>
        {level} level - {price} $
      </p>
    </button>
  );
}
