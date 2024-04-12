"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const yaml_1 = require("yaml");
const fs = __importStar(require("fs"));
const mock_1 = require("../assets/mock");
const router = (0, express_1.Router)();
router.post("/create", (req, res) => {
  console.log("Deploy request received:", req.body);
  loadYAMLFile("src/assets/deploy.sdl.yaml");
  res.status(201).json(mock_1.bids);
});
router.post("/accept", (req, res) => {
  const bidId = req.body.body.bidId;
  if (!bidId) {
    return res.status(400).send("bid ID is required");
  }
  console.log(`Accept bid request received for bid ID: ${bidId}`);
  res.status(201).json(`Bid for bid ID ${bidId} accepted`);
});
exports.default = router;
async function loadYAMLFile(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath);
    const data = (0, yaml_1.stringify)(fileContents);
    return data;
  } catch (error) {
    console.error("Error reading or parsing YAML file:", error);
    throw error;
  }
}
//# sourceMappingURL=deploy.js.map
