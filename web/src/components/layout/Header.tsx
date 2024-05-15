import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { AvatarMenu } from "./AvatarMenu";

export const Header = () => {
  return (
    <div className="p-4 flex gap-4">
      <AvatarMenu />
      <Button asChild variant="ghost">
        <Link to="/" search={undefined}>
          Home
        </Link>
      </Button>
      <Button asChild variant="ghost">
        <Link to="/yaml">Editor</Link>
      </Button>
    </div>
  );
};
