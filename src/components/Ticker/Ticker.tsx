import { useState } from 'react'
import { TickerVM } from '../../vm/TickerVM'
import styles from './styles.module.css'
import { useObservable } from '../../hooks'

export default function Ticker() {
  const vm = TickerVM.use()!

  const marketState = useObservable(vm.marketState$, vm.marketState$.value)
  
  const [sellPrice, setSellPrice] = useState(0)
  const [buyPrice, setBuyPrice] = useState(0)

  return (
    <div className={styles['ticker']}>
      <h1>{vm.instrument}</h1>
      <input type='number' className={styles['amount']}/>
      <div className={styles['price-set']}>
      
        <div className={styles['sell']}>
          <div
            style={{ cursor: 'pointer' }}
            className={styles['current']}
            onClick={() => setSellPrice(marketState.sellOnMarket)}>
              {marketState.sellOnMarket}
          </div>
          <input
            type='number'
            className={styles['price-input']}
            value={sellPrice}
            onChange={e => setSellPrice(Number(e.target.value) || sellPrice)}/>
          <button className={styles['price-button']}>Sell</button>
        </div>
      
        <span />

        <div className={styles['buy']}>
          <div
            style={{ cursor: 'pointer' }}
            className={styles['current']}
            onClick={() => setBuyPrice(marketState.buyOnMarket)}>
            {marketState.buyOnMarket}
          </div>
          <input
            type='number'
            className={styles['price-input']}
            value={buyPrice}
            onChange={e => setBuyPrice(Number(e.target.value) || buyPrice)}/>
          <button className={styles['price-button']}>Buy</button>
        </div>
      
      </div>
    </div>
  )
}
