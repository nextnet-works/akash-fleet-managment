import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

type InfoTooltipProps = {
  info: string;
  Icon?: React.ReactNode;
};

export function InfoTooltip({ info, Icon }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="w-4 h-4">
            {Icon ?? <InfoIcon className="w-4 h-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{info}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
