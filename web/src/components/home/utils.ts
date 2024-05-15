import { Lease_State } from "@akashnetwork/akash-api/akash/market/v1beta4";
import { Tables } from "@/types/supabase.gen";
import { BLOCK_TIME_MS } from "@/lib/consts";
import { convertToReadableTime, getLeaseActiveTime } from "@/lib/utils";

export const getAveragePricePerBlock = (nodes: Tables<"nodes">[]) => {
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

export const getLeftBlock = (
  nodes: Tables<"nodes">[],
  currentBlock: number,
  totalBalance: number,
  secondsPassed: number
) => {
  const totalNodes = nodes.length;
  const secondsToAdd = secondsPassed * 1000 * totalNodes;
  const totalDurationMS = nodes.reduce((acc, node) => {
    return acc + getLeaseActiveTime(node.lease_first_block, currentBlock);
  }, 0);
  const totalDuration = convertToReadableTime(totalDurationMS + secondsToAdd);
  const avgPrice = getAveragePricePerBlock(nodes);
  const remainingTimeMS =
    timeRemainingInMs(totalBalance, avgPrice) - secondsToAdd;
  const remainingTime = convertToReadableTime(
    remainingTimeMS > 0 ? remainingTimeMS : 0
  );

  return [
    {
      title: "Total Nodes",
      description: "Total number of nodes based on current filters",
      value: totalNodes.toString(),
    },
    {
      title: "Total Duration",
      description: "Total duration of all leases based on current filters",
      value: totalDuration,
    },
    {
      title: "Remaining Duration",
      description:
        "Remaining duration before out of funds based on current filters",
      value: remainingTime,
    },
  ];
};

export const getRightBlock = (
  nodes: Tables<"nodes">[],
  remainingBalance: number,
  _: number
) => {
  const closedNodes = nodes.filter((node) => node.state === Lease_State.closed);
  // const activeNodes = nodes.filter((node) => node.state === Lease_State.active);
  // const currentSpending = activeNodes.reduce((acc, node) => {
  //   if (!node.lease_first_block) return acc;
  //   return (
  //     acc +
  //     node.price_per_block *
  //       getLeaseActiveTime(node.lease_first_block, currentBlock)
  //   );
  // }, 0);
  const totalSpending = closedNodes.reduce((acc, node) => {
    if (!node.lease_first_block || !node.lease_last_block) return acc;
    return (
      acc +
      node.price_per_block *
        getLeaseActiveTime(node.lease_first_block, node.lease_last_block)
    );
    // }, 0) + currentSpending;
  }, 0);
  const totalBalance = remainingBalance + totalSpending;

  return [
    {
      title: "Total Balance",
      description:
        "Total balance (wallet + all escrow accounts + amount spent on leases)",
      value: totalBalance.toFixed(2),
    },
    {
      title: "Remaining Balance",
      description: "Remaining balance (wallet + all escrow accounts)",
      value: remainingBalance.toFixed(2),
    },
    {
      title: "Total Spending",
      description: "Total spending on leases",
      value: totalSpending.toFixed(2),
    },
  ];
};
