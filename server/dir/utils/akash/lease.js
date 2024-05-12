"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryLeaseStatus = exports.createLease = void 0;
const https_1 = __importDefault(require("https"));
const v1beta4_1 = require("@akashnetwork/akash-api/akash/market/v1beta4");
const rpc_1 = require("@akashnetwork/akashjs/build/rpc");
const client_1 = require("./client");
const consts_1 = require("./consts");
const v1beta3_1 = require("@akashnetwork/akash-api/akash/provider/v1beta3");
const manifest_1 = require("./manifest");
const axios_1 = __importDefault(require("axios"));
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
    await client.signAndBroadcast(accounts[0].address, leasesMessage, fee, "create lease");
    const succefullLeases = await Promise.all(bids.map(async (bid) => {
        if (!bid?.bidId) {
            return { bidId: undefined };
        }
        const isSuccess = await (0, manifest_1.sendManifest)(bid?.bidId);
        if (!isSuccess) {
            return { bidId: undefined };
        }
        return { bidId: bid?.bidId };
    }));
    return succefullLeases;
}
exports.createLease = createLease;
async function queryLeaseStatus(bidId) {
    if (!bidId) {
        throw new Error("Bid ID is required");
    }
    // Load required certificates
    const { certificate } = await (0, client_1.loadPrerequisites)();
    // Build the path and set up the custom HTTPS agent
    const leasePath = `/lease/${bidId.dseq}/${bidId.gseq}/${bidId.oseq}/status`;
    const agent = new https_1.default.Agent({
        cert: certificate.csr,
        key: certificate.privateKey,
        rejectUnauthorized: false,
    });
    // Retrieve provider information
    const request = v1beta3_1.QueryProviderRequest.fromPartial({
        owner: bidId.provider,
    });
    const client = new v1beta3_1.QueryClientImpl(await (0, rpc_1.getRpc)(consts_1.RPC_ENDPOINT));
    const tx = await client.Provider(request);
    if (!tx.provider) {
        throw new Error(`Could not find provider ${bidId.provider}`);
    }
    const providerInfo = tx.provider;
    const uri = new URL(providerInfo.hostUri);
    try {
        const response = await axios_1.default.get(`${uri.origin}${leasePath}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            httpsAgent: agent,
        });
        return response.data;
    }
    catch (error) {
        throw new Error(`Could not query lease status: ${error.message}`);
    }
}
exports.queryLeaseStatus = queryLeaseStatus;
//# sourceMappingURL=lease.js.map