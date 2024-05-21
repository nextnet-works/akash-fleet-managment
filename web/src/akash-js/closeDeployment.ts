import { getTypeUrl } from "@akashnetwork/akashjs/build/stargate/index";
import { MsgCloseDeployment } from "@akashnetwork/akash-api/akash/deployment/v1beta3";

import { getClient } from "./client";
import { CHAIN_ID } from "@/lib/consts";
import { ChainInfo } from "@keplr-wallet/types";
import axios from "axios";
import { AkashChainInfo } from "./lib/chain";
import Long from "long";

export async function closeDeployment(dseq: string) {
  try {
    const { offlineSigner, client } = await getClient();

    const [account] = await offlineSigner.getAccounts();

    const message = MsgCloseDeployment.create({
      id: {
        dseq,
        owner: account.address,
      },
    });

    const msgAny = {
      typeUrl: getTypeUrl(MsgCloseDeployment),
      value: message,
    };

    const fee = {
      amount: [
        {
          denom: "uakt",
          amount: "20000",
        },
      ],
      gas: "80000",
    };

    const signedMessage = await client.sign(
      account.address,
      [msgAny],
      fee,
      "take down deployment"
    );

    const accountInfo = await fetchAccountInfo(AkashChainInfo, account.address);

    debugger;
    if (accountInfo === undefined) {
      return "Account not found. Please send some tokens to this account first.";
    }

    const res = await offlineSigner.signDirect(CHAIN_ID, {
      bodyBytes: signedMessage.bodyBytes,
      authInfoBytes: signedMessage.authInfoBytes,
      chainId: CHAIN_ID,
      accountNumber: Long.fromString(accountInfo.account_number),
    });
    console.log(res);

    // if (res.signed. === 200) {
    //   return "Deployment closed successfully";
    // }
    return "Deployment close failed";
  } catch (e) {
    return e;
  }
}

export const fetchAccountInfo = async (
  chainInfo: ChainInfo,
  address: string
) => {
  try {
    const uri = `${chainInfo.rest}/cosmos/auth/v1beta1/accounts/${address}`;
    const response = await axios.get<AccountResponse>(uri);

    return response.data.account;
  } catch (e) {
    console.error(
      "This may be a new account. Please send some tokens to this account first."
    );
    return undefined;
  }
};

export type AccountResponse = {
  account: Account;
};

export type Account = {
  account_number: string;
  address: string;
  sequence: string;
  pub_key: {
    "@type": string;
    key: string;
  };
};
