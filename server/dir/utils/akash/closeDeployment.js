"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDeployment = void 0;
const proto_signing_1 = require("@cosmjs/proto-signing");
const index_1 = require("@akashnetwork/akashjs/build/stargate/index");
const v1beta3_1 = require("@akashnetwork/akash-api/akash/deployment/v1beta3");
const stargate_1 = require("@cosmjs/stargate");
const akashjs_1 = require("@akashnetwork/akashjs");
const client_1 = require("./client");
async function closeDeployment(dseq) {
    try {
        const { wallet } = await (0, client_1.loadPrerequisites)();
        const [account] = await wallet.getAccounts();
        const message = v1beta3_1.MsgCloseDeployment.fromPartial({
            id: {
                dseq,
                owner: account.address,
            },
        });
        const msgAny = {
            typeUrl: (0, index_1.getTypeUrl)(v1beta3_1.MsgCloseDeployment),
            value: message,
        };
        const nodes = await akashjs_1.network.getEndpoints("mainnet", "rpc");
        const myRegistry = new proto_signing_1.Registry((0, index_1.getAkashTypeRegistry)());
        const client = await stargate_1.SigningStargateClient.connectWithSigner(nodes[0].address, wallet, {
            registry: myRegistry,
        });
        const fee = {
            amount: [
                {
                    denom: "uakt",
                    amount: "20000",
                },
            ],
            gas: "80000",
        };
        const signedMessage = await client.signAndBroadcast(account.address, [msgAny], fee, "take down deployment");
        if (signedMessage.code === 200) {
            return "Deployment closed successfully";
        }
        return "Deployment close failed";
    }
    catch (e) {
        console.log(e);
        return e;
    }
}
exports.closeDeployment = closeDeployment;
//# sourceMappingURL=closeDeployment.js.map