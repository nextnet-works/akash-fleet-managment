"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("../../utils/akash/consts");
const express_1 = require("express");
const utils_1 = require("./utils");
const closeDeployment_1 = require("../../utils/akash/closeDeployment");
const router = (0, express_1.Router)();
const MAX_LEASES = 10;
router.post("/create", async (req, res) => {
    try {
        // const deployment = req.body?.deployment as DeploymentResources;
        // if (!deployment) {
        //   return res.status(400).send("deployment is required");
        // }
        const resourceUsed = consts_1.DEPLOYMENT_RESOURCES["MORPHEUS"];
        // TODO: save prices of each provider
        const providerSupplies = [];
        let isBidsEmpty = false;
        let leasesResponses = [];
        let successfulLeaseCount = 0;
        while (!isBidsEmpty) {
            const { leasesFulfilled } = await (0, utils_1.handleSdlFlow)();
            console.log(`Leases fulfilled: ${leasesFulfilled.length}`);
            if (leasesFulfilled.length === 0) {
                isBidsEmpty = true;
                return;
            }
            for (const lease of leasesFulfilled) {
                if (successfulLeaseCount >= MAX_LEASES) {
                    isBidsEmpty = true;
                    return;
                }
                const providerIndex = providerSupplies.findIndex((provider) => provider.name === lease.bidId?.provider);
                if (providerIndex === -1) {
                    providerSupplies.push({
                        ...resourceUsed,
                        name: lease?.bidId?.provider ?? "",
                    });
                }
                else {
                    providerSupplies[providerIndex].cpu += resourceUsed.cpu;
                    providerSupplies[providerIndex].gpu += resourceUsed.gpu;
                    providerSupplies[providerIndex].memory += resourceUsed.memory;
                    providerSupplies[providerIndex].storage += resourceUsed.storage;
                }
                successfulLeaseCount++;
                leasesResponses.push(lease);
            }
        }
        for (const lease of leasesResponses) {
            const message = await (0, closeDeployment_1.closeDeployment)(lease.bidId?.dseq.toString() ?? "");
            console.log(message);
            await new Promise((resolve) => setTimeout(resolve, 1500));
        }
        res.status(201).json(providerSupplies);
    }
    catch (e) {
        console.error(e);
        res.status(500).send("Internal server error");
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map