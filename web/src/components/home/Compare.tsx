import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useSdl } from "@/hooks/queries/useSdl";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/consts";
import { db } from "@/lib/supabase";
import { Lease_State } from "@akashnetwork/akash-api/akash/market/v1beta4";
import { useCoinPrice } from "@/hooks/useCoinPrice";
import { Loader } from "../Loader";
import { Button } from "../ui/button";

export function Compare() {
  const sdls = useSdl();
  const { data: nodes, isPending } = useQuery({
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

      return data;
    },
  });

  const coinPrice = useCoinPrice();

  // filter nodes with 0 active nodes
  const filteredSdl = sdls?.filter((app) => {
    return nodes?.some((node) => node.sdl_id === app.id);
  });

  if (isPending) return <Loader />;

  if (!nodes) return null;

  const totalGCP = filteredSdl?.reduce((acc, app) => {
    return (
      acc + app.gcp * nodes?.filter((node) => node.sdl_id === app.id).length
    );
  }, 0);
  const totalAWS = filteredSdl?.reduce((acc, app) => {
    return (
      acc + app.aws * nodes?.filter((node) => node.sdl_id === app.id).length
    );
  }, 0);

  const totalDigitalOcean = filteredSdl?.reduce((acc, app) => {
    return (
      acc +
      app["vasi.ai"] * nodes?.filter((node) => node.sdl_id === app.id).length
    );
  }, 0);

  const totalOurPlatform = filteredSdl?.reduce((acc, app) => {
    const ourNodes = nodes?.filter((node) => node.sdl_id === app.id);
    const averagePrice =
      ourNodes.reduce((acc, node) => {
        return acc + (node.price_per_block * 10 * 60 * coinPrice) / 1000000;
      }, 0) / ourNodes.length;
    return (
      acc +
      averagePrice * nodes?.filter((node) => node.sdl_id === app.id).length
    );
  }, 0);

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Price Comparison</Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-lg mx-auto flex flex-col gap-4">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Pricing Per Hour
          </h1>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TShirt Name</TableHead>
                <TableHead className="text-center">GCP</TableHead>
                <TableHead className="text-center">AWS</TableHead>
                <TableHead className="text-center">Vasi.ai</TableHead>
                <TableHead className="p-2">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-md text-center p-2">
                    Current
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSdl?.map((app) => {
                return (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      {app.name}{" "}
                      <span className="text-gray-500 dark:text-gray-400 font-normal">
                        (
                        {nodes?.filter((node) => node.sdl_id === app.id).length}
                        )
                      </span>
                    </TableCell>
                    <TableCell className="text-center">${app.gcp}</TableCell>
                    <TableCell className="text-center">${app.aws}</TableCell>
                    <TableCell className="text-center">
                      ${app["vasi.ai"]}
                    </TableCell>
                    <TableCell className="bg-gray-100 dark:bg-gray-800 rounded-md">
                      <div className="text-center p-2">
                        {(
                          nodes
                            ?.filter((node) => node.sdl_id === app.id)
                            .reduce((acc, node) => {
                              return (
                                acc +
                                (node.price_per_block * 10 * 60 * coinPrice) /
                                  1000000
                              );
                            }, 0) /
                          nodes?.filter((node) => node.sdl_id === app.id).length
                        ).toFixed(2)}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell className="font-medium">
                  Total: {nodes?.length}
                </TableCell>
                <TableCell className="font-medium text-center">
                  ${totalGCP}
                </TableCell>
                <TableCell className="font-medium text-center">
                  ${totalAWS}
                </TableCell>
                <TableCell className="font-medium text-center">
                  ${totalDigitalOcean}
                </TableCell>
                <TableCell className="p-2">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-md text-center p-2">
                    {" "}
                    ${totalOurPlatform ?? 0}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
