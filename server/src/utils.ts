import axios from "axios";
import { ProvidersResponse, Status } from "./type";

/**
 * Get the URL of all the providers from akash-api.polkachu.com
 * @returns The URL of all the providers
 */
export async function getAllProvidesUrl() {
  const providers = await axios.get<ProvidersResponse>(
    "https://akash-api.polkachu.com/akash/provider/v1beta3/providers"
  );
  return providers.data.providers.map(({ host_uri }) => host_uri);
}

/**
 * Get the status of a cluster with available resources from cloudmos.io
 * @param providerUrl  The URL of the provider (domain + port)
 * @returns  The status of the cluster with available resources
 */
export async function getClusterStatus(providerUrl: string) {
  try {
    const res = await axios.post<Status>("https://providerproxy.cloudmos.io/", {
      url: providerUrl + "/status",
      method: "GET",
    });

    return res.data;
  } catch (error: any) {
    console.error("Error getting status for: " + providerUrl);
  }
}


