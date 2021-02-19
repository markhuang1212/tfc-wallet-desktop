import {TfcChainAccount} from '../tfc';

describe('TFC Chain', ()=>{
  test('should get address correctly', ()=>{
    const acc = new TfcChainAccount(Buffer.from(
        '1374ded99e64cf8da7161e720f1e8e842bb1f44c0d061581299ec2e721419cf8',
        'hex',
    ));
    expect(acc.address).toEqual('142JB9iSAzUDpPN1nEfSqqvEcFqWouHxA3');
  });
});
