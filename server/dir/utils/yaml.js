"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadYAMLFile = void 0;
const yaml_1 = require("yaml");
const fs_1 = __importDefault(require("fs"));
async function loadYAMLFile(filePath) {
    try {
        const fileContents = fs_1.default.readFileSync(filePath);
        const data = (0, yaml_1.stringify)(fileContents);
        return data;
    }
    catch (error) {
        console.error("Error reading or parsing YAML file:", error);
        throw error;
    }
}
exports.loadYAMLFile = loadYAMLFile;
//# sourceMappingURL=yaml.js.map