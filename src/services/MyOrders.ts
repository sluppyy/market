import { Connection, MessageType } from '../connection'
import { getUserOrdersUpdates } from '../pipes'

export class MyOrdersServer {
  constructor(connection: Connection) {
    connection.send({
      messageType: MessageType.GetMyOrders,
    })

    connection.messages$
      .pipe(getUserOrdersUpdates())
      .subscribe(({ id, status }) => {
        this.onOrderStatusUpdate(id, status)
      })
  }

  onOrderStatusUpdate(id: string, newStatus: string) {
    alert(`Order ${id} has updated the status to "${newStatus}"`)
  }
}
