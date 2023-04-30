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
const statuses = ['active', 'filled', 'rejected', 'cancelled'] as const
function randOrder() {
  const now = new Date()
  return new Order(
    id(),
    now,
    now,
    statuses[randInt(0, 4)],
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
  //instrument - price
  private readonly instrumentSellPrices: Map<string, number> = new Map()
  private readonly instrumentBuyPrices: Map<string, number> = new Map()

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
      } else {
        const rejected = order.copy({ status: 'rejected' })
        this._orders.set(rejected.id, rejected)
        this._sendOrders([rejected])
      }
    }
  }

  send(msg: Message) {
    this._connection.outSend(msg)
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

  addRandom(): void {
    const order = randOrder()
    this._orders.set(order.id, order)
    this._sendOrders([order])
  }
}

function wait(delay: number) {
  return new Promise((r) => setTimeout(r, delay))
}
