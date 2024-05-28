import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { green, red, yellow } from "@/lib/consts";
import {
  convertToReadableTime,
  getLeaseActiveTimeInMinutes,
} from "@/lib/utils";
import { addRanking, getPricePerHour, getRankingColor } from "./utils";

import { useCoinPrice } from "@/hooks/useCoinPrice";
import { useTimer } from "@/hooks/useTimer";
import { LeaseResponse } from "@/types/akash";
import { Button } from "../ui/button";
import { closeDeployment } from "@/akash-js/rpc/closeDeployment";
import { useToast } from "../ui/use-toast";

type DashboardTableProps = {
  leases: LeaseResponse[];
  currentBlock: number;
};

export const DashboardTable = ({
  leases,
  currentBlock,
}: DashboardTableProps) => {
  const coinPrice = useCoinPrice();
  const secondsPassed = useTimer();
  const { toast } = useToast();
  const leasesWithRanking = addRanking(leases);
  const handleClose = async (dseq: string) => {
    await closeDeployment(dseq);
    toast({
      title: "Deployment closed",
      description: "Deployment closed successfully",
    });
  };
  return (
    <div className="border rounded-lg w-full max-w-[1400px]">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Service ID</TableHead>
              <TableHead className="text-center">
                Payment per Hour ($)
              </TableHead>{" "}
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Active Time (Hour)</TableHead>
              <TableHead className="text-center">Ranking</TableHead>
              <TableHead className="text-center">Cloud Provider</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leasesWithRanking.map((lease) => (
              <TableRow
                key={
                  lease.lease.lease_id.dseq +
                  lease.lease.lease_id.gseq +
                  lease.lease.lease_id.provider
                }
              >
                <TableCell className="font-medium text-center">
                  {lease.lease.lease_id.dseq.slice(-4)}/
                  {lease.lease.lease_id.gseq}
                </TableCell>
                <TableCell className="text-center">
                  $
                  {getPricePerHour(
                    Number(lease.lease.price.amount),
                    coinPrice
                  ).toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={
                      lease.lease.state === "active"
                        ? green
                        : lease.lease.state !== "closed"
                          ? yellow
                          : red
                    }
                    variant="outline"
                  >
                    {lease.lease.state}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {convertToReadableTime(
                    getLeaseActiveTimeInMinutes(
                      Number(lease.lease.created_at),
                      currentBlock
                    ) +
                      (lease.lease.state === "active"
                        ? (secondsPassed / 60) * 60 * 1000
                        : 0)
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={getRankingColor(
                      lease.rank,
                      leasesWithRanking.length
                    )}
                  >
                    {lease.rank} / {leasesWithRanking.length}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {lease.lease.lease_id.provider}
                </TableCell>

                <TableCell className="text-center">
                  {lease.lease.state === "active" ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () =>
                        await handleClose(lease.lease.lease_id.dseq)
                      }
                    >
                      Close
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        toast({
                          title: "Deployment logs",
                          description: "Deployment logs are not available",
                        });
                      }}
                    >
                      Show Logs
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
