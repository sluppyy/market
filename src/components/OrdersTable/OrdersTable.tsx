import { useObservable } from '../../hooks'
import { OrdersVM } from '../../vm'
import styles from './styles.module.css'

export default function OrdersTable() {
  const vm = OrdersVM.use()!
  const orders = useObservable(vm.orders$, vm.orders$.value)

  return (
    <table className={styles['table']}>
      <thead>
        <tr>
          <th>Id</th>
          <th>Creation time</th>
          <th>Change time</th>
          <th>Status</th>
          <th>Side</th>
          <th>Price</th>
          <th>Amount</th>
          <th>Instrument</th>
        </tr>
      </thead>
      <tbody>{orders.map(order => 
        <tr key={order.id}>
          <td>{order.id}</td>
          <td>{order.creationTime.toISOString()}</td>
          <td>{order.changeTime.toISOString()}</td>
          <td className={styles[order.status]}>{order.status}</td>
          <td className={styles[order.side]}>{order.side}</td>
          <td>{order.price}</td>
          <td>{order.amount}</td>
          <td>{order.instrument}</td>
        </tr>)}
      </tbody>
    </table>
  )
}
