"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployAllBiddersSDL =
  exports.deployGenericSDL =
  exports.handleSdlFlow =
    void 0;
const yaml_1 = require("./yaml");
const createDeployment_1 = require("../../utils/akash/createDeployment");
const bids_1 = require("../../utils/akash/bids");
const consts_1 = require("../../utils/akash/consts");
const lease_1 = require("../../utils/akash/lease");
const db_1 = require("../../utils/db");
const handleSdlFlow = async () => {
  const respondersLength = await (0, exports.deployGenericSDL)();
  const { bids } = await (0, exports.deployAllBiddersSDL)(respondersLength);
  await (0, db_1.saveBidsToDB)(bids);
  let filteredBids = [];
  const gseqArray = [
    ...new Set(bids.map((bid) => bid?.bid?.bidId?.gseq)),
  ].filter((gseq) => gseq);
  gseqArray.forEach((gseq) => {
    const gseqBids = bids.filter((bid) => bid?.bid?.bidId?.gseq === gseq);
    const sortedBids = gseqBids.sort(
      (a, b) => Number(a?.bid?.price?.amount) - Number(b?.bid?.price?.amount),
    );
    if (!sortedBids[0]?.bid) {
      return;
    }
    filteredBids.push(sortedBids[0].bid);
  });
  const leases = await (0, lease_1.createLease)(filteredBids);
  const leasesFulfilled = leases.filter((lease) => lease.bidId);
  // TODO: add rejected leases to a blacklist of providers
  const leasedRejected = leases.filter((lease) => !lease.bidId);
  return { leasesFulfilled, leasedRejected };
};
exports.handleSdlFlow = handleSdlFlow;
const deployGenericSDL = async (AKASH_KEY_NAME = "myWallet-akt") => {
  const data = await (0, createDeployment_1.createDeployment)();
  const bids = await (0, bids_1.fetchBids)(data.id.dseq, data.id.owner);
  return bids.length;
};
exports.deployGenericSDL = deployGenericSDL;
const deployAllBiddersSDL = async (respondersLength) => {
  (0, yaml_1.generateYamlWithWebs)(respondersLength);
  const deploymentRes = await (0, createDeployment_1.createDeployment)(
    consts_1.RAW_SDL_T2,
  );
  await new Promise((resolve) => setTimeout(resolve, 15000)); // Wait 15 seconds
  const bids = await (0, bids_1.fetchBids)(
    deploymentRes.id.dseq,
    deploymentRes.id.owner,
  );
  if (bids.length === 0) {
    throw new Error("No bids found in T-2");
  }
  return { bids, owner: deploymentRes.id.owner };
};
exports.deployAllBiddersSDL = deployAllBiddersSDL;
//# sourceMappingURL=utils.js.map
