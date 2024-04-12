import "dotenv/config";
import express from "express";
import { sendDeploy, walletFromMnemonic } from "./akash";

const app = express();
const port = 3001;

const mnemonic =
  "tragic wife grace victory volume journey base dirt calm morning lizard camera";

app.listen(port, async () => {
  try {
    const wallet = await walletFromMnemonic(mnemonic);
    const [account] = await wallet.getAccounts();
    const deploy = await sendDeploy();

    console.log(account, deploy);
  } catch (error: any) {
    console.error("Error: " + error);
  }
});
