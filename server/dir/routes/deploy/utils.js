"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployAllBiddersSDL = exports.deployGenericSDL = exports.handleSdlFlow = void 0;
const yaml_1 = require("./yaml");
const createDeployment_1 = require("../../akash-js/createDeployment");
const bids_1 = require("../../akash-js/bids");
const consts_1 = require("../../akash-js/lib/consts");
const lease_1 = require("../../akash-js/lease");
const handleSdlFlow = async () => {
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