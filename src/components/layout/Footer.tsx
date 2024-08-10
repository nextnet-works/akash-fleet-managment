import Logo from "@/assets/logo.svg?react";
import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
  NotionLogoIcon,
} from "@radix-ui/react-icons";
import XLogoIcon from "@/assets/companies/x.svg?react";
import { Button } from "../ui/button";

export const Footer = () => {
  return (
    <footer>
      <nav className="p-4 flex space-between gap-4 h-[64px] max-w-7xl mx-auto">
        <div className="flex-1 flex items-center justify-start">
          <Logo className="h-6 w-auto" />
        </div>
        <div className="flex gap-4 flex-1 items-center justify-center">
          <Button size="icon" variant="ghost">
            <NotionLogoIcon className="h-6 w-auto" color="#000" />
          </Button>
          <Button size="icon" variant="ghost">
            <XLogoIcon className="h-6 w-6" />
          </Button>
          <Button size="icon" variant="ghost">
            <LinkedInLogoIcon className="h-6 w-6" color="#0077b5" />
          </Button>
          <Button size="icon" variant="ghost">
            <GitHubLogoIcon className="h-6 w-6" color="#5c6bc0" />
          </Button>
          <Button size="icon" variant="ghost">
            <DiscordLogoIcon className="h-6 w-6" color="#7289da" />
          </Button>
        </div>
        <span className="flex-1 flex items-center justify-end">
          © 2024 NextNet. All rights reserved.
        </span>
      </nav>
    </footer>
  );
};