import { ReactNode, useMemo, useState } from 'react'
import { useObservable } from '../../hooks'
import { OrdersVM } from '../../vm'
import styles from './styles.module.css'
import { MyOrdersVM } from '../../vm/MyOrdersVM'


export default function OrdersTable() {
  const vm = OrdersVM.use()!
  const myOrdersVm = MyOrdersVM.use()!

  const orders = useObservable(vm.orders$, vm.orders$.value)
  const myOrders = useObservable(myOrdersVm.myOrders$, myOrdersVm.myOrders$.value)

  const [sortField, setSortField] = useState('Id')
  const [sortType, setSortType] = useState('dec')

  const sorted = useMemo(
    () => [...orders].sort(
      (a, b) => {
        const aField = (a as any)[sortField]
        const bField = (b as any)[sortField]

        return sortType == 'dec' 
          ? (aField > bField) ? 1 : -1
          : (aField > bField) ? -1 : 1
      }
    ), 
    [sortField, sortType, orders]
  )
  function onFieldClick(field: string) {
    if (field == sortField) {
      setSortType(sortType == 'dec' ? 'desc' : 'dec')
    } else {
      setSortType('dec')
      setSortField(field)
    }
  }

  return (
    <table className={styles['table']}>
      <thead>
        <tr>
          <th><ST
            name='id'
            sortField={sortField}
            sortType={sortType}
            onClick={onFieldClick}>Id</ST></th>
          <th><ST
            name='creationTime'
            sortField={sortField}
            sortType={sortType}
            onClick={onFieldClick}>Creation time</ST></th>
          <th><ST
            name='changeTime'
            sortField={sortField}
            sortType={sortType}
            onClick={onFieldClick}>Change time</ST></th>
          <th><ST
            name='status'
            sortField={sortField}
            sortType={sortType}
            onClick={onFieldClick}>Status</ST></th>
          <th><ST
            name='side'
            sortField={sortField}
            sortType={sortType}
            onClick={onFieldClick}>Side</ST></th>
          <th><ST
            name='price'
            sortField={sortField}
            sortType={sortType}
            onClick={onFieldClick}>Price</ST></th>
          <th><ST
            name='amount'
            sortField={sortField}
            sortType={sortType}
            onClick={onFieldClick}>Amount</ST></th>
          <th><ST
            name='instrument'
            sortField={sortField}
            sortType={sortType}
            onClick={onFieldClick}>Instrument</ST></th>
        </tr>
      </thead>
      <tbody>{sorted.map(order => 
        <tr key={order.id}>
          <td>{order.id}</td>
          <td>{order.creationTime.toISOString()}</td>
          <td>{order.changeTime.toISOString()}</td>
          <td className={styles[order.status]}>{order.status}</td>
          <td className={styles[order.side]}>{order.side}</td>
          <td>{order.price}</td>
          <td>{order.amount}</td>
          <td>{order.instrument}</td>
          {myOrders.has(order.id) && order.status == 'active' && 
            <td><button onClick={() => myOrdersVm.cancelOrder(order.id)}><img
            src="/icons/cancel.svg"
            alt="cancel"
            width={20}
            height={20}/></button></td>}
        </tr>)}
      </tbody>
    </table>
  )
}

interface SortableTitleProps {
  name: string
  children: string
  sortField: string
  sortType: string
  onClick: (name: string) => void
} 
//SortableTitle
function ST({ 
  children, 
  sortField, 
  sortType, 
  onClick,
  name
}: SortableTitleProps) {
  return <span onClick={() => onClick(name)}>{children}{
    name == sortField 
      ? ((sortType == 'dec') ? '▾' : '▴')
      : null
  }</span>
}