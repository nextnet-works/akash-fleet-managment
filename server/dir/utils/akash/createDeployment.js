"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeployment = void 0;
const stargate_1 = require("@akashnetwork/akashjs/build/stargate");
const v1beta3_1 = require("@akashnetwork/akash-api/akash/deployment/v1beta3");
const consts_1 = require("./consts");
const client_1 = require("./client");
async function createDeployment(sdlPath) {
    const { wallet, client, sdl } = await (0, client_1.loadPrerequisites)(sdlPath);
    const blockheight = await client.getHeight();
    const groups = sdl.groups();
    const accounts = await wallet.getAccounts();
    if (consts_1.DSEQ != 0) {
        console.log("Skipping deployment creation...");
        return {
            id: {
                owner: accounts[0].address,
                dseq: consts_1.DSEQ,
            },
            groups: groups,
            deposit: {
                denom: "uakt",
                amount: "1000000",
            },
            version: await sdl.manifestVersion(),
            depositor: accounts[0].address,
        };
    }
    const deployment = {
        id: {
            owner: accounts[0].address,
            dseq: blockheight,
        },
        groups: groups,
        deposit: {
            denom: "uakt",
            amount: "1000000",
        },
        version: await sdl.manifestVersion(),
        depositor: accounts[0].address,
    };
    const fee = {
        amount: [
            {
                denom: "uakt",
                amount: "20000",
            },
        ],
        gas: "800000",
    };
    const msg = {
        typeUrl: (0, stargate_1.getTypeUrl)(v1beta3_1.MsgCreateDeployment),
        value: v1beta3_1.MsgCreateDeployment.fromPartial(deployment),
    };
    const tx = await client.signAndBroadcast(accounts[0].address, [msg], fee, "create deployment");
    if (tx.code !== undefined && tx.code === 0) {
        return deployment;
    }
    throw new Error(`Could not create deployment: ${tx.rawLog} `);
}
exports.createDeployment = createDeployment;
//# sourceMappingURL=createDeployment.js.map