import { Lease_State } from "@akashnetwork/akash-api/akash/market/v1beta4";
import {
  convertToReadableTime,
  getLeaseActiveTimeInMinutes,
} from "@/lib/utils";
import { LeaseResponse } from "@/types/akash";

export const getAllBlockPrice = (leases: LeaseResponse[]) => {
  const activeLeases = leases.filter(
    (lease) => lease.lease.state === Lease_State.active.toString()
  );
  const sumPrices = activeLeases.reduce((acc, node) => {
    return acc + Number(node.lease.price.amount);
  }, 0);
  return sumPrices;
};

export const addRanking = (leases: LeaseResponse[]) => {
  const clonedNodes = structuredClone(leases);
  const sortedNodes = clonedNodes.sort(
    (a, b) => Number(a.lease.price) - Number(b.lease.price)
  );
  return leases.map((lease) => {
    const rank = sortedNodes.findIndex(
      (n) =>
        n.lease.lease_id.dseq + n.lease.lease_id.gseq ===
        lease.lease.lease_id.dseq + lease.lease.lease_id.gseq
    );
    return {
      ...lease,
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
  leases: LeaseResponse[],
  currentBlock: number,
  secondsPassed: number
) => {
  const totalNodes = leases.length;
  const secondsToAdd = secondsPassed * totalNodes;
  const totalDurationInMinutes = leases.reduce((acc, lease) => {
    return (
      acc + getLeaseActiveTimeInMinutes(Number(lease.lease.price), currentBlock)
    );
  }, 0);

  console.log(totalDurationInMinutes);

  const totalDuration = convertToReadableTime(
    (totalDurationInMinutes + secondsToAdd / 60) * 60 * 1000
  );
  const sumPrice = getAllBlockPrice(leases);
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
  leases: LeaseResponse[],
  remainingBalance: number,
  currentBlock: number,
  coinPrice: number
) => {
  const spending =
    (leases.reduce((acc, node) => {
      if (node.lease.created_at && node.lease.closed_on) {
        return (
          acc +
          Number(node.lease.price) *
            (Number(node.lease.closed_on) - Number(node.lease.created_at))
        );
      }
      if (!node.lease.created_at) return acc;
      return (
        acc +
        Number(node.lease.price) *
          (currentBlock - Number(node.lease.created_at))
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
      value: getPricePerHour(getAllBlockPrice(leases), coinPrice).toFixed(2),
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
