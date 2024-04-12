"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClusterStatus = exports.getAllProvidesUrl = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * Get the URL of all the providers from akash-api.polkachu.com
 * @returns The URL of all the providers
 */
async function getAllProvidesUrl() {
  const providers = await axios_1.default.get(
    "https://akash-api.polkachu.com/akash/provider/v1beta3/providers",
  );
  return providers.data.providers.map(({ host_uri }) => host_uri);
}
exports.getAllProvidesUrl = getAllProvidesUrl;
/**
 * Get the status of a cluster with available resources from cloudmos.io
 * @param providerUrl  The URL of the provider (domain + port)
 * @returns  The status of the cluster with available resources
 */
async function getClusterStatus(providerUrl) {
  try {
    const res = await axios_1.default.post(
      "https://providerproxy.cloudmos.io/",
      {
        url: providerUrl + "/status",
        method: "GET",
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error getting status for: " + providerUrl);
  }
}
exports.getClusterStatus = getClusterStatus;
//# sourceMappingURL=utils.js.map
