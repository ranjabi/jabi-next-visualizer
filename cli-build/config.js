"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var process_1 = __importDefault(require("process"));
// export const getConfig = () => {
//   const config = {
//     cliPath: process.cwd() + '/cli-build',
//     rawFileOutputPath: process.cwd() + '/node_modules/jabi-next-visualizer/app/.visualizer/data.json'
//   }
//   console.log('Config:', config)
//   return config
// }
exports.config = {
    rawFileOutputPath: process_1.default.cwd() + '/node_modules/jabi-next-visualizer/app/.visualizer/data.json',
    appPath: process_1.default.cwd() + '/node_modules/jabi-next-visualizer/app/out',
    appIndexPath: process_1.default.cwd() + '/node_modules/jabi-next-visualizer/app/out/index.html',
    serverPath: process_1.default.cwd() + '/node_modules/jabi-next-visualizer/cli-build/server.js'
};
