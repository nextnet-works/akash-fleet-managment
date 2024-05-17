"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utils_1 = require("./utils");
const closeDeployment_1 = require("../../akash-js/closeDeployment");
const supabase_js_1 = require("@supabase/supabase-js");
const router = (0, express_1.Router)();
const MAX_LEASES = 10;
router.post("/create", async (req, res) => {
    try {
        const deploymentID = req.body?.body?.deploymentID;
        if (!deploymentID) {
            return res.status(400).send("deployment is required");
        }
        const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_PROJECT_URL, process.env.SERVICE_ROLE_KEY);
        const { data: sdl } = await supabase
            .from("sdl")
            .select("*")
            .eq("id", deploymentID)
            .single();
        if (!sdl) {
            return res.status(400).send("deployment not found");
        }
        // TODO: save prices of each provider
        const providerSupplies = [];
        let isBidsEmpty = false;
        let leasesResponses = [];
        let successfulLeaseCount = 0;
        while (!isBidsEmpty) {
            const { activeNodes } = await (0, utils_1.handleSdlFlow)(sdl.id);
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