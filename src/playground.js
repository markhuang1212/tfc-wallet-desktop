"use strict";
exports.__esModule = true;
var blockchain_1 = require("./core/blockchain");
var defines_1 = require("./core/blockchain/defines");
var wallet_1 = require("./core/wallet");
var privKey = '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d';
var account = new wallet_1.EthAccount(Buffer.from(privKey, 'hex'));
var ethChain = new blockchain_1.EthereumChain(defines_1.Endpoints[60].rinkeby);
ethChain.getBalance(account).then(function (balance) { return console.log(balance); });
