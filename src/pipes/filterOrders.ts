import { Observable, filter, map } from 'rxjs'
import { Message, MessageOrders, MessageType } from '../connection'
import { Order } from '../models'

export function filterOrders() {
  return function filterOrders(
    input: Observable<Message>
  ): Observable<Order[]> {
    return input.pipe(
      filter((msg) => msg.messageType == MessageType.Orders),
      map((msg) => {
        return (msg as MessageOrders).message.map(
          (data) =>
            new Order(
              data.id,
              new Date(data.creationTime),
              new Date(data.changeTime),
              data.status,
              data.side,
              data.price,
              data.amount,
              data.instrument
            )
        )
      })
    )
  }
}
