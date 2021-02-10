
const vsys = require('@virtualeconomy/js-v-sdk');
import {Wallet} from '../../wallet';
import {CoinCode} from '../../../defines';

const base58 = require('base-58');

describe('VsysAccount', ()=>{
  test('should get address correctly', ()=>{
    const vsysAcc = new vsys.Account(vsys.constants.MAINNET_BYTE);
    const wallet = new Wallet(Buffer.from('1234', 'hex'));
    const vsysCoinWallet = wallet.getCoinWallet(CoinCode.VSYS);
    const acc = vsysCoinWallet?.getBip44Account(0);
    vsysAcc.buildFromPrivateKey(base58.encode(acc?.privateKey));
    expect(vsysAcc.getAddress()).toEqual(acc?.address);
  });

  test('should get address correctly after changing network type', ()=>{
    const vsysAcc = new vsys.Account(vsys.constants.TESTNET_BYTE);
    const wallet = new Wallet(Buffer.from('1234', 'hex'));
    const vsysCoinWallet = wallet.getCoinWallet(CoinCode.VSYS);
    const acc = vsysCoinWallet?.getBip44Account(0);
    vsysAcc.buildFromPrivateKey(base58.encode(acc?.privateKey));
    acc.networkType = vsys.constants.TESTNET_BYTE;
    expect(vsysAcc.getAddress()).toEqual(acc?.address);
  });
});
