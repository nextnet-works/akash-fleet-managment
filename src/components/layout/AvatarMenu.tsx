import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { getKeplerAccounts } from "@/lib/kepler";
import { useStore } from "@/store";
import { LogOutIcon, LucideProps, UserIcon } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Button } from "../ui/button";

type Action = {
  name: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export function AvatarMenu() {
  const { setAkashKey, akashKey } = useStore((state) => state);
  const handleLoginWithKepler = async () => {
    if (akashKey) {
      setAkashKey(null);
      return;
    }
    const accounts = await getKeplerAccounts();
    setAkashKey(accounts[0].address);
  };

  const accounts: Action[] = [
    {
      name: akashKey ? "Logout Kepler Wallet" : "Connect with Kepler",
      icon: akashKey ? LogOutIcon : UserIcon,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer">
          <AvatarImage alt="Profile" src="/placeholder-avatar.jpg" />
          <AvatarFallback>
            <UserIcon className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" space-y-2 p-2">
        {accounts.map((account) => (
          <DropdownMenuItem
            key={account.name}
            onClick={handleLoginWithKepler}
            asChild
          >
            <Button
              className="flex items-center gap-3 cursor-pointer w-full"
              variant={"ghost"}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage alt={account.name} src="/placeholder-logo.svg" />
                <AvatarFallback>{account.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex items-center justify-between gap-4">
                <span className="font-medium">{account.name}</span>
                <account.icon className="h-5 w-5" />
              </div>
            </Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
