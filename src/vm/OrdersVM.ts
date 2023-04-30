import { createContext, useContext } from 'react'
import { Connection, MessageType } from '../connection'
import { filterOrders, scanOrders } from '../pipes'
import { BehaviorSubject, map, tap } from 'rxjs'
import { Order } from '../models'

interface CreateOrder {
  side: 'buy' | 'sell'
  price: number
  amount: number
  instrument: string
}

export class OrdersVM {
  constructor(private readonly _connection: Connection) {
    this._connection.messages$
      .pipe(
        filterOrders(),
        scanOrders(),
        map((map) => [...map.values()])
      )
      .subscribe(this.orders$)
    _connection.send({ messageType: MessageType.GetAllOrders })
  }
  readonly orders$ = new BehaviorSubject<Order[]>([])

  createOrder(data: CreateOrder) {
    this._connection.send({
      messageType: MessageType.PlaceOrder,
      message: data,
    })
  }

  cancelOrder(id: string) {
    this._connection.send({
      messageType: MessageType.CancelOrder,
      message: { id },
    })
  }

  static Context = createContext<OrdersVM | null>(null)
  static use() {
    return useContext(this.Context)
  }
}
