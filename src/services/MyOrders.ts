import { Connection } from '../connection'
import { filterUserOrders, scanUserOrders } from '../pipes'

export class MyOrdersServer {
  constructor(private readonly _connection: Connection) {
    _connection.messages$.pipe(filterUserOrders(), scanUserOrders())
  }

  onOrderStatusUpdate(id: string, newStatus: string) {
    alert(`Order ${id} has updated the status to "${newStatus}"`)
  }
}
