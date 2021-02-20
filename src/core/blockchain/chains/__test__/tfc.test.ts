import {TfcChain} from '../tfc';
import {Endpoints} from '../../defines';
import {CoinCode} from '../../../defines';

describe('TFC-Chain', ()=>{
  test('should get balance correctly', async ()=>{
    const tfcChain = new TfcChain(Endpoints[CoinCode.TFC_CHAIN]['9523']);
    const balance = await tfcChain.getBalance(
        '142JB9iSAzUDpPN1nEfSqqvEcFqWouHxA3',
    );
    expect(balance).toEqual(BigInt(0));
  });
});
