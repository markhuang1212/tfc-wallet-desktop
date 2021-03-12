# TFC-Wallet Desktop

A crypto-currency wallet that supports TFC-ERC20, ETH, USDT, BTC, and more.

## Installation

* run `npm i` to install dependency.

## Building and Running

1. run `npm run build`
2. run `./node_modules/.bin/electron .`

## Development

1. run `npm run build` to build the code.
2. run `npm run dev` to start the dev server.
3. run `npm start` to start the project.

## Deployment

* run `npm run make`. The output executable will be at `./out`

## Core Usage

There are some examples in [`src/core/__test__/example.test.ts`](./src/core/__test__/example.test.ts);

## 代码结构

/src/core: BIP44代码和钱包货币功能代码
/src/app: 钱包逻辑
/src/ui: UI代码
