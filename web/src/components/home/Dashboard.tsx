import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTooltip } from "../InfoTooltip";
import { Tables } from "@/types/supabase.gen";
import { useLatestBlock } from "@/hooks/useLatestBlock";
import { convertToReadableTime, getLeaseActiveTime } from "@/lib/utils";
import { MAIN_NET, queryKeys } from "@/lib/consts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getAveragePricePerBlock, timeRemainingInMs } from "./utils";
import { db } from "@/lib/supabase";
import { Lease_State } from "@akashnetwork/akash-api/akash/market/v1beta4";

import { Loader } from "../Loader";
import { ErrorUI } from "../Error";
import { useEffect, useState } from "react";
import { useCoinPrice } from "@/hooks/useCoinPrice";

const getLeftBlock = (
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

const getRightBlock = (
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

type Balance = {
  denom: string;
  amount: string;
};

type Pagination = {
  next_key: string | null;
  total: string;
};

type WalletsFunds = {
  balances: Balance[];
  pagination: Pagination;
};

const key = "akash1yddk6apmrtkcfzn85h5arnz7dfel8qxdyc02xa";

export const Dashboard = () => {
  const currentBlock = useLatestBlock();
  const [secondsPassed, setSecondsPassed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsPassed(secondsPassed + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsPassed]);

  const {
    data: nodes,
    error,
    isPending,
  } = useQuery({
    queryKey: [queryKeys.dashboard, "info"],
    queryFn: async () => {
      const { data, error } = await db
        .from("nodes")
        .select("*")
        .order("dseq", { ascending: false });
      if (error) {
        throw error;
      }
      return data.filter(
        (node) => node?.provider_uris && node?.provider_uris?.length > 0
      );
    },
  });

  const { data: totalBalance } = useQuery({
    queryKey: [queryKeys.total_balance, key],
    queryFn: async () => {
      const response = await axios.get<WalletsFunds>(
        `${MAIN_NET}/cosmos/bank/v1beta1/balances/${key}`
      );
      const akashBalance = response.data.balances.find(
        (balance) => balance.denom === "uakt"
      );
      return Number(akashBalance?.amount);
    },
  });
  const coinPrice = useCoinPrice();
  const totalInUSD = totalBalance ? (totalBalance * coinPrice) / 1000000 : 0;

  if (isPending) return <Loader />;

  if (error) return <ErrorUI message={error.message} />;

  const activeNodes = nodes.filter((node) => node.state === Lease_State.active);
  const leftBlock = getLeftBlock(
    activeNodes,
    currentBlock,
    totalBalance ?? 0,
    secondsPassed
  );
  const rightBlock = getRightBlock(nodes, totalInUSD, currentBlock);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            {leftBlock.map((item) => (
              <div key={item.title} className="mb-4">
                <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                  <InfoTooltip info={item.description} />{" "}
                  <span className="min-w-[150px]">{item.title}: </span>
                  <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 min-w-[100px] text-end">
                    {item.value}
                  </span>
                </h3>
              </div>
            ))}
          </div>
          <div>
            {rightBlock.map((item) => (
              <div key={item.title} className="mb-4">
                <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                  <InfoTooltip info={item.description} />{" "}
                  <span className="min-w-[150px]">{item.title}: </span>
                  <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 min-w-[100px] text-end">
                    ${item.value}
                  </span>
                </h3>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
