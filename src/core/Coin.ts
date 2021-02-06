interface Coin {
    coinFullName: string
    coinAbbr: string

    coinPrecision: number // precision = 18 for erc-20 coins
    keySize: number // key-size = 128 for erc-20 coins
}

export default Coin