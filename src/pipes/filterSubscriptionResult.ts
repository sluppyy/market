import { Observable, filter, map } from 'rxjs'
import { Message, MessageSubscribeResult, MessageType } from '../connection'

export const filterSubscriptionResult = () => (input: Observable<Message>) =>
  input.pipe(
    filter((msg) => msg.messageType === MessageType.SubscribeResult),
    map((msg) => (msg as MessageSubscribeResult).message)
  )
