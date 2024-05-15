"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryLeaseStatus = exports.saveLeasesToDB = exports.createLease = void 0;
const v1beta4_1 = require("@akashnetwork/akash-api/akash/market/v1beta4");
const rpc_1 = require("@akashnetwork/akashjs/build/rpc");
const client_1 = require("./client");
const consts_1 = require("./consts");
const manifest_1 = require("./manifest");
const supabase_js_1 = require("@supabase/supabase-js");
async function createLease(bids) {
    const { wallet, client } = await (0, client_1.loadPrerequisites)();
    const accounts = await wallet.getAccounts();
    const leasesMessage = bids.map((bid) => {
        return {
            typeUrl: `/${v1beta4_1.MsgCreateLease.$type}`,
            value: v1beta4_1.MsgCreateLease.fromPartial({ bidId: bid?.bidId }),
        };
    });
    const fee = {
        amount: [
            {
                denom: "uakt",
                amount: "50000",
            },
        ],
        gas: "2000000",
    };
    const tx = await client.signAndBroadcast(accounts[0].address, leasesMessage, fee, "create lease");
    console.log({ tx: JSON.stringify(tx), name: "create lease" });
    const successfulLeases = await Promise.all(bids.map(async (bid) => {
        if (!bid?.bidId) {
            return { bidId: undefined, serviceUris: [], uri: "" };
        }
        const { isSuccess, serviceUris, uri, lease } = await (0, manifest_1.sendManifest)(bid?.bidId);
        return {
            bidId: !isSuccess ? undefined : bid?.bidId,
            serviceUris,
            uri: uri?.toString() ?? "",
            lease,
        };
    }));
    return successfulLeases;
}
exports.createLease = createLease;
// export async function queryLeaseStatus(
//   bidId: BidID | undefined
// ): Promise<LeaseStatusResponse> {
//   if (!bidId) {
//     throw new Error("Bid ID is required");
//   }
//   // Load required certificates
//   const { certificate } = await loadPrerequisites();
//   // Build the path and set up the custom HTTPS agent
//   const leasePath = `/lease/${bidId.dseq}/${bidId.gseq}/${bidId.oseq}/status`;
//   const agent = new https.Agent({
//     cert: certificate.csr,
//     key: certificate.privateKey,
//     rejectUnauthorized: false,
//   });
//   // Retrieve provider information
//   const request = QueryProviderRequest.fromPartial({
//     owner: bidId.provider,
//   });
//   const client = new QueryProviderClient(await getRpc(RPC_ENDPOINT));
//   const tx = await client.Provider(request);
//   if (!tx.provider) {
//     throw new Error(`Could not find provider ${bidId.provider}`);
//   }
//   console.log({ tx: JSON.stringify(tx), name: "getLeaseProvider" });
//   const providerInfo = tx.provider;
//   const uri = new URL(providerInfo.hostUri);
//   try {
//     const response = await axios.get<LeaseStatusResponse>(
//       `${uri.origin}${leasePath}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         httpsAgent: agent,
//       }
//     );
//     console.log(`Lease status: ${JSON.stringify(response.data)}`);
//     return response.data;
//   } catch (error: any) {
//     throw new Error(`Could not query lease status: ${error.message}`);
//   }
// }
async function saveLeasesToDB(nodes) {
    try {
        const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_PROJECT_URL, process.env.SERVICE_ROLE_KEY);
        const { error } = await supabase.from("nodes").insert(nodes);
        if (error) {
            throw error;
        }
    }
    catch (error) {
        console.error("Error saving leases to database:", error);
        throw error;
    }
}
exports.saveLeasesToDB = saveLeasesToDB;
async function queryLeaseStatus(leasId) {
    const client = new v1beta4_1.QueryClientImpl(await (0, rpc_1.getRpc)(consts_1.RPC_ENDPOINT));
    const getLeaseStatusRequest = v1beta4_1.QueryLeaseRequest.fromPartial({ id: leasId });
    const leaseStatusResponse = await client.Lease(getLeaseStatusRequest);
    console.log(v1beta4_1.QueryLeaseResponse.toJSON(leaseStatusResponse));
    return leaseStatusResponse;
}
exports.queryLeaseStatus = queryLeaseStatus;
//# sourceMappingURL=lease.js.map