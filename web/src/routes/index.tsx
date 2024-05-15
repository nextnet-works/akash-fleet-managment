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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "@/components/Loader";
import { ErrorUI } from "@/components/Error";
import { queryKeys } from "@/lib/consts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import { Lease_State } from "@akashnetwork/akash-api/akash/market/v1beta4";
import { convertToReadableTime, getLeaseActiveTime } from "@/lib/utils";
import { useLatestBlock } from "@/hooks/useLatestBlock";
import { useEffect, useState } from "react";
import { Dashboard } from "@/components/home/Dashboard";
import axios from "axios";
import { ProviderResources } from "@/types/akash";
import { Button } from "@/components/ui/button";
import { addRanking, getRankingColor } from "@/components/home/utils";
import { ExternalLinkIcon } from "lucide-react";
import { Tables } from "@/types/supabase.gen";
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

function Home() {
  const [sdlID, setSdlID] = useState<string>("");
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
        .select("*, sdl(*)")
        .eq("state", Lease_State.active)
        .order("dseq", { ascending: false });
      if (error) {
        throw error;
      }
      const filteredNodes = data.filter(
        (node) => node?.provider_uris && node?.provider_uris?.length > 0
      );
      return addRanking(filteredNodes) as unknown as (Tables<"nodes"> & {
        sdl: Tables<"sdl">;
        rank: number;
      })[];
    },
  });

  const { data: sdls } = useQuery({
    queryKey: [queryKeys.sdl],
    queryFn: async () => {
      const { data, error } = await db.from("sdl").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { mutateAsync: handleCreateDeployment, isPending: isCreating } =
    useMutation({
      mutationFn: async (sdlID: string) => {
        const response = await axios.post<ProviderResources[]>(
          `${import.meta.env.VITE_NODE_SERVER_API}/deploy/create`,
          {
            body: {
              deployment: sdlID,
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
      <div className="flex items-center justify-between gap-4">
        <Select onValueChange={(value) => setSdlID(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select TShirt" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="0">Select TShirt</SelectItem>
              {sdls?.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>{" "}
        <Button asChild variant={"outline"}>
          <Link to="/yaml">Edit New</Link>
        </Button>
        <Button onClick={() => handleCreateDeployment(sdlID)}>
          {isCreating ? "Loading" : "Start Deployment"}
        </Button>
      </div>{" "}
      <Dashboard />
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
                      {data.sdl.name}
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
                      <span
                        className={getRankingColor(data.rank, nodes.length)}
                      >
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
      ) : (
        <div className="flex items-center justify-center h-96">
          <p className="text-2xl font-medium">No active nodes found</p>
        </div>
      )}
    </div>
  );
}
