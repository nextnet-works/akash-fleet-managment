"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Import cors
const deploy_1 = __importDefault(require("./routes/deploy"));
const bids_1 = __importDefault(require("./routes/bids"));
const app = (0, express_1.default)();
const port = 3001;
app.use((0, cors_1.default)()); // Use cors middleware with default options
app.use(express_1.default.json());
app.use("/deploy", deploy_1.default);
app.use("/bids", bids_1.default);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=main.js.map
