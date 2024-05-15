import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLinkIcon, PlusIcon, UserIcon } from "lucide-react";

type Account = {
  name: string;
  uri: string;
};

const accounts: Account[] = [
  {
    name: "Akash",
    uri: "stats.akash.network/addresses/akash1yddk6apmrtkcfzn85h5arnz7dfel8qxdyc02xa",
  },
  {
    name: "Cloudmos",
    uri: "cloudmos.io.deployments",
  },
  {
    name: "AWS (coming soon)",
    uri: "aws.amazon.com",
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
      <DropdownMenuContent className="w-64 space-y-2 p-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Linked Accounts</h3>
        </div>
        <Separator />
        {accounts.map((account, i) => (
          <DropdownMenuItem key={account.uri} disabled={i === 2}>
            <div className="flex items-center gap-3 cursor-pointer w-full">
              <Avatar className="h-8 w-8">
                <AvatarImage alt={account.name} src="/placeholder-logo.svg" />
                <AvatarFallback>{account.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex items-center justify-between">
                <p className="font-medium">{account.name}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="ml-auto"
                  onClick={() => window.open(account.uri, "_blank")}
                >
                  <ExternalLinkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </Button>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <Separator />
        <Button variant="outline" className="w-full">
          Link New Account <PlusIcon className="h-4 w-4 mx-2" />
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
