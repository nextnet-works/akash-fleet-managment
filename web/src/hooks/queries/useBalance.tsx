import { MAIN_NET, queryKeys } from "@/lib/consts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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

export const useBalance = (key: string | null) => {
  const { data: totalBalance } = useQuery({
    queryKey: [queryKeys.total_balance, key],
    queryFn: async () => {
      if (!key) return 0;
      const response = await axios.get<WalletsFunds>(
        `${MAIN_NET}/cosmos/bank/v1beta1/balances/${key}`
      );
      const akashBalance = response.data.balances.find(
        (balance) => balance.denom === "uakt"
      );
      return Number(akashBalance?.amount);
    },
    enabled: !!key,
  });

  return totalBalance ?? 0;
};
