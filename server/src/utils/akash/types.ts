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

export type ProviderSupply = {
  name: string;
  cpu: number;
  gpu: number;
  memory: number;
  storage: number;
};
