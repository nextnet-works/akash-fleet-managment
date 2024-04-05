import "dotenv/config";
import express from "express";
import { Status } from "./type";
import { getAllProvidesUrl, getClusterStatus } from "./utils";

const app = express();
const port = 3000;

app.listen(port, async () => {
  try {
    const providersUrls = await getAllProvidesUrl();
    const providersData: Array<Status> = [];
    const batchSize = 20;

    for (let i = 0; i < providersUrls.length; i += batchSize) {
      const batchUrls = providersUrls.slice(i, i + batchSize);
      const batchData = await Promise.all(
        batchUrls.map((url) => getClusterStatus(url))
      );
      providersData.push(
        ...batchData.filter((data): data is Status => data !== undefined)
      );
    }

    console.log(providersData);
  } catch (error: any) {
    console.error("Error: " + error);
  }
});
