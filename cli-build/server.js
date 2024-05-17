"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var cors_1 = __importDefault(require("cors"));
var config_1 = require("./config");
var express = require('express');
var app = express();
var port = 3010;
app.use(express.static(config_1.config.appPath));
app.use((0, cors_1.default)());
app.get('/raw-file', function (_req, res) {
    res.status(200).send(fs_1.default.readFileSync(config_1.config.rawFileOutputPath));
});
app.get('/', function (_req, res) {
    res.sendFile(config_1.config.appIndexPath);
});
app.listen(port, function () {
    console.log("Server app listening on port ".concat(port));
});
