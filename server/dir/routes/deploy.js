"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mock_1 = require("../assets/mock");
const child_process_1 = require("child_process");
const cli_1 = require("../utils/cli");
const db_1 = require("../utils/db");
// import { closeDeployment } from "../utils/akash/closeDeployment";
const router = (0, express_1.Router)();
router.post("/create", async (req, res) => {
    (0, child_process_1.exec)(cli_1.COMMANDS.DEPLOY, (error, stdout, stderr) => {
        console.log({ error, stdout, stderr, name: "DEPLOY" });
    });
    (0, child_process_1.exec)(cli_1.COMMANDS.BIDS, (error, stdout, stderr) => {
        console.log({ error, stdout, stderr, name: "BIDS" });
    });
    await (0, db_1.saveBidsToDB)(mock_1.bids);
    res.status(201).json(mock_1.bids);
});
router.post("/accept", async (req, res) => {
    const bidId = req.body.body.bidId;
    if (!bidId) {
        return res.status(400).send("bid ID is required");
    }
    (0, child_process_1.exec)(cli_1.COMMANDS.ACCEPT_BID, (error, stdout, stderr) => {
        console.log({ error, stdout, stderr, name: "ACCEPT_BID" });
    });
    (0, child_process_1.exec)(cli_1.COMMANDS.SEND_DEPLOYMENT_MANIFEST, (error, stdout, stderr) => {
        console.log({ error, stdout, stderr, name: "SEND_DEPLOYMENT_MANIFEST" });
    });
    (0, child_process_1.exec)(cli_1.COMMANDS.GET_DEPLOYMENT_STATUS, (error, stdout, stderr) => {
        console.log({ error, stdout, stderr, name: "GET_DEPLOYMENT_STATUS" });
    });
    res.status(201).json(`Bid for bid ID ${bidId} accepted`);
});
router.post("/delete", async (req, res) => {
    const id = req.body.body.id;
    if (!id) {
        return res.status(400).send("id is required");
    }
    // const output = await closeDeployment(id);
    // exec(COMMANDS.CLOSE_DEPLOYMENT, (error, stdout, stderr) => {});
    res.status(201).json(`Deployment with ID ${id} deleted`);
});
exports.default = router;
//# sourceMappingURL=deploy.js.map