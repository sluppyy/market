import { createContext, useContext } from 'react'
import { Connection, MessageType } from '../connection'
import { filterOrders, scanOrders } from '../pipes'
import { BehaviorSubject, map } from 'rxjs'
import { Order } from '../models'
import { ViewModel } from './ViewModel'

interface CreateOrder {
  side: 'buy' | 'sell'
  price: number
  amount: number
  instrument: string
}

export class OrdersVM extends ViewModel {
  readonly orders$ = new BehaviorSubject<Order[]>([])

  constructor(private readonly _connection: Connection) {
    super()
  }

  onInit() {
    this.addSub(
      this._connection.messages$
        .pipe(
          filterOrders(),
          scanOrders(),
          map((map) => [...map.values()])
        )
        .subscribe(this.orders$)
    )

    this._connection.send({ messageType: MessageType.GetAllOrders })
  }

  createOrder(data: CreateOrder) {
    this._connection.send({
      messageType: MessageType.PlaceOrder,
      message: data,
    })
  }

  exportOrdersAsCvs() {
    return this.orders$.value.reduce(
      (acc, cur) =>
        acc +
        `${cur.id},` +
        `${cur.creationTime.getTime()},` +
        `${cur.changeTime.getTime()},` +
        `${cur.status},` +
        `${cur.side},` +
        `${cur.price},` +
        `${cur.amount},` +
        `${cur.instrument};\n`,
      ''
    )
  }

  static Context = createContext<OrdersVM | null>(null)
  static use() {
    return useContext(this.Context)
  }
}
