import { Subject } from 'rxjs'

export interface Connection {
  readonly messages$: Subject<Message>

  readonly isConnected: boolean

  connect(): void
  disconnect(): void

  send(message: Message): void
}

export enum MessageType {
  GetAllOrders = 1,
  Orders,

  PlaceOrder,
  CancelOrder,

  Subscribe,
  SubscribeResult,
  Unsubscribe,
  InstrumentPricesUpdate,
}

export type Message =
  | MessageGetAllOrders
  | MessageOrders
  | MessagePlaceOrder
  | MessageCancelOrder
  | MessageSubscribe
  | MessageSubscribeResult
  | MessageUnsubscribe
  | MessageInstrumentPricesUpdate

export type MessageGetAllOrders = { messageType: MessageType.GetAllOrders }
export type MessageOrders = {
  messageType: MessageType.Orders
  message: {
    id: string
    creationTime: string
    changeTime: string
    status: 'active' | 'filled' | 'rejected' | 'cancelled'
    side: 'sell' | 'buy'
    price: number
    amount: number
    instrument: string
  }[]
}
export type MessagePlaceOrder = {
  messageType: MessageType.PlaceOrder
  message: {
    side: 'buy' | 'sell'
    price: number
    amount: number
    instrument: string
  }
}
export type MessageCancelOrder = {
  messageType: MessageType.CancelOrder
  message: {
    id: string
  }
}
export type MessageSubscribe = {
  messageType: MessageType.Subscribe
  message: string
}
export type MessageSubscribeResult = {
  messageType: MessageType.Subscribe
  message:
    | {
        type: 'ok'
        subId: string
      }
    | {
        type: 'error'
        code: string
      }
}
export type MessageUnsubscribe = {
  messageType: MessageType.Unsubscribe
  message: {
    subId: string
  }
}
export type MessageInstrumentPricesUpdate = {
  messageType: MessageType.InstrumentPricesUpdate
  message: {
    instrument: string
    newSell: number
    newBuy: number
  }
}
