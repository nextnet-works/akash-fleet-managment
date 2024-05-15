import { Link, createFileRoute } from "@tanstack/react-router";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenuTrigger,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuItem,
//   DropdownMenuContent,
//   DropdownMenu,
// } from "@/components/ui/dropdown-menu";
// import { ChevronDownIcon } from "lucide-react";
import { Loader } from "@/components/Loader";
import { ErrorUI } from "@/components/Error";
import { queryKeys } from "@/lib/consts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import { Lease_State } from "@akashnetwork/akash-api/akash/market/v1beta4";
import { convertToReadableTime, getLeaseActiveTime } from "@/lib/utils";
import { useLatestBlock } from "@/hooks/useLatestBlock";
import { useEffect } from "react";
import { Dashboard } from "@/components/home/Dashboard";
import axios from "axios";
import { ProviderResources } from "@/types/akash";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/")({
  component: Home,
  loader: Loader,
  errorComponent: ErrorUI,
});

const green =
  "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
const yellow =
  "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400";
const red = "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400";

// const greenText = "text-green-600 dark:text-green-400";
// const yellowText = "text-yellow-600 dark:text-yellow-400";
// const redText = "text-red-600 dark:text-red-400";
function Home() {
  const queryClient = useQueryClient();
  const {
    data: nodes,
    error,
    isPending,
  } = useQuery({
    queryKey: [queryKeys.dashboard],
    queryFn: async () => {
      const { data, error } = await db
        .from("nodes")
        .select("*")
        .eq("state", Lease_State.active)
        .order("dseq", { ascending: false });
      if (error) {
        throw error;
      }
      return data;
    },
  });

  const { mutateAsync: handleCreateDeployment, isPending: isCreating } =
    useMutation({
      mutationFn: async () => {
        const response = await axios.post<ProviderResources[]>(
          `${import.meta.env.VITE_NODE_SERVER_API}/deploy/create`,
          {
            body: {
              deployment: "MORPHEUS",
            },
          }
        );
        return response.data;
      },
    });

  const currentBlock = useLatestBlock();

  useEffect(() => {
    db.channel("new")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "nodes" },
        () => queryClient.invalidateQueries({ queryKey: [queryKeys.dashboard] })
      )
      .subscribe();
  }, []);
  if (isPending) return <Loader />;
  if (error) return <ErrorUI message={error.message} />;
  return (
    <div className="flex flex-col gap-4">
      <Dashboard />
      {/* <div className="mt-4 flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Filter by
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>dseq</DropdownMenuItem>
            <DropdownMenuItem>gseq</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}
      <Button onClick={() => handleCreateDeployment()}>
        {isCreating ? "Loading" : "Create Deployment"}
      </Button>
      {nodes.length > 0 ? (
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
                  <TableHead className="text-center">
                    Active Time (Hour)
                  </TableHead>
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
                    <TableCell className="text-center">
                      {data.bid_id.slice(0, 10)}
                    </TableCell>
                    <TableCell className="text-center">
                      ${data.price_per_block.toFixed(2)}
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
                        getLeaseActiveTime(data.lease_first_block, currentBlock)
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      3/10
                      {/* <span
                      className={
                        data.ranking > 5
                          ? greenText
                          : data.ranking > 3
                            ? yellowText
                            : redText
                      }
                    >
                      {data.ranking}/10
                    </span> */}
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
                      {data.provider_uris.map((uri) => (
                        <Link
                          className="text-primary hover:underline"
                          href={uri}
                          target="_blank"
                        >
                          {" "}
                        </Link>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-96">
          <p className="text-2xl font-medium">No active nodes found</p>
        </div>
      )}
    </div>
  );
}
