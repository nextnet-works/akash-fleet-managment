import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";

type Account = {
  name: string;
  uri: string;
};

const accounts: Account[] = [
  {
    name: "Kepler Wallet",
    uri: "keplerwallet.io",
  },
];

export function AvatarMenu() {
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
        {accounts.map((account, i) => (
          <DropdownMenuItem
            key={account.uri}
            disabled={i > 1}
            onClick={() => window.open(account.uri, "_blank")}
          >
            <div className="flex items-center gap-3 cursor-pointer w-full">
              <Avatar className="h-8 w-8">
                <AvatarImage alt={account.name} src="/placeholder-logo.svg" />
                <AvatarFallback>{account.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex items-center justify-between">
                <p className="font-medium">{account.name}</p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
