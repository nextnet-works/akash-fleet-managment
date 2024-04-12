import "dotenv/config";
import express from "express";
import cors from "cors";
import deployRouter from "./routes/deploy";
import { getAkashCoinPrice } from "./utils/price";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use("/deploy", deployRouter);

app.get("/akash-coin-price", async (req, res) => {
  const price = await getAkashCoinPrice();
  res.json(price);
}
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
