import { Lease_State } from "@akashnetwork/akash-api/akash/market/v1beta4";
import { Tables } from "@/types/supabase.gen";
import { BLOCK_TIME_MS } from "@/lib/consts";

export const getAveragePricePerBlock = (nodes: Tables<"nodes">[]) => {
  // get only active nodes
  const activeNodes = nodes.filter((node) => node.state === Lease_State.active);
  const sumPrices = activeNodes.reduce((acc, node) => {
    return acc + node.price_per_block;
  }, 0);
  return sumPrices / activeNodes.length;
};

export const timeRemainingInMs = (
  totalAccountBalance: number,
  averagePricePerBlock: number
) => {
  return (
    (totalAccountBalance / 1000000 / averagePricePerBlock / BLOCK_TIME_MS) *
    1000 *
    60
  );
};
