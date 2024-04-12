import { Router } from "express";
import { stringify } from "yaml";
import * as fs from "fs";
import { bids } from "../assets/mock";

const router = Router();

router.post("/", (req, res) => {
  console.log("Deploy request received:", req.body);
  loadYAMLFile("src/assets/deploy.sdl.yaml");
  res.status(200).json(bids);
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
