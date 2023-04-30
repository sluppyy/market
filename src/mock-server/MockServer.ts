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

const now = new Date()

const sides = ['buy', 'sell'] as const
const statuses = ['active', 'filled', 'rejected', 'cancelled'] as const
function randOrder() {
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
    Array(10).fill(0).map(randOrder),
    (order) => order.id
  )

  constructor(private readonly _connection: MockConnection) {
    _connection.outMessages$.subscribe(this.onMessage.bind(this))
  }

  onMessage(msg: Message) {
    if (msg.messageType == MessageType.GetAllOrders) {
      this.sendOrders([...this._orders.values()])
    }
  }

  send(msg: Message) {
    this._connection.outSend(msg)
  }

  sendOrders(orders: Order[]) {
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
    this.sendOrders([order])
  }
}
