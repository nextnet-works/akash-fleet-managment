import { Router } from "express";
import { bids } from "../assets/mock";
import { exec } from "child_process";

import { COMMANDS } from "../utils/cli";
import { saveBidsToDB } from "../utils/db";
import axios from "axios";
// import { deploy } from "../utils/akash/createDeployment";

const router = Router();

router.post("/create", async (req, res) => {
  // const akashKeyName = process.env.AKASH_KEY_NAME!;
  // const fileName = req.body.body.fileName;

  // if (!fileName) {
  //   return res.status(400).send("fileName is required");
  // }
  // const command = `provider-services tx deployment create ${fileName}.yml -y --from myWallet-akt`;

  // exec(command, (error, stdout, stderr) => {
  //   console.log({ error, stdout, stderr, name: "DEPLOY" });
  // });

  // await saveBidsToDB(bids);

  const providersPrices = bids.map((bid) => ({
    price: bid.bid.price.amount,
    provider: bid.bid.bid_id.provider,
  }));

  const promisesAvailability = providersPrices.map(async (provider) => {
    let output = null;
    try {
      const res = await axios.get(
        `https://api.cloudmos.io/v1/providers/${provider.provider}`
      );
      output = {
        ...res.data,
        price: Number(provider.price).toFixed(5),
      };
    } catch (error) {
      console.error(error);
    } finally {
      return output;
    }
  });

  const validProviders = (await Promise.all(promisesAvailability)).filter(
    (provider) => provider !== null
  );

  res.status(201).json(validProviders);
});

router.post("/accept", async (req, res) => {
  if (!req.body.body.dseq || !req.body.body.provider) {
    return res.status(400).send("dseq and provider are required");
  }
  // const akashKeyName = process.env.AKASH_KEY_NAME!;
  const AKASH_DSEQ = req.body.body.dseq;
  const AKASH_PROVIDER = req.body.body.provider;
  const command = `provider-services tx market lease create -y --dseq ${AKASH_DSEQ} --provider ${AKASH_PROVIDER} --from myWallet-akt`;
  exec(command, (error, stdout, stderr) => {
    console.log({ error, stdout, stderr, name: "ACCEPT_BID" });
  });

  console.log("Deploy sent to Akash Network");

  res
    .status(201)
    .json(`Bid with dseq ${AKASH_PROVIDER + "/" + AKASH_DSEQ} accepted`);
});

router.post("/delete", async (req, res) => {
  const id = req.body.body.id;
  if (!id) {
    return res.status(400).send("id is required");
  }

  exec(COMMANDS.CLOSE_DEPLOYMENT, (error, stdout, stderr) => {});

  res.status(201).json(`Deployment with ID ${id} deleted`);
});

export default router;
