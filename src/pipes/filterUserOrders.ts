import { Observable, filter, map } from 'rxjs'
import {
  Message,
  MessageMyOrders,
  MessageOrders,
  MessageType,
} from '../connection'

export const filterUserOrders = () => (input: Observable<Message>) =>
  input.pipe(
    filter((msg) => msg.messageType == MessageType.MyOrders),
    map((msg) => {
      return (msg as MessageMyOrders).message
    })
  )
