interface DeploymentId {
  owner: string;
  dseq: string;
}

interface ResourceQuantity {
  val: string;
}

interface Resource {
  id: number;
  cpu: {
    units: ResourceQuantity;
    attributes: unknown[];
  };
  memory: {
    quantity: ResourceQuantity;
    attributes: unknown[];
  };
  storage: {
    name: string;
    quantity: ResourceQuantity;
    attributes: unknown[];
  }[];
  gpu: {
    units: ResourceQuantity;
    attributes: unknown[];
  };
  endpoints: {
    kind: string;
    sequence_number: number;
  }[];
}

interface GroupSpec {
  name: string;
  requirements: {
    signed_by: {
      all_of: string[];
      any_of: string[];
    };
    attributes: unknown[];
  };
  resources: {
    resource: Resource;
    count: number;
    price: {
      denom: string;
      amount: string;
    };
  }[];
}

interface GroupId {
  owner: string;
  dseq: string;
  gseq: number;
}

interface Group {
  group_id: GroupId;
  state: string;
  group_spec: GroupSpec;
  created_at: string;
}

interface EscrowAccount {
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
}

interface Deployment {
  deployment_id: DeploymentId;
  state: string;
  version: string;
  created_at: string;
}

interface DeploymentData {
  deployment: Deployment;
  groups: Group[];
  escrow_account: EscrowAccount;
}

interface Pagination {
  next_key: string | null;
  total: string;
}

export interface DeploymentsResponse {
  deployments: DeploymentData[];
  pagination: Pagination;
}
