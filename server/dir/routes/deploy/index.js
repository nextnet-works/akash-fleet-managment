"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utils_1 = require("./utils");
const closeDeployment_1 = require("../../akash-js/closeDeployment");
const router = (0, express_1.Router)();
const MAX_LEASES = 10;
router.post("/create", async (req, res) => {
  try {
    const sdlFile = req.body?.body?.sdlFile;
    if (!sdlFile) {
      return res.status(400).send("deployment is required");
    }
    // TODO: save prices of each provider
    const providerSupplies = [];
    let isBidsEmpty = false;
    let leasesResponses = [];
    let successfulLeaseCount = 0;
    while (!isBidsEmpty) {
      const { activeNodes } = await (0, utils_1.handleSdlFlow)(sdlFile);
      console.log(`Leases fulfilled: ${activeNodes.length}`);
      if (activeNodes.length === 0) {
        isBidsEmpty = true;
        return;
      }
      for (const lease of activeNodes) {
        if (successfulLeaseCount >= MAX_LEASES) {
          isBidsEmpty = true;
          return;
        }
        successfulLeaseCount++;
        leasesResponses.push(lease);
      }
    }
    for (const lease of leasesResponses) {
      await (0, closeDeployment_1.closeDeployment)(
        lease.bidId?.dseq.toString() ?? "",
      );
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    res.status(201).json(providerSupplies);
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal server error");
  }
});
exports.default = router;
//# sourceMappingURL=index.js.map
