import Logo from "@/assets/logos/logo.svg?react";
import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  NotionLogoIcon,
} from "@radix-ui/react-icons";
import XLogoIcon from "@/assets/companies/x.svg?react";
import { Button } from "../ui/button";

export const Footer = () => {
  return (
    <footer>
      <nav className="p-4 flex flex-col justify-center items-center gap-8 space-between md:gap-4 h-[64px] max-w-7xl mx-auto md:flex-row">
        <div className="flex-1 flex items-center justify-start">
          <Logo className="h-6 w-auto" />
        </div>
        <div className="flex gap-4 flex-1 items-center justify-center">
          <Button size="icon" variant="ghost" asChild>
            <a
              href="https://x.com/nextnet_works?s=21&t=1xBtmNSuUOq-DmX0qkYNdA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <NotionLogoIcon className="h-6 w-auto" color="#000" />
            </a>
          </Button>
          <Button size="icon" variant="ghost" asChild>
            <a
              href="https://x.com/nextnet_works?s=21&t=1xBtmNSuUOq-DmX0qkYNdA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <XLogoIcon className="h-6 w-6" />
            </a>
          </Button>
          <Button size="icon" variant="ghost" asChild>
            <a
              href="https://x.com/nextnet_works?s=21&t=1xBtmNSuUOq-DmX0qkYNdA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubLogoIcon className="h-6 w-6" color="#5c6bc0" />
            </a>
          </Button>
          <Button size="icon" variant="ghost" asChild disabled>
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
