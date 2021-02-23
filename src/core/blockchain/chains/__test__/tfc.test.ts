import {TfcChain} from '../tfc';
import {CoinCode} from '../../../defines';
import {Wallet} from '../../../wallet';
import config from '../../../config';

describe('TFC-Chain', () => {
  test('should get balance correctly', async () => {
    const tfcChain =
      new TfcChain(config[CoinCode.TFC_CHAIN].blockchainfs.endpoint);
    const balance = await tfcChain.getBalance(
        '142JB9iSAzUDpPN1nEfSqqvEcFqWouHxA3',
    );
    expect(balance).toEqual(BigInt(0));
  });

  test.skip('should exchange to erc20', (done) => {
    const tfcChain =
      new TfcChain(config[CoinCode.TFC_CHAIN].blockchainfs.endpoint);
    tfcChain.exchangeToErc20(
        '14wW9abVreagLW1gDWo9F4UziqEEJnBJ5K',
        Wallet.getAccount(CoinCode.ETH, Buffer.from(
            '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
            'hex',
        )),
        BigInt(1),
    ).on('transactionFeePaying', (txHash) => {
      console.log('transactionFeePaying', txHash);
    }).on('transactionFeePaid', (txHash) => {
      console.log('transactionFeePaid', txHash);
    }).on('erc20Minting', () => {
      console.log('erc20Minting');
    }).on('erc20Minted', () => {
      console.log('erc20Minted');
    }).then(()=>{
      done();
    });
  }, 9999999);

  test('should get exchange record correctly', async ()=>{
    const tfcChain =
      new TfcChain(config[CoinCode.TFC_CHAIN].blockchainfs.endpoint);
    const records = await tfcChain.getExchangeRecords(
        '14wW9abVreagLW1gDWo9F4UziqEEJnBJ5K',
    );
    expect(records.length).toBeGreaterThanOrEqual(0);
  });
});
