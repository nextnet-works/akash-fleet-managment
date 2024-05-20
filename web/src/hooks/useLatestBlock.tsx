import { MAIN_NET, queryKeys } from "@/lib/consts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useLatestBlock = () => {
  const { data } = useQuery({
    queryKey: [queryKeys.last_block],
    refetchInterval: 5000,
    queryFn: async () => {
      try {
        const { data } = await axios.get<BlockData>(
          `${MAIN_NET}/cosmos/base/tendermint/v1beta1/blocks/latest`
        );
        const currentHeight = Number(data.block.header.height);
        return currentHeight;
      } catch (error) {
        console.error("Error fetching Akash Coin price:", error);
        return null;
      }
    },
  });
  return data ?? 0;
};

type BlockId = {
  hash: string;
  part_set_header: {
    total: number;
    hash: string;
  };
};

type Version = {
  block: string;
  app: string;
};

type LastBlockId = {
  hash: string;
  part_set_header: {
    total: number;
    hash: string;
  };
};

type Header = {
  version: Version;
  chain_id: string;
  height: string;
  time: string;
  last_block_id: LastBlockId;
  last_commit_hash: string;
  data_hash: string;
  validators_hash: string;
  next_validators_hash: string;
  consensus_hash: string;
  app_hash: string;
  last_results_hash: string;
  evidence_hash: string;
  proposer_address: string;
};

type Data = {
  txs: string[];
};

type Evidence = {
  evidence: unknown[];
};

type Signature = {
  block_id_flag: string;
  validator_address: string;
  timestamp: string;
  signature: string;
};

type LastCommit = {
  height: string;
  round: number;
  block_id: BlockId;
  signatures: Signature[];
};

type Block = {
  header: Header;
  data: Data;
  evidence: Evidence;
  last_commit: LastCommit;
};

type BlockData = {
  block_id: BlockId;
  block: Block;
};
