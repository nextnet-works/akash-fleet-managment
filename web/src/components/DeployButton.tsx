import axios from "axios";

import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { NODE_SERVER_API, queryKeys } from "@/lib/consts";

type Props = {
  bidId: string;
};

export const DeployButton = ({ bidId }: Props) => {
  const {
    isPending,
    error,
    mutateAsync: handleBid,
  } = useMutation({
    mutationKey: [queryKeys.approve_bid],
    mutationFn: async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const response = await axios.post(`${NODE_SERVER_API}/deploy/accept`, {
        body: { bidId },
      });
      return response.data;
    },
  });

  const buttonText = isPending ? "Loading..." : "Accept Bid ";

  if (error) return <div>Error</div>;

  return (
    <Button disabled={isPending} onClick={handleBid} variant={"secondary"}>
      {buttonText}
    </Button>
  );
};
