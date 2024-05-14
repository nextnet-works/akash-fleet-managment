import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { useCoinPrice } from "@/hooks/useCoinPrice";

export const Header = () => {
  const coinPrice = useCoinPrice();

  return (
    <div className="p-4 flex gap-4">
      <Button asChild variant="link">
        <Link to="/" search={undefined}>
          Dashboard
        </Link>
      </Button>
      <Button asChild variant="link">
        <Link to="/">Deployments</Link>
      </Button>
      <span className="ml-auto">
        AKT: <b className="text-2xl">{coinPrice}$</b>
      </span>
    </div>
  );
};
