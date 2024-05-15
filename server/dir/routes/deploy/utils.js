"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployAllBiddersSDL = exports.deployGenericSDL = exports.handleSdlFlow = void 0;
const yaml_1 = require("./yaml");
const createDeployment_1 = require("../../akash-js/createDeployment");
const bids_1 = require("../../akash-js/bids");
const consts_1 = require("../../akash-js/lib/consts");
const lease_1 = require("../../akash-js/lease");
const v1beta4_1 = require("@akashnetwork/akash-api/akash/market/v1beta4");
const handleSdlFlow = async (deploymentID) => {
    const respondersLength = await (0, exports.deployGenericSDL)();
    const { bids } = await (0, exports.deployAllBiddersSDL)(respondersLength);
    const filteredBids = [];
    const gseqArray = [
        ...new Set(bids.filter((gseq) => gseq).map((bid) => bid?.bid?.bidId?.gseq)),
    ];
    gseqArray.forEach((gseq) => {
        const gseqBids = bids.filter((bid) => bid?.bid?.bidId?.gseq === gseq);
        const sortedBids = gseqBids.sort((a, b) => Number(a?.bid?.price?.amount) - Number(b?.bid?.price?.amount));
        if (!sortedBids[0]?.bid) {
            return;
        }
        filteredBids.push(sortedBids[0].bid);
    });
    //wait 15 seconds for the bids to be processed
    await new Promise((resolve) => setTimeout(resolve, 15000));
    const nodes = await (0, lease_1.createLease)(filteredBids);
    const activeNodes = nodes.filter((lease) => lease.bidId);
    const output = activeNodes.map((lease) => {
        return {
            dseq: lease.bidId.dseq.toNumber(),
            gseq: lease.bidId.gseq,
            akash_provider: lease.bidId.provider,
            wallet_address: lease.bidId.owner,
            json: lease,
            provider_uris: lease.serviceUris ?? [],
            provider_domain: lease.uri,
            ports: lease.ports,
            bid_id: `${lease.bidId.owner}/${lease.bidId.dseq}/${lease.bidId.gseq}/1/${lease.bidId.provider}`,
            price_per_block: lease.lease?.lease?.price?.amount
                ? Number(lease.lease?.lease?.price?.amount)
                : 0,
            state: (lease.lease?.lease?.state ?? v1beta4_1.Lease_State.UNRECOGNIZED),
            lease_first_block: lease.lease?.lease?.createdAt?.toNumber() ?? 0,
            sdl_id: deploymentID,
            resources: {},
        };
    });
    await (0, lease_1.saveLeasesToDB)(output);
    // TODO: add rejected leases to a blacklist of providers
    const leasedRejected = nodes.filter((lease) => !lease.bidId);
    return { activeNodes, leasedRejected };
};
exports.handleSdlFlow = handleSdlFlow;
const deployGenericSDL = async () => {
    const { dseq, owner, tx } = await (0, createDeployment_1.createDeployment)();
    const bids = await (0, bids_1.fetchBids)(dseq, owner, tx.height);
    return bids.length;
};
exports.deployGenericSDL = deployGenericSDL;
const deployAllBiddersSDL = async (respondersLength) => {
    (0, yaml_1.generateYamlWithWebs)(respondersLength);
    const { dseq, owner, tx } = await (0, createDeployment_1.createDeployment)(consts_1.RAW_SDL_T2);
    const bids = await (0, bids_1.fetchBids)(dseq, owner, tx.height, 6);
    return { bids, owner };
};
exports.deployAllBiddersSDL = deployAllBiddersSDL;
//# sourceMappingURL=utils.js.map