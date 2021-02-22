import { EthereumChain } from "../core/blockchain"
import { Endpoints } from "../core/blockchain/defines"
import { EthAccount } from "../core/wallet"
import { TxRequestInfo } from "../Types"

class AccountFunctionsProvider {

    static shared = new AccountFunctionsProvider()

    ethChain = new EthereumChain(Endpoints['60'].rinkeby)

    async getBalance(privKey: string, coinType: 'ETH' | 'BTC' | 'TFC', ercCoin?: 'ETH' | 'TFC' | 'USDT') {
        if (coinType === 'ETH' && ercCoin === 'ETH') {
            const account = new EthAccount(Buffer.from(privKey, 'hex'))
            const balance = await this.ethChain.getBalance(account)
            return BigInt(balance.toString())
        }
        if (coinType === 'ETH' && ercCoin === 'TFC') {
            
        }
        return 0n
    }

    async getTransactions(pubKey: string, coinType: 'ETH' | 'BTC' | 'TFC', ercCoin?: 'ETH' | 'TFC' | 'USDT') {
        if (coinType === 'ETH' && ercCoin === 'ETH') {
            const txs = await this.ethChain.getETHTransferRecordList(pubKey)
            return txs
        }
        return []
    }

    transfer(txInfo: TxRequestInfo) {
        if (txInfo.coinType === 'ETH' && txInfo.ercCoin === 'ETH') {
            return new Promise<string>((res, rej) => {
                const account = new EthAccount(Buffer.from(txInfo.sender_privKey, 'hex'))
                const event = this.ethChain.transfer(txInfo.receiver_address, txInfo.amount, account)
                event.on('pending', (txHash: string) => {
                    res(txHash)
                })
                event.on('error', () => {
                    rej()
                })
            })
        }
    }
}

export default AccountFunctionsProvider