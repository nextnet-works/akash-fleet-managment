import { Router } from "express";
import { stringify } from "yaml";
import * as fs from "fs";
import { bids } from "../assets/mock";
import { chdir } from "process";
import { exec } from "child_process";

const router = Router();

router.post("/create", (req, res) => {
  console.log("Deploy request received:", req.body);
  loadYAMLFile("src/assets/deploy.sdl.yaml");
  res.status(201).json(bids);
});

router.post("/accept", (req, res) => {
  const bidId = req.body.body.bidId;
  if (!bidId) {
    return res.status(400).send("bid ID is required");
  }

  exec(
     'node -e "console.log(\'Hello, World!\')"',
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send(error.message);
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );


  res.status(201).json(`Bid for bid ID ${bidId} accepted`);
});

export default router;

async function loadYAMLFile(filePath: string): Promise<any> {
  try {
    const fileContents = fs.readFileSync(filePath);
    const data = stringify(fileContents);
    return data;
  } catch (error) {
    console.error("Error reading or parsing YAML file:", error);
    throw error;
  }
}
