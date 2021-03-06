import { EthereumChain, TfcChain, VsysChain } from "../core/blockchain"
import config from "../core/config"
import { CoinCode } from "../core/defines"
import { EthAccount, TfcChainAccount, Wallet } from "../core/wallet"
import { TxRequestInfo } from "../Types"
import { utils } from 'ethers'

class AccountFunctionsProvider {

    static shared = new AccountFunctionsProvider()

    ethChain = new EthereumChain(config[CoinCode.ETH].rinkeby.endpoint)
    tfcChain = new TfcChain(config[CoinCode.TFC_CHAIN]['openbi'].endpoint)
    vsysChain = new VsysChain()

    async getBalance(privKey: string, coinType: 'ETH' | 'BTC' | 'TFC', ercCoin?: 'ETH' | 'TFC' | 'USDT') {
        if (coinType === 'ETH' && ercCoin === 'ETH') {
            const account = new EthAccount(Buffer.from(privKey, 'hex'))
            const balance = await this.ethChain.getBalance(account)
            const balance_formatted = utils.formatUnits(balance.toString(), 18)
            return balance_formatted
        }
        if (coinType === 'ETH' && ercCoin === 'TFC') {
            const account = new EthAccount(Buffer.from(privKey, 'hex'))
            const contract_address = config[CoinCode.ETH].rinkeby.contracts.TFC_ERC20
            const balance = await this.ethChain.erc20BalanceOf(contract_address, account)
            const balance_formatted = utils.formatUnits(balance.toString(), 18)
            return balance_formatted
        }
        if (coinType === 'TFC') {
            const account = new TfcChainAccount(Buffer.from(privKey, 'hex'))
            const balance = await this.tfcChain.getBalance(account)
            const balance_formatted = utils.formatUnits(balance.toString(), 18)
            return balance_formatted
        }
        return '0'
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
                event.on('error', e => {
                    rej(e)
                })
            })
        }
        if (txInfo.coinType === 'TFC') {
            return new Promise<string>((res, rej) => {
                const account = new TfcChainAccount(Buffer.from(txInfo.sender_privKey, 'hex'))
                const event = this.tfcChain.transfer(txInfo.receiver_address, txInfo.amount, account)
                event.on('pending', txHash => {
                    res(txHash)
                })
                event.on('error', e => {
                    rej(e)
                })
            })
        }
    }

    swapTfc(from_privKey: string, to_privKey: string, amount: bigint, endpoint?: 'openbi' | 'blockchainfs') {
        return new Promise<string>((res, rej) => {
            let tfcAccount!: TfcChainAccount
            let ercAccount!: EthAccount

            try {
                tfcAccount = Wallet.getAccount(CoinCode.TFC_CHAIN, Buffer.from(from_privKey, 'hex'))
                ercAccount = Wallet.getAccount(CoinCode.ETH, Buffer.from(to_privKey, 'hex'))
            } catch (e) {
                rej(e)
                return
            }

            const event = this.tfcChain.exchangeToErc20(tfcAccount, ercAccount, amount)
            event.on('transactionFeePaid', txHash => {
                res(txHash)
            }).catch(e => {
                rej(e)
            })
        })
    }
}

export default AccountFunctionsProvider