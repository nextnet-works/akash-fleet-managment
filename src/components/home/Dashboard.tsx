import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTooltip } from "../InfoTooltip";
import { useLatestBlock } from "@/hooks/queries/useLatestBlock";

import { Loader } from "../Loader";
import { ErrorUI } from "../Error";
import { useCoinPrice } from "@/hooks/useCoinPrice";
import { getLeftBlock, getRightBlock } from "./utils";
import { useBalance } from "@/hooks/queries/useBalance";
import { useDashboardSummary } from "@/hooks/queries/useDashboardSummary";
import { useTimer } from "@/hooks/useTimer";
import { useStore } from "@/store";

export const Dashboard = () => {
  const currentBlock = useLatestBlock();
  const akashKey = useStore((state) => state.akashKey);
  const totalBalance = useBalance(akashKey);
  const { leases, error, isPending } = useDashboardSummary();

  const coinPrice = useCoinPrice();
  const secondsPassed = useTimer();
  const totalInUSD = totalBalance ? (totalBalance * coinPrice) / 1000000 : 0;

  if (isPending) return <Loader />;

  if (error || !leases) return <ErrorUI message={error?.message} />;

  const activeNodes = leases.filter((node) => node.lease.state === "active");

  const leftBlock = getLeftBlock(activeNodes, currentBlock, secondsPassed);
  const rightBlock = getRightBlock(leases, totalInUSD, currentBlock, coinPrice);

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
