const balanceCached = new Map() as Map<string, bigint>
import crypto from 'crypto'
import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
import { BalanceRequestInfo, Coin, Erc20Coin, TfcChainEndpoint, TxRequestInfo } from '../Types'

function useBalance({ coinType, privKey, ercCoin, endpoint }: BalanceRequestInfo) {

    const [balance, setBalance] = useState<string | undefined>(undefined)
    const [cache, setCache] = useState<(BalanceRequestInfo & { balance: string })[]>([])

    useEffect(() => {

        if (privKey === '') {
            setBalance(undefined)
            return
        }

        const cacheObj = cache.find(v => (
            v.coinType === coinType &&
            v.privKey === privKey &&
            (coinType !== 'TFC' || v.endpoint === endpoint) &&
            (coinType !== 'ETH' || v.ercCoin === ercCoin)
        ))

        if (cacheObj) {
            setBalance(cacheObj.balance)
        } else {
            setBalance(undefined)
            ipcRenderer.invoke('get-balance', { coinType, privKey, ercCoin, endpoint }).then(b => {
                cache.push({
                    coinType, privKey, ercCoin, endpoint, balance: b
                })
                setBalance(b)
            })
        }
    }, [coinType, privKey, ercCoin, endpoint])

    return balance

}

export default useBalance