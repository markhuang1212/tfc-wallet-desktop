import {Wallet} from '../../wallet';
import {CoinTypes} from '../defines';
import {BtcAccount} from '../btc';

describe('BtcAccount', ()=>{
  test('should get address correctly', ()=>{
    // eslint-disable-next-line max-len
    const seed = 'bf7b051d3f782eb3eb2948122230a8705fa1472d3258349acd84e6e8cb4a704efa1368b2edac65c570038f6b8e62435553d393217d4a161ca76009c8b094fe6e';
    const wallet = new Wallet(Buffer.from(seed, 'hex'));
    const coin = wallet.getCoinWallet(CoinTypes.BTC);
    const acc = coin?.getBip44Account(0) as BtcAccount;
    expect(acc.address).toEqual('1DP2Ya67jwPrJjHhP5h83ZSLP2fLAhhmhp');
    expect(acc.publicKey)
    // eslint-disable-next-line max-len
        .toEqual('028e52de2fbfee14809e0cd5a45116fda80082a3ce6c2b6a87c70642fd8d4af9d6');
    expect(acc.WIF)
        .toEqual('L18qExKoBaNCvFx1d4nZQGpokd83EGgkQ1dzBTjSABoW4nSqed4k');
  });
});
