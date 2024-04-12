import { Router } from "express";
import { stringify } from "yaml";
import * as fs from "fs";
import { bids } from "../assets/mock";
import { exec } from "child_process";
import { Bid } from "../type";
import { createClient } from '@supabase/supabase-js'

const router = Router();

router.post("/create", async (req, res) => {
  console.log("Deploy request received:", req.body);
  loadYAMLFile("src/assets/deploy.sdl.yaml");
  await saveBidsToDB(bids);
  res.status(201).json(bids);
});


router.post("/accept", async (req, res) => {
  const bidId = req.body.body.bidId;
  if (!bidId) {
    return res.status(400).send("bid ID is required");
  }
  const dibs = await loadBidsFromDB();
  console.log(dibs)
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

async function saveBidsToDB(bids: Bid[]): Promise<void> {
  try {
    const supabase = createClient(process.env.SUPABASE_PROJECT_URL!, process.env.SERVICE_ROLE_KEY!)
    const output = bids.map((bid) => {
      return {
        id: bid.escrow_account.id.xid,
        json: bid,
      };
    });
    const { error }  = await supabase.from('bids').upsert(output);
    if (error) {
      throw error;
    }

  } catch (error) {
    console.error("Error saving bids to database:", error);
    throw error;
  }
}

async function loadBidsFromDB(): Promise<{ id: string; owner: unknown }[]> {
  const supabase = createClient(process.env.SUPABASE_PROJECT_URL!, process.env.SERVICE_ROLE_KEY!)
  const { data, error } = await supabase.from('bids').select(`
  id,
  owner:  json->bid->bid_id->owner
`)
  if (error) {
    throw error;
  }
  return data ?? [];
}


