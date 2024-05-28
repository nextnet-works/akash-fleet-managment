type Stats = {
  cpu: number;
  gpu: number;
  memory: number;
  storage: number;
};

type Attribute = {
  key: string;
  value: string;
  auditedBy: string[];
};

type GPUModel = {
  type: string;
  model: string;
  ram: string;
  vendor: string;
};

export type Provider = {
  owner: string;
  price: number;
  name: string;
  uptime1d: number;
  uptime7d: number;
  uptime30d: number;
  createdHeight: number;
  deploymentCount: number;
  leaseCount: number;
  activeStats: Stats;
  pendingStats: Stats;
  availableStats: Stats;
  gpuModels: GPUModel[];
  isAudited: boolean;
  attributes: Attribute[];
  hardwareCpu: string[];
  hardwareCpuArch: string[];
  hardwareGpuVendor: string[];
  hardwareGpuModels: string[];
  hardwareDisk: string[];
  featPersistentStorage: boolean;
  featPersistentStorageType: string[];
  hardwareMemory: string[];
  tier: string[];
  featEndpointIp: boolean;
};

export type ProviderResources = {
  cpu: number;
  gpu: number;
  memory: number;
  storage: number;
  price: number;
  provider: string;
};

type LeaseId = {
  owner: string;
  dseq: string;
  gseq: number;
  oseq: number;
  provider: string;
};

type Price = {
  denom: string;
  amount: string;
};

type Lease = {
  lease_id: LeaseId;
  state: string;
  price: Price;
  created_at: string;
  closed_on: string;
};

type AccountId = {
  scope: string;
  xid: string;
};

type EscrowPayment = {
  account_id: AccountId;
  payment_id: string;
  owner: string;
  state: string;
  rate: Price;
  balance: Price;
  withdrawn: {
    denom: string;
    amount: string;
  };
};

export type LeaseResponse = {
  lease: Lease;
  escrow_payment: EscrowPayment;
};

export type BidAPI = {
  bid_id: {
    owner: string;
    dseq: string;
    gseq: number;
    oseq: number;
    provider: string;
  };
  state: string;
  price: {
    denom: string;
    amount: string;
  };
};
