import { Lease_State } from "@akashnetwork/akash-api/akash/market/v1beta4";
import { Tables } from "@/types/supabase.gen";
import { BLOCK_TIME_MS } from "@/lib/consts";
import {
  convertToReadableTime,
  getLeaseActiveTimeInMinutes,
} from "@/lib/utils";

export const getAllBlockPrice = (nodes: Tables<"nodes">[]) => {
  const activeNodes = nodes.filter((node) => node.state === Lease_State.active);
  const sumPrices = activeNodes.reduce((acc, node) => {
    return acc + node.price_per_block;
  }, 0);
  return sumPrices;
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
  secondsPassed: number
) => {
  const totalNodes = nodes.length;
  const secondsToAdd = secondsPassed * totalNodes;
  const totalDurationInMinutes = nodes.reduce((acc, node) => {
    return (
      acc + getLeaseActiveTimeInMinutes(node.lease_first_block, currentBlock)
    );
  }, 0);

  console.log(totalDurationInMinutes);

  const totalDuration = convertToReadableTime(
    (totalDurationInMinutes + secondsToAdd / 60) * 60 * 1000
  );
  const sumPrice = getAllBlockPrice(nodes);
  const spendPerMinute = sumPrice * 10;

  const remainingTimeMS = (spendPerMinute - secondsToAdd / 60) * 60 * 1000;
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
      description:
        "Total duration of all leases combined based on current filters",
      value: totalDuration,
    },
    {
      title: "Remaining Duration~",
      description:
        "Remaining duration before out of funds based on current filters",
      value: remainingTime,
    },
  ];
};

export const getRightBlock = (
  nodes: Tables<"nodes">[],
  remainingBalance: number,
  currentBlock: number,
  coinPrice: number
) => {
  const spending =
    (nodes.reduce((acc, node) => {
      if (node.lease_first_block && node.lease_last_block) {
        return (
          acc +
          node.price_per_block *
            (node.lease_last_block - node.lease_first_block)
        );
      }
      if (!node.lease_first_block) return acc;
      return (
        acc + node.price_per_block * (currentBlock - node.lease_first_block)
      );
    }, 0) /
      1000000) *
    coinPrice;

  const totalBalance = remainingBalance + spending;

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
      value: spending.toFixed(2),
    },
    {
      title: "Spending per Hour",
      description: "Spending per hour based on current leases",
      value: getPricePerHour(getAllBlockPrice(nodes), coinPrice).toFixed(2),
    },
  ];
};

export const getPricePerHour = (
  pricePerBlockInUAKT: number,
  coinPrice: number
) => {
  const pricePerBlockInAKT = pricePerBlockInUAKT / 1000000;
  const pricePerHour = pricePerBlockInAKT * 10 * 60;
  return pricePerHour * coinPrice;
};
