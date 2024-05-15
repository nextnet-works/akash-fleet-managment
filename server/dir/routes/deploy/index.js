"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("../../akash-js/lib/consts");
const express_1 = require("express");
const utils_1 = require("./utils");
const closeDeployment_1 = require("../../akash-js/closeDeployment");
const router = (0, express_1.Router)();
const MAX_LEASES = 10;
router.post("/create", async (req, res) => {
    try {
        const deployment = req.body?.deployment;
        if (!deployment) {
            return res.status(400).send("deployment is required");
        }
        const resourceUsed = consts_1.DEPLOYMENT_RESOURCES["Mor-S-SDL-T1"];
        // TODO: save prices of each provider
        const providerSupplies = [];
        let isBidsEmpty = false;
        let leasesResponses = [];
        let successfulLeaseCount = 0;
        while (!isBidsEmpty) {
            const { activeNodes } = await (0, utils_1.handleSdlFlow)();
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
            await (0, closeDeployment_1.closeDeployment)(lease.bidId?.dseq.toString() ?? "");
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