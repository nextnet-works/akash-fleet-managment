import { DEPLOYMENT_RESOURCES } from "./consts";
import { Bid as AkashBidType } from "@akashnetwork/akash-api/akash/market/v1beta3";

export type Deployment = {
  id: {
    owner: string;
    dseq: number;
  };
};

export type Lease = {
  id: {
    owner: string;
    dseq: number;
    provider: string;
    gseq: number;
    oseq: number;
  };
};

export type Certificate = {
  csr: string;
  privateKey: string;
  publicKey: string;
};

export type DeploymentResources = keyof typeof DEPLOYMENT_RESOURCES;

export type Bid = AkashBidType & {
  escrow_account: {
    id: {
      scope: string;
      xid: string;
    };
    owner: string;
    state: string;
    balance: {
      denom: string;
      amount: string;
    };
    transferred: {
      denom: string;
      amount: string;
    };
    settled_at: string;
    depositor: string;
    funds: {
      denom: string;
      amount: string;
    };
  };
};

export type ProviderSupply = {
  name: string;
  cpu: number;
  gpu: number;
  memory: number;
  storage: number;
};
