import { DEPLOYMENT_RESOURCES } from "./consts";

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
