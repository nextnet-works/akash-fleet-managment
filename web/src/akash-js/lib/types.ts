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

export type ProviderSupply = {
  name: string;
  cpu: number;
  gpu: number;
  memory: number;
  storage: number;
};
