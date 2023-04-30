import { useRef, useState } from 'react'
import { TickerVM } from '../../vm/TickerVM'
import styles from './styles.module.css'
import { useObservable } from '../../hooks'
import { OrdersVM } from '../../vm'

interface Props {
  onDelete?: () => void
}

export default function Ticker({ onDelete }: Props) {
  const vm = TickerVM.use()!
  const ordersVm = OrdersVM.use()!

  const marketState = useObservable(vm.marketState$, vm.marketState$.value)
  
  const [amount, setAmount] = useState(0)
  const [sellPrice, setSellPrice] = useState(0)
  const [buyPrice, setBuyPrice] = useState(0)

  function onBuy() {
    if (amount == 0) return
    
    ordersVm.createOrder({
      amount: amount,
      instrument: vm.instrument,
      price: buyPrice,
      side: 'buy'
    })
  }

  function onSell() {
    if (amount == 0) return
    
    ordersVm.createOrder({
      amount: amount,
      instrument: vm.instrument,
      price: sellPrice,
      side: 'sell'
    })
  }

  return (
    <div className={styles['ticker']}>
      <div className={styles['header']}>
        <h1>{vm.instrument}</h1>
        <button onClick={onDelete}>Delete</button>
      </div>
      <input
        type='number'
        className={styles['amount']}
        value={amount}
        onChange={e => setAmount(Number(e.target.value) || 0)}/>
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
            onChange={e => setSellPrice(Number(e.target.value) || 0)}/>
          <button
            className={styles['price-button']}
            onClick={onSell}
          >
            Sell
          </button>
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
            onChange={e => setBuyPrice(Number(e.target.value) || 0)}/>
          <button
            className={styles['price-button']}
            onClick={onBuy}
          >
            Buy
          </button>
        </div>
      
      </div>
    </div>
  )
}
