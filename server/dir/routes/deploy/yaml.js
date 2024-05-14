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
exports.generateYamlWithWebs = void 0;
const fs = __importStar(require("fs"));
const YAML = __importStar(require("yaml"));
const consts_1 = require("../../utils/akash/consts");
function generateYamlWithWebs(count) {
  const data = {
    version: "2.0",
    services: {},
    profiles: {
      compute: {},
      placement: {},
    },
    deployment: {},
  };
  for (let i = 1; i <= count; i++) {
    const key = `web-${i}`;
    data.services[key] = {
      image: "linuxserver/webtop:amd64-ubuntu-xfce",
      expose: [
        { port: 3000, as: 3000, to: [{ global: true }] },
        { port: 22, as: 22, proto: "tcp", to: [{ global: true }] },
        { port: 11434, as: 11434, to: [{ global: true }] },
      ],
      env: ["OLLAMA_DEBUG=1"],
      params: {
        storage: {
          data: {
            mount: "/mnt/data",
            readOnly: false,
          },
        },
      },
    };
    data.profiles.compute[key] = {
      resources: {
        cpu: { units: 4 },
        memory: { size: "16Gi" },
        storage: [
          { size: "64Gi" },
          {
            name: "data",
            size: "10Gi",
            attributes: { persistent: true, class: "beta3" },
          },
        ],
        gpu: {
          units: 1,
          attributes: {
            vendor: {
              nvidia: [
                { model: "h100" },
                { model: "a100" },
                { model: "rtx4090" },
                { model: "rtx8000" },
                { model: "p100" },
                { model: "a6000" },
                { model: "v100" },
                { model: "rtx3090" },
                { model: "t4" },
                { model: "p40" },
              ],
            },
          },
        },
      },
    };
    data.profiles.placement[`global${i}`] = {
      pricing: {
        [key]: {
          denom: "uakt",
          amount: 10000,
        },
      },
    };
    data.deployment[key] = {};
    data.deployment[key][`global${i}`] = {
      profile: key,
      count: 1,
    };
  }
  const yamlStr = YAML.stringify(data);
  fs.writeFileSync(consts_1.RAW_SDL_T2, yamlStr, "utf8");
  console.log(`Generated YAML file with ${count} web entries.`);
}
exports.generateYamlWithWebs = generateYamlWithWebs;
//# sourceMappingURL=yaml.js.map
