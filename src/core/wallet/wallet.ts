import {Bip44Root, Coin} from './bip44';
import {EthAddress} from './eth.bip44';

export interface CoinType {
  index: number,
  hexa: string,
  symbol: string
  name: string,
}

export class CoinTypes {
  static readonly ETH: CoinType = {
    index: 60,
    hexa: '0x8000003c',
    symbol: 'ETH',
    name: 'Ether',
  };
}


export class Wallet extends Bip44Root {
  readonly coins: { [coinIndex: number]: Coin };

  constructor(
    readonly seed: Buffer,
  ) {
    super();
    this.coins = {
      [CoinTypes.ETH.index]: new Coin(
          this.seed, this, CoinTypes.ETH.index, EthAddress,
      ),
    };
  }
}
