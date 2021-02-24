import {TfcChainAccount} from '../tfc';

describe('TFC Chain', ()=>{
  test('should get address correctly', ()=>{
    const acc = new TfcChainAccount(Buffer.from(
        '1374ded99e64cf8da7161e720f1e8e842bb1f44c0d061581299ec2e721419cf8',
        'hex',
    ));
    expect(acc.address).toEqual('142JB9iSAzUDpPN1nEfSqqvEcFqWouHxA3');
  });

  test('should retrieve with TFC hex PEM string', ()=>{
    // eslint-disable-next-line max-len
    const str = '2d2d2d2d2d424547494e2050524956415445204b45592d2d2d2d2d0a4d48634341514545494f32476f7267715036306e7a5959564257595479506a734e424a375134767854646d7038596565503830456f416f4743437147534d34390a417745486f555144516741457278394433656a706e6d626e692b7441796932516a4a4b2f6f5a435131764f6c7361554c49386b447a357641546e7a664f44322f0a34696f6c5839617333655a54584c706a45313473304e554979775a33736d664d45673d3d0a2d2d2d2d2d454e442050524956415445204b45592d2d2d2d2d0a';
    const acc = TfcChainAccount.fromTfcEncodedPrivateKey(str);
    expect(acc.address).toEqual('12UaGfWuQTW6zU7RKkTaHbaG44WP89hA3a');
  });
});
