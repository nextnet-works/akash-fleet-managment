import { createFileRoute } from "@tanstack/react-router";

import { Loader } from "@/components/Loader";
import { ErrorUI } from "@/components/Error";
import { queryKeys } from "@/lib/consts";
import { useQuery } from "@tanstack/react-query";
import { useLatestBlock } from "@/hooks/useLatestBlock";
import { Dashboard } from "@/components/home/Dashboard";

import { DashboardTable } from "@/components/home/Table";
import { Deployments } from "@/components/home/Deployments";
import axios from "axios";

import { LeaseResponse } from "@/types/akash";
import { useEffect } from "react";
import { getKeplrFromWindow } from "@/lib/kepler/widowKey";
import { OsmosisChainInfo } from "@/lib/kepler/consts";
import { useStore } from "@/store";
export const Route = createFileRoute("/")({
  component: Home,
  loader: Loader,
  errorComponent: ErrorUI,
});

function Home() {
  const akashKey = useStore((state) => state.akashKey);
  const {
    data: leases,
    error,
    isPending,
  } = useQuery({
    queryKey: [queryKeys.dashboard],
    queryFn: async () => {
      const res = await axios.get(
        "https://akash-api.polkachu.com/akash/market/v1beta4/leases/list",
        {
          params: {
            "filters.owner": akashKey,
            "pagination.limit": 200,
            "pagination.count_total": true,
          },
        }
      );

      return res.data.leases as LeaseResponse[];
    },
    enabled: !!akashKey,
  });

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const keplr = await getKeplrFromWindow();

    if (keplr) {
      try {
        await keplr.experimentalSuggestChain(OsmosisChainInfo);
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    }
  };

  // const getKeyFromKeplr = async () => {
  //   const key = await window.keplr?.getKey(OsmosisChainInfo.chainId);
  //   if (key) {
  //     setAddress(key.bech32Address);
  //   }
  // };

  // const getBalance = async () => {
  //   const key = await window.keplr?.getKey(OsmosisChainInfo.chainId);

  //   if (key) {
  //     const uri = `${OsmosisChainInfo.rest}/cosmos/bank/v1beta1/balances/${key.bech32Address}?pagination.limit=1000`;

  //     const res = await axios.get<Balances>(uri);
  //     const balance = res.data.balances.find(
  //       (balance) => balance.denom === "uosmo"
  //     );
  //     const osmoDecimal = OsmosisChainInfo.currencies.find(
  //       (currency) => currency.coinMinimalDenom === "uosmo"
  //     )?.coinDecimals;

  //     if (balance) {
  //       const amount = new Dec(balance.amount, osmoDecimal);
  //       setBalance(`${amount.toString(osmoDecimal)} OSMO`);
  //     } else {
  //       setBalance(`0 OSMO`);
  //     }
  //   }
  // };

  const currentBlock = useLatestBlock();

  if (isPending) return <Loader />;
  if (error) return <ErrorUI message={error.message} />;
  return (
    <div className="flex flex-col gap-4">
      <Deployments />
      {leases.length > 0 ? (
        <>
          <Dashboard />
          <DashboardTable leases={leases} currentBlock={currentBlock} />
        </>
      ) : (
        <div className="flex items-center justify-center h-96">
          <p className="text-2xl font-medium">No active nodes found</p>
        </div>
      )}
    </div>
  );
}
