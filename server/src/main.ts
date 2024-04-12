import "dotenv/config";
import express from "express";
import cors from "cors";
import deployRouter from "./routes/deploy";
import { getAkashCoinPrice } from "./utils/price";

const app = express();
const port = 3001;

app.use(
  cors({ origin: ["https://akash-gamma.vercel.app", "http://localhost:5173"] })
);

app.use(express.json());

app.use("/deploy", deployRouter);

app.get("/akash-coin-price", async (_, res) =>
  res.json(await getAkashCoinPrice())
);

app.listen(port, () => console.log(`Server running on port ${port}`));
