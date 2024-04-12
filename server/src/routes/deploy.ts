import { Router } from "express";
import { bids } from "../assets/mock";
import { exec } from "child_process";

import { COMMANDS } from "../utils/cli";
import { saveBidsToDB } from "../utils/db";

const router = Router();

router.post("/create", async (req, res) => {
  
  exec(COMMANDS.DEPLOY, (error, stdout, stderr) => {});
  exec(COMMANDS.BIDS, (error, stdout, stderr) => {});

  await saveBidsToDB(bids);
  res.status(201).json(bids);
});

router.post("/accept", async (req, res) => {
  const bidId = req.body.body.bidId;

  if (!bidId) {
    return res.status(400).send("bid ID is required");
  }
  exec(COMMANDS.ACCEPT_BID, (error, stdout, stderr) => {});
  exec(COMMANDS.SEND_DEPLOYMENT_MANIFEST, (error, stdout, stderr) => {});
  exec(COMMANDS.GET_DEPLOYMENT_STATUS, (error, stdout, stderr) => {});

  res.status(201).json(`Bid for bid ID ${bidId} accepted`);
});

router.post("/delete", async (req, res) => {
  const id = req.body.body.id;
  if (!id) {
    return res.status(400).send("id is required");
  }
  exec(COMMANDS.CLOSE_DEPLOYMENT, (error, stdout, stderr) => {});

  res.status(201).json(`Deployment for id ${id} deleted`);
});

export default router;



