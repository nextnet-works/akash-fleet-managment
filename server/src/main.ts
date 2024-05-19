import "dotenv/config";
import express from "express";
import cors from "cors";
import deployRouter from "./routes/deploy";
import { getAkashCoinPrice } from "./utils/akashPrice";
import { CronJob } from "cron";

// import https from "https";
import fs from "fs";
const app = express();
const port = 3000;

app.use(
  // cors({ origin: ["https://akash-gamma.vercel.app", "http://localhost:5173"] })
  cors(),
);

app.use(express.json());

app.use("/deploy", deployRouter);

app.get("/akash-coin-price", async (_, res) =>
  res.json(await getAkashCoinPrice()),
);

// const options = {
//   key: fs.readFileSync("./src/assets/key.cer"),
//   cert: fs.readFileSync("./src/assets/cert.cer"),
// };

// https
//   .createServer(options, app)
//   .listen(port, () => console.log(`Server running on port ${port}`));

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// server.on("error", (err) => {
//   console.error("Server encountered an error:", err);
//   updateNodesWorker.stop();
//   process.exit(1); // Optional: Exit the process if the server fails
// });

// // Handle graceful shutdown
// process.on("SIGINT", () => {
//   console.log("Received SIGINT. Shutting down gracefully.");
//   server.close(() => {
//     console.log("HTTP server closed.");
//     updateNodesWorker.stop();
//     process.exit(0);
//   });
// });

// process.on("SIGTERM", () => {
//   console.log("Received SIGTERM. Shutting down gracefully.");
//   server.close(() => {
//     console.log("HTTP server closed.");
//     updateNodesWorker.stop();
//     process.exit(0);
//   });
// });
