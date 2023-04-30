import { tap } from 'rxjs'
import { Message, MessageType, MockConnection } from '../connection'
import { Order } from '../models'
import { groupBy } from '../utils'

let _id = 0
function id() {
  return (_id++).toString()
}

function randInt(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min) + min)
}

const sides = ['buy', 'sell'] as const
function randOrder() {
  const now = new Date()
  return new Order(
    id(),
    now,
    now,
    'active',
    sides[randInt(0, 2)],
    randInt(500, 3000),
    randInt(1000) * randInt(0, 1000),
    `instrument ${randInt(0, 5)}`
  )
}

export class MockServer {
  private readonly _orders: Map<string, Order> = groupBy(
    Array(5).fill(0).map(randOrder),
    (order) => order.id
  )
  private readonly _priceSubs = new Map<string, string[]>()
  //instrument - price
  private readonly _instrumentSellPrices: Map<string, number> = new Map()
  private readonly _instrumentBuyPrices: Map<string, number> = new Map()

  constructor(private readonly _connection: MockConnection) {
    _connection.outMessages$.subscribe(this.onMessage.bind(this))
  }

  async onMessage(msg: Message) {
    if (msg.messageType == MessageType.GetAllOrders) {
      this._sendOrders([...this._orders.values()])
    } else if (msg.messageType == MessageType.PlaceOrder) {
      const now = new Date()
      const order = new Order(
        id(),
        now,
        now,
        'active',
        msg.message.side,
        msg.message.price,
        msg.message.amount,
        msg.message.instrument
      )
      this._orders.set(order.id, order)
      await wait(500)
      this._sendOrders([order])
      await wait(randInt(0, 6) * 1000)

      if (randInt(0, 2)) {
        const filled = order.copy({ status: 'filled' })
        this._orders.set(filled.id, filled)
        this._sendOrders([filled])

        const instrument = msg.message.instrument
        this._setInstrumentSellPrices(instrument, msg.message.price)
        this._setInstrumentBuyPrices(instrument, msg.message.price)
        this._notifyPriceSubs(instrument)
      } else {
        const rejected = order.copy({ status: 'rejected' })
        this._orders.set(rejected.id, rejected)
        this._sendOrders([rejected])
      }
    } else if (msg.messageType == MessageType.Subscribe) {
      const id = this._addSub(msg.message)
      this.send({
        messageType: MessageType.SubscribeResult,
        message: { type: 'ok', subId: id },
      })
    } else if (msg.messageType == MessageType.Unsubscribe) {
      this._removeSub(msg.message.subId)
    }
  }

  private send(msg: Message) {
    this._connection.outSend(msg)
  }

  private _setInstrumentSellPrices(instrument: string, price: number) {
    this._instrumentSellPrices.set(
      instrument,
      this._instrumentSellPrices.get(instrument) ?? price
    )
  }

  private _setInstrumentBuyPrices(instrument: string, price: number) {
    this._instrumentBuyPrices.set(
      instrument,
      this._instrumentBuyPrices.get(instrument) ?? price
    )
  }

  private _sendOrders(orders: Order[]) {
    this.send({
      messageType: MessageType.Orders,
      message: orders.map((order) => ({
        id: order.id,
        amount: order.amount,
        changeTime: order.changeTime.toISOString(),
        creationTime: order.creationTime.toISOString(),
        instrument: order.instrument,
        price: order.price,
        side: order.side,
        status: order.status,
      })),
    })
  }

  private _addSub(instrument: string) {
    const subs = this._priceSubs.get(instrument) ?? []
    const subId = id()
    subs.push(subId)
    this._priceSubs.set(instrument, subs)
    return subId
  }

  private _removeSub(id: string) {
    const subs = [...this._priceSubs.keys()]
    subs.forEach((instrument) => {
      const subs = this._priceSubs.get(instrument)!
      this._priceSubs.set(
        instrument,
        subs.filter((subId) => subId != id)
      )
    })
  }

  private _notifyPriceSubs(instrument: string) {
    const subs = this._priceSubs.get(instrument) ?? []
    const sell = this._instrumentSellPrices.get(instrument) ?? 0
    const buy = this._instrumentBuyPrices.get(instrument) ?? 0

    subs.forEach((subId) => {
      this.send({
        messageType: MessageType.InstrumentPricesUpdate,
        message: {
          instrument,
          newBuy: buy,
          newSell: sell,
        },
      })
    })
  }

  addRandom(): void {
    const order = randOrder()
    this._orders.set(order.id, order)
    this._sendOrders([order])
  }
}

function wait(delay: number) {
  return new Promise((r) => setTimeout(r, delay))
}
