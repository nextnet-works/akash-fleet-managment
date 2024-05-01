export type Bid = {
  bid: {
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
    created_at: string;
    resources_offer: Array<{
      resources: {
        id: number;
        cpu: {
          units: {
            val: string;
          };
          attributes: Array<any>;
        };
        memory: {
          quantity: {
            val: string;
          };
          attributes: Array<any>;
        };
        storage: Array<{
          name: string;
          quantity: {
            val: string;
          };
          attributes: Array<any>;
        }>;
        gpu: {
          units: {
            val: string;
          };
          attributes: Array<any>;
        };
        endpoints: Array<{
          kind: string;
          sequence_number: number;
        }>;
      };
      count: number;
    }>;
  };
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
  interface: string;
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
