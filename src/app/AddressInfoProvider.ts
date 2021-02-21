import { EthereumChain } from "../core/blockchain"
import { Endpoints } from "../core/blockchain/defines"
import { EthAccount } from "../core/wallet"

class AddressInfoProvider {

    static shared = new AddressInfoProvider()

    ethChain = new EthereumChain(Endpoints['60'].rinkeby)

    async getBalance(privKey: string, coinType: 'ETH' | 'BTC' | 'TFC', ercCoin?: 'ETH' | 'TFC' | 'USDT') {
        if (coinType === 'ETH' && ercCoin === 'ETH') {
            const account = new EthAccount(Buffer.from(privKey, 'hex'))
            const balance = await this.ethChain.getBalance(account)
            return BigInt(balance.toString())
        }
        return 0n
    }
}

export default AddressInfoProvider