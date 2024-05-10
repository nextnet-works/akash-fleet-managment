import { exec } from "child_process";
import { promisify } from "util";

import { Bid, SuccessfulLease } from "../../type";
import { saveBidsToDB } from "../../utils/db";
import { generateYamlWithWebs } from "./yaml";
const execAsync = promisify(exec);

const WAIT_TIME = 30000;

export const handleSdlFlow = async () => {
  const respondersLength = await deployGenericSDL();
  const { bids, owner } = await deployAllBiddersSDL(respondersLength);

  await saveBidsToDB(bids);

  const leasesPromises = bids.map((bid) => lease(bid));

  const leasesFulfilled = await Promise.all(leasesPromises);

  const leasedRejected = leasesFulfilled.filter((lease) => !lease.isSuccess);

  // TODO: add rejected leases to a blacklist of providers

  const leasedAccepted = leasesFulfilled.filter((lease) => lease.isSuccess);

  return { leasedAccepted, owner };
};

export const deployGenericSDL = async (): Promise<number> => {
  const AKASH_KEY_NAME = process.env.AKASH_KEY_NAME;
  const { stdout } = await execAsync(
    `provider-services tx deployment create ./src/routes/deploy/Mor-S-SDL-T1.yml -y --from ${AKASH_KEY_NAME}`
  );
  const data = JSON.parse(stdout) as {
    logs: { events: { attributes: { key: string; value: string }[] }[] }[];
  };

  const AKASH_DSEQ = Number(
    data.logs[0].events[0].attributes.find((attr) => attr.key === "dseq")?.value
  );
  const AKASH_ACCOUNT_ADDRESS =
    data.logs[0].events[0].attributes.find((attr) => attr.key === "owner")
      ?.value ?? "";

  await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));

  const { stdout: envVars } = await execAsync("env");

  console.log({ envVars });

  console.log({ AKASH_ACCOUNT_ADDRESS, AKASH_DSEQ });

  const { stdout: bidStdout } = await execAsync(
    `provider-services query market bid list --owner=${AKASH_ACCOUNT_ADDRESS} --dseq=${AKASH_DSEQ} --gseq=0 --oseq=0 --state=open -o json`
  );
  const bids = JSON.parse(bidStdout).bids;
  console.log({ bids, length: bids.length });

  return bids.length;
};

export const deployAllBiddersSDL = async (respondersLength: number) => {
  generateYamlWithWebs(respondersLength);

  const AKASH_KEY_NAME = process.env.AKASH_KEY_NAME;

  await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));

  const { stdout } = await execAsync(
    `provider-services tx deployment create ./src/routes/deploy/Mor-S-SDL-T2.yml -y --from ${AKASH_KEY_NAME}`
  );
  const data = JSON.parse(stdout) as {
    logs: { events: { attributes: { key: string; value: string }[] }[] }[];
  };

  const AKASH_DSEQ = Number(
    data.logs[0].events[0].attributes.find((attr) => attr.key === "dseq")?.value
  );
  const AKASH_ACCOUNT_ADDRESS =
    data.logs[0].events[0].attributes.find((attr) => attr.key === "owner")
      ?.value ?? "";

  console.log({ AKASH_ACCOUNT_ADDRESS, AKASH_DSEQ });

  await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));

  const { stdout: bidStdout } = await execAsync(
    `provider-services query market bid list --owner=${AKASH_ACCOUNT_ADDRESS} --dseq=${AKASH_DSEQ} --state=open -o json`
  );

  console.log({ name: "deployAllBiddersSDL-2", data: bidStdout });

  const bids = JSON.parse(bidStdout).bids as Bid[];

  if (bids.length === 0) {
    throw new Error("No bids found in T-2");
  }

  return { bids, owner: AKASH_ACCOUNT_ADDRESS };
};

export const lease = async (bid: Bid): Promise<SuccessfulLease> => {
  const AKASH_KEY_NAME = process.env.AKASH_KEY_NAME;
  await execAsync(
    `provider-services tx market lease create -y --dseq ${bid.bid.bid_id.dseq} --provider ${bid.bid.bid_id.provider} --from ${AKASH_KEY_NAME}`
  );

  const isSuccess = await sendManifest(
    bid.bid.bid_id.dseq,
    bid.bid.bid_id.provider,
    bid.bid.bid_id.gseq,
    bid.bid.bid_id.oseq
  );

  return {
    dseq: bid.bid.bid_id.dseq,
    provider: bid.bid.bid_id.provider,
    isSuccess,
    price: Number(bid.bid.price.amount),
  };
};

export const sendManifest = async (
  dseq: string,
  provider: string,
  gseq: number,
  oseq: number
): Promise<boolean> => {
  const AKASH_KEY_NAME = process.env.AKASH_KEY_NAME;
  const { stdout } = await execAsync(
    `provider-services send-manifest Mor-S-SDL-T2.yml --dseq ${dseq} --provider ${provider}  --from ${AKASH_KEY_NAME} --gseq ${gseq} --oseq ${oseq} -o json`
  );

  const res = JSON.parse(stdout) as { status: "FAIL" | "PASS" }[];
  return res[0].status === "PASS";
};

// export const getManifestStatus = async (
//   dseq: string,
//   provider: string
// ): Promise<void> => {
//   const AKASH_KEY_NAME = process.env.AKASH_KEY_NAME;
//   await execAsync(
//     `provider-services query deployment get --dseq ${dseq} --provider ${provider} -o json`
//   );
// };

export const closeDeployment = async (
  id: string,
  owner: string
): Promise<void> => {
  const AKASH_KEY_NAME = process.env.AKASH_KEY_NAME;
  await execAsync(
    `provider-services tx deployment close --dseq ${id} --from ${AKASH_KEY_NAME} --owner=${owner}`
  );
};
