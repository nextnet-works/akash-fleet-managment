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
  