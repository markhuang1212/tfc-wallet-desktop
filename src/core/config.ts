import {CoinCode} from './defines';

export default {
  [CoinCode.ETH]: {
    mainnet: {
      endpoint: 'https://mainnet.infura.io/v3/e8e5b9ad18ad4daeb0e01a522a989d66',
      contracts: {
        TFC_ERC20: '0xf40D8aBF838DF475E4d2F1363C659e584eD7CbDa',
      },
    },
    rinkeby: {
      endpoint: 'https://rinkeby.infura.io/v3/e8e5b9ad18ad4daeb0e01a522a989d66',
      contracts: {
        TFC_ERC20: '0x401Ef2b876Db2608e4A353800BBaD1E3e3Ea8B46',
      },
    },
  },
  [CoinCode.TFC_CHAIN]: {
    openbi: {
      endpoint: 'http://52.59.241.179:8011',
    },
    blockchainfs: {
      endpoint: 'http://103.253.11.146:8208',
    },
  },
};
