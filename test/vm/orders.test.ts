import { Message, MessageType, MockConnection } from '../../src/connection'
import { Order } from '../../src/models'
import { OrdersVM } from '../../src/vm'

let _id = 0
function id() {
  return (_id++).toString()
}

function createOrder(data: Partial<Omit<Order, 'copy'>> = {}) {
  let now = new Date()

  return new Order(
    data.id ?? id(),
    data.creationTime ?? now,
    data.changeTime ?? now,
    data.status ?? 'active',
    data.side ?? 'buy',
    data.price ?? Math.floor(Math.random() * 999 + 1),
    data.amount ?? 100_000,
    data.instrument ?? 'instrument'
  )
}

function mapOrderToMessage(order: Order) {
  return {
    ...order,
    changeTime: order.changeTime.toISOString(),
    creationTime: order.creationTime.toISOString(),
  }
}

describe('vm.orders', () => {
  test('create', () => {
    const connection = new MockConnection()
    connection.connect()
    const vm = new OrdersVM(connection)
  })

  test('listen orders', async () => {
    const connection = new MockConnection()
    connection.connect()
    const vm = new OrdersVM(connection)

    expect(vm.orders$.value).toEqual([])

    const orders = Array(10)
      .fill(0)
      .map((_) => createOrder())
    connection.outSend({
      messageType: MessageType.Orders,
      message: orders.map(mapOrderToMessage),
    })
    await wait(1)

    expect(vm.orders$.value).toEqual(orders)
    connection.disconnect()
  })

  test('send create and cancel order messages', async () => {
    const connection = new MockConnection()
    connection.connect()
    const vm = new OrdersVM(connection)

    const msgs: Message[] = []
    connection.outMessages$.subscribe(msgs.push.bind(msgs))

    vm.createOrder({ amount: 1, instrument: 'i', price: 1, side: 'sell' })
    vm.createOrder({ amount: 2, instrument: 'i2', price: 12, side: 'buy' })
    vm.cancelOrder('1')
    vm.cancelOrder('2')
    await wait(1)

    expect(msgs).toEqual([
      {
        messageType: MessageType.PlaceOrder,
        message: { amount: 1, instrument: 'i', price: 1, side: 'sell' },
      },
      {
        messageType: MessageType.PlaceOrder,
        message: { amount: 2, instrument: 'i2', price: 12, side: 'buy' },
      },
      {
        messageType: MessageType.CancelOrder,
        message: { id: '1' },
      },
      {
        messageType: MessageType.CancelOrder,
        message: { id: '2' },
      },
    ])

    connection.disconnect()
  })
})

function wait(delay: number) {
  return new Promise((r) => setTimeout(r, delay))
}
