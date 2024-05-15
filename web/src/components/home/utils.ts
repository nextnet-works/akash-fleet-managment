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

export const addRanking = (nodes: Tables<"nodes">[]) => {
  const clonedNodes = structuredClone(nodes);
  const sortedNodes = clonedNodes.sort(
    (a, b) => a.price_per_block - b.price_per_block
  );
  return nodes.map((node) => {
    const rank = sortedNodes.findIndex((n) => n.id === node.id);
    return {
      ...node,
      rank: rank + 1,
    };
  });
};

export const getRankingColor = (rank: number, totalLength: number) => {
  if (rank / totalLength <= 1 / 3) {
    return "text-green-600 dark:text-green-400";
  }
  if (rank / totalLength <= 2 / 3) {
    return "text-yellow-600 dark:text-yellow-400";
  }
  return "text-red-600 dark:text-red-400";
};
