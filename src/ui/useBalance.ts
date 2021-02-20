const balanceCached = new Map() as Map<string, bigint>
import crypto from 'crypto'
import { useEffect, useState } from 'react'

function makeHashedKey(privKey: string, coinType: 'BTC' | 'ETH' | 'TFC', ercCoin?: 'ETH' | 'TFC' | 'USDT') {
    const hash = crypto.createHash('sha-256')
    hash.push(privKey)
    hash.push(coinType)
    hash.push(ercCoin)
    return hash.digest().toString('hex')
}

async function getBalance(privKey: string, coinType: 'BTC' | 'ETH' | 'TFC', ercCoin?: 'ETH' | 'TFC' | 'USDT') {
    return 100n
}

function useBalance(privKey: string, coinType: 'BTC' | 'ETH' | 'TFC', ercCoin?: 'ETH' | 'TFC' | 'USDT') {

    const [balance, setBalance] = useState(100n)

    return balance

}

export default useBalance