import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/store";
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
  const setAkashKey = useStore((state) => state.setAkashKey);
  const handleLoginWithKeplr = async () => {
    if (!window.keplr) {
      alert("Please install keplr extension");
    } else {
      const chainId = "akashnet-2";
      await window.keplr.enable(chainId);
      const offlineSigner = window.keplr.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      setAkashKey(accounts[0].address);
    }
  };

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
            onClick={handleLoginWithKeplr}
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
