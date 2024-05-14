"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPrerequisites = void 0;
const fs_1 = __importDefault(require("fs"));
const stargate_1 = require("@cosmjs/stargate");
const cosmwasm_1 = require("cosmwasm");
// these imports should point to @akashnetwork/akashjs node module in your project
const cert = __importStar(require("@akashnetwork/akashjs/build/certificates"));
const sdl_1 = require("@akashnetwork/akashjs/build/sdl");
const stargate_2 = require("@akashnetwork/akashjs/build/stargate");
const consts_1 = require("./consts");
async function loadPrerequisites(sdlPath = consts_1.RAW_SDL_T1) {
    const wallet = await cosmwasm_1.DirectSecp256k1HdWallet.fromMnemonic(process.env.AKASH_MNEMONIC, {
        prefix: "akash",
    });
    const myRegistry = new cosmwasm_1.Registry((0, stargate_2.getAkashTypeRegistry)());
    const client = await stargate_1.SigningStargateClient.connectWithSigner(consts_1.RPC_ENDPOINT, wallet, {
        registry: myRegistry,
        // gasPrice: {
        //   amount:  1000.0,
        //   denom:  "uakt",
        // }
    });
    const certificate = await loadOrCreateCertificate(wallet, client);
    const file = fs_1.default.readFileSync(sdlPath, "utf8");
    const sdl = sdl_1.SDL.fromString(file, "beta3");
    return {
        wallet,
        client,
        certificate,
        sdl,
    };
}
exports.loadPrerequisites = loadPrerequisites;
async function loadOrCreateCertificate(wallet, client) {
    const accounts = await wallet.getAccounts();
    // check to see if we can load the certificate from the fixtures folder
    if (fs_1.default.existsSync(consts_1.CERTIFICATE_PATH)) {
        return loadCertificate(consts_1.CERTIFICATE_PATH);
    }
    // if not, create a new one
    const certificate = await cert.createCertificate(accounts[0].address);
    const result = await cert.broadcastCertificate(certificate, accounts[0].address, client);
    if (result.code !== undefined && result.code === 0) {
        // save the certificate to the fixtures folder
        saveCertificate(certificate);
        return certificate;
    }
    throw new Error(`Could not create certificate: ${result.rawLog} `);
}
function loadCertificate(path) {
    const json = fs_1.default.readFileSync(path, "utf8");
    try {
        return JSON.parse(json);
    }
    catch (e) {
        throw new Error(`Could not parse certificate: ${e} `);
    }
}
// saves the certificate into the fixtures folder
function saveCertificate(certificate) {
    const json = JSON.stringify(certificate);
    fs_1.default.writeFileSync(consts_1.CERTIFICATE_PATH, json);
}
//# sourceMappingURL=client.js.map