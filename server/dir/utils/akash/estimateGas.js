"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateGas = void 0;
const index_1 = require("@akashnetwork/akashjs/build/stargate/index");
const v1beta3_1 = require("@akashnetwork/akash-api/akash/deployment/v1beta3");
const client_1 = require("./client");
async function estimateGas() {
    const { wallet, client, sdl } = await (0, client_1.loadPrerequisites)();
    const accounts = await wallet.getAccounts();
    const groups = sdl.groups();
    const blockheight = await client.getHeight();
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
    const msg = {
        typeUrl: (0, index_1.getTypeUrl)(v1beta3_1.MsgCreateDeployment),
        value: v1beta3_1.MsgCreateDeployment.fromPartial(deployment),
    };
    const gasEstimated = await client.simulate(accounts[0].address, [msg], "simulate");
    console.log({ gasEstimated });
}
exports.estimateGas = estimateGas;
//# sourceMappingURL=estimateGas.js.map