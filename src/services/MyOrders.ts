import { BehaviorSubject } from 'rxjs'
import { Connection, MessageType } from '../connection'
import {
  filterUserOrders,
  getUserOrdersUpdates,
  scanUserOrders,
} from '../pipes'

export class MyOrdersService {
  readonly myOrders$: BehaviorSubject<Set<string>> = new BehaviorSubject(
    new Set()
  )

  constructor(private readonly _connection: Connection) {
    _connection.send({
      messageType: MessageType.GetMyOrders,
    })

    _connection.messages$
      .pipe(getUserOrdersUpdates())
      .subscribe(({ id, status }) => {
        this.onOrderStatusUpdate(id, status)
      })

    _connection.messages$
      .pipe(filterUserOrders(), scanUserOrders())
      .subscribe(this.myOrders$)
  }

  onOrderStatusUpdate(id: string, newStatus: string) {
    alert(`Order ${id} has updated the status to "${newStatus}"`)
  }

  cancel(id: string) {
    if (!this.myOrders$.value.has(id)) return

    this._connection.send({
      messageType: MessageType.CancelOrder,
      message: { id },
    })
  }
}
