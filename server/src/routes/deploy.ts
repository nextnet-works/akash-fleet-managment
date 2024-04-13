import { Router } from "express";
import { bids } from "../assets/mock";
import { exec } from "child_process";

import { COMMANDS } from "../utils/cli";
import { saveBidsToDB } from "../utils/db";
// import { closeDeployment } from "../utils/akash/closeDeployment";

const router = Router();

router.post("/create", async (req, res) => {
  exec(COMMANDS.DEPLOY, (error, stdout, stderr) => {
    console.log({ error, stdout, stderr, name: "DEPLOY" });
  });
  exec(COMMANDS.BIDS, (error, stdout, stderr) => {
    console.log({ error, stdout, stderr, name: "BIDS" });
  });

  await saveBidsToDB(bids);
  res.status(201).json(bids);
});

router.post("/accept", async (req, res) => {
  const bidId = req.body.body.bidId;

  if (!bidId) {
    return res.status(400).send("bid ID is required");
  }
  exec(COMMANDS.ACCEPT_BID, (error, stdout, stderr) => {
    console.log({ error, stdout, stderr, name: "ACCEPT_BID" });
  });
  exec(COMMANDS.SEND_DEPLOYMENT_MANIFEST, (error, stdout, stderr) => {
    console.log({ error, stdout, stderr, name: "SEND_DEPLOYMENT_MANIFEST" });
  });
  exec(COMMANDS.GET_DEPLOYMENT_STATUS, (error, stdout, stderr) => {
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

export default router;
