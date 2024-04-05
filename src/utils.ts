import axios from "axios";
import { ProvidersResponse, Status } from "./type";

export async function getAllProvidesUrl() {
  const providers = await axios.get<ProvidersResponse>(
    "https://akash-api.polkachu.com/akash/provider/v1beta3/providers"
  );
  return providers.data.providers.map(({ host_uri }) => host_uri);
}

export async function getClusterStatus(providerUrl: string) {
  try {
    const res = await axios.post<Status>("https://providerproxy.cloudmos.io/", {
      url: "https://provider.xnets.club:8443" + "/status",
      method: "GET",
    });

    return res.data;
  } catch (error: any) {
    console.error("Error getting status for " + providerUrl + ": " + error);
  }
}
