import "dotenv/config";
import express from "express";
import akash from "@akashnetwork/akashjs";

const app = express();
const port = 3000;

app.listen(port, async () => {
    console.log(`Server is running on port ${port} :)`);

    try {
        const res = await akash.rpc.getQueryClient("https://akash-api.polkachu.com")

        console.log(res)
    } catch (error:any) {
        console.log(`Akash Transport : ${error.message}`);
    }
});