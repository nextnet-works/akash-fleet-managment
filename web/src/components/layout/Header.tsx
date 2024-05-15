import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { useCoinPrice } from "@/hooks/useCoinPrice";

export const Header = () => {
  const coinPrice = useCoinPrice();

  return (
    <div className="p-4 flex gap-4">
      <Button asChild variant="ghost">
        <Link to="/" search={undefined}>
          Home
        </Link>
      </Button>
      <Button asChild variant="ghost">
        <Link to="/yaml">Editor</Link>
      </Button>
      <span className="ml-auto flex items-center gap-2 font-bold">
        AKT: {coinPrice}$
      </span>
    </div>
  );
};
