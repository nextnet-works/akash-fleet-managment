import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/types/supabase.gen";
import { green, red, yellow } from "@/lib/consts";
import {
  convertToReadableTime,
  getLeaseActiveTimeInMinutes,
} from "@/lib/utils";
import { Lease_State } from "@akashnetwork/akash-api/akash/market/v1beta4";
import { getPricePerHour, getRankingColor } from "./utils";
import { Button } from "../ui/button";
import { ExternalLinkIcon } from "lucide-react";
import { useCoinPrice } from "@/hooks/useCoinPrice";
import { useTimer } from "@/hooks/useTimer";

type DashboardTableProps = {
  nodes: (Tables<"nodes"> & {
    sdl: Tables<"sdl">;
    rank: number;
  })[];
  currentBlock: number;
};

export const DashboardTable = ({
  nodes,
  currentBlock,
}: DashboardTableProps) => {
  const coinPrice = useCoinPrice();
  const secondsPassed = useTimer();

  return (
    <div className="border rounded-lg w-full max-w-[1400px]">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">DSEC/GSEC</TableHead>
              <TableHead className="text-center">T-Shirt Name</TableHead>
              <TableHead className="text-center">
                Payment per Hour ($)
              </TableHead>{" "}
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Active Time (Hour)</TableHead>
              <TableHead className="text-center">Ranking</TableHead>
              <TableHead className="text-center">Cloud Provider</TableHead>
              <TableHead className="text-center">App Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nodes.map((data) => (
              <TableRow key={data.dseq}>
                <TableCell className="font-medium text-center">
                  {data.dseq.toString().slice(-4)}/{data.gseq}
                </TableCell>
                <TableCell className="text-center">{data.sdl.name}</TableCell>
                <TableCell className="text-center">
                  ${getPricePerHour(data.price_per_block, coinPrice).toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={
                      data.state === Lease_State.active
                        ? green
                        : data.state === Lease_State.UNRECOGNIZED
                          ? yellow
                          : red
                    }
                    variant="outline"
                  >
                    {Lease_State[data.state]}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {convertToReadableTime(
                    (getLeaseActiveTimeInMinutes(
                      data.lease_first_block,
                      currentBlock
                    ) +
                      secondsPassed / 60) *
                      60 *
                      1000
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span className={getRankingColor(data.rank, nodes.length)}>
                    {data.rank} / {nodes.length}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <img
                    alt={"Akash Network"}
                    className="w-6 h-6 object-contain mx-auto"
                    height="24"
                    src="https://ailifxntfghvpmukgfgw.supabase.co/storage/v1/object/public/assets/akash-sign-red.svg?t=2024-05-14T20%3A41%3A30.530Z"
                    style={{
                      aspectRatio: "24/24",
                      objectFit: "cover",
                    }}
                    width="24"
                  />
                </TableCell>
                <TableCell className="text-center">
                  {data?.provider_uris &&
                    data.provider_uris.map((uri, i) => (
                      <Button
                        className="flex gap-2 items-center justify-center "
                        asChild
                        variant={"ghost"}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a href={uri} target="_blank" rel="noreferrer">
                          Link {i + 1} <ExternalLinkIcon />
                        </a>
                      </Button>
                    ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
