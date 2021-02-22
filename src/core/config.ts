import {CoinCode} from './defines';

export default {
  [CoinCode.ETH]: {
    rinkeby: {
      endpoint: 'https://rinkeby.infura.io/v3/e8e5b9ad18ad4daeb0e01a522a989d66',
      contracts: {
        TFC_ERC20: '0x401Ef2b876Db2608e4A353800BBaD1E3e3Ea8B46',
      },
    },
  },
  [CoinCode.TFC_CHAIN]: {
    9523: {
      endpoint: 'http://52.59.241.179:8011',
    },
  },
};
