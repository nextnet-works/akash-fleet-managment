import fs from "fs";

import { SigningStargateClient } from "@cosmjs/stargate";
import { DirectSecp256k1HdWallet, Registry } from "cosmwasm";

// these imports should point to @akashnetwork/akashjs node module in your project
import * as cert from "@akashnetwork/akashjs/build/certificates";
import { SDL } from "@akashnetwork/akashjs/build/sdl";
import { getAkashTypeRegistry } from "@akashnetwork/akashjs/build/stargate";
import { CERTIFICATE_PATH, RAW_SDL_T1, RPC_ENDPOINT } from "./consts";

export async function loadPrerequisites(sdlPath = RAW_SDL_T1) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    process.env.AKASH_MNEMONIC!,
    {
      prefix: "akash",
    },
  );
  const myRegistry = new Registry(getAkashTypeRegistry());

  const client = await SigningStargateClient.connectWithSigner(
    RPC_ENDPOINT,
    wallet,
    {
      registry: myRegistry,
      // gasPrice: {
      //   amount:  1000.0,
      //   denom:  "uakt",
      // }
    },
  );

  const certificate = await loadOrCreateCertificate(wallet, client);
  const file = fs.readFileSync(sdlPath, "utf8");
  const sdl = SDL.fromString(file, "beta3");

  return {
    wallet,
    client,
    certificate,
    sdl,
  };
}

async function loadOrCreateCertificate(
  wallet: DirectSecp256k1HdWallet,
  client: SigningStargateClient,
) {
  const accounts = await wallet.getAccounts();

  // check to see if we can load the certificate from the fixtures folder

  if (fs.existsSync(CERTIFICATE_PATH)) {
    return loadCertificate(CERTIFICATE_PATH);
  }

  // if not, create a new one
  const certificate = await cert.createCertificate(accounts[0].address);
  const result = await cert.broadcastCertificate(
    certificate,
    accounts[0].address,
    client,
  );

  if (result.code !== undefined && result.code === 0) {
    // save the certificate to the fixtures folder
    saveCertificate(certificate);
    return certificate;
  }

  throw new Error(`Could not create certificate: ${result.rawLog} `);
}

function loadCertificate(path: string): {
  csr: string;
  privateKey: string;
  publicKey: string;
} {
  const json = fs.readFileSync(path, "utf8");

  try {
    return JSON.parse(json);
  } catch (e) {
    throw new Error(`Could not parse certificate: ${e} `);
  }
}

// saves the certificate into the fixtures folder
function saveCertificate(certificate: {
  privateKey: string;
  publicKey: string;
  csr: string;
}) {
  const json = JSON.stringify(certificate);
  fs.writeFileSync(CERTIFICATE_PATH, json);
}
