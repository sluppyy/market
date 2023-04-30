import { useState } from 'react'
import { TickerVM } from '../../vm/TickerVM'
import styles from './styles.module.css'

export default function Ticker() {
  const vm = TickerVM.use()!

  const [sellPrice, setSellPrice] = useState(0)
  const [buyPrice, setBuyPrice] = useState(0)
  const [sellCurrent, setSellCurrent] = useState(8.89)
  const [buyCurrent, setBuyCurrent] = useState(8.89)

  return (
    <div className={styles['ticker']}>
      <input className={styles['instrument']} />
      <input type='number' className={styles['amount']}/>
      <div className={styles['price-set']}>
      
        <div className={styles['sell']}>
          <div
            style={{ cursor: 'pointer' }}
            className={styles['current']}
            onClick={() => setSellPrice(sellCurrent)}>
              {sellCurrent}
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
            onClick={() => setBuyPrice(buyCurrent)}>
            {buyCurrent}
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
