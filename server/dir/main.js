"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const deploy_1 = __importDefault(require("./routes/deploy"));
const price_1 = require("./utils/price");
// import https from "https";
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = 3001;
app.use(
  // cors({ origin: ["https://akash-gamma.vercel.app", "http://localhost:5173"] })
  (0, cors_1.default)(),
);
app.use(express_1.default.json());
app.use("/deploy", deploy_1.default);
app.get("/akash-coin-price", async (_, res) =>
  res.json(await (0, price_1.getAkashCoinPrice)()),
);
const options = {
  key: fs_1.default.readFileSync("./src/assets/key.cer"),
  cert: fs_1.default.readFileSync("./src/assets/cert.cer"),
};
// https
//   .createServer(options, app)
//   .listen(port, () => console.log(`Server running on port ${port}`));
app.listen(port, () => console.log(`Server running on port ${port}`));
//# sourceMappingURL=main.js.map
