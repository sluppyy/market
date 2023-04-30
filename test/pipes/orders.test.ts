import { Order } from '../../src/models'
import { Observable, lastValueFrom, of, tap } from 'rxjs'
import { groupBy } from '../../src/utils'
import { getUserOrdersUpdates, scanOrders } from '../../src/pipes'
import { Message, MessageType } from '../../src/connection'

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

function groupOrders(orders: Order[]) {
  return groupBy(orders, (order) => order.id)
}

function testScan() {
  describe('scan', () => {
    test('empty', async () => {
      const input = of()
      const output = input.pipe(scanOrders())

      const last = await lastValueFrom(output, { defaultValue: new Map() })

      expect(last).toEqual(new Map())
    })

    test('one order', async () => {
      const orders = [createOrder()]

      const input = of(orders)
      const output = input.pipe(scanOrders())

      const last = await lastValueFrom(output)

      expect(last).toEqual(groupOrders(orders))
    })

    test('many orders one emit', async () => {
      const orders = [createOrder(), createOrder(), createOrder()]

      const input = of(orders)
      const output = input.pipe(scanOrders())

      const last = await lastValueFrom(output)

      expect(last).toEqual(groupOrders(orders))
    })

    test('many emits one equal order', async () => {
      const orders = [createOrder().copy({ amount: 1 })]

      const input = of(
        ...Array(10)
          .fill(0)
          .map((_) => [createOrder().copy({ id: orders[0].id })]),
        orders
      )
      const output = input.pipe(scanOrders())

      const last = await lastValueFrom(output)

      expect(last).toEqual(groupOrders(orders))
    })

    test('many orders many emits', async () => {
      const orders = Array(10)
        .fill(0)
        .map((_) =>
          Array(10)
            .fill(0)
            .map((_) => createOrder())
        )
      const expected: Map<string, Order> = new Map()
      orders.forEach((arr) => {
        arr.forEach((order) => {
          expected.set(order.id, order)
        })
      })
      const input = of(...orders)
      const output = input.pipe(scanOrders())
      const last = await lastValueFrom(output)

      expect(last).toEqual(expected)
    })
  })

  describe('get user orders update', () => {
    test('empty', async () => {
      const input = of()
      const output = input.pipe(getUserOrdersUpdates())

      const last = await lastValueFrom(output, { defaultValue: null })
      expect(last).toEqual(null)
    })

    test('emit only orders', async () => {
      const messages: Message[] = [
        { messageType: MessageType.MyOrders, message: ['1', '2', '3'] },
      ]
      const input: Observable<Message> = of(...messages)
      const output = input.pipe(getUserOrdersUpdates())

      const last = await lastValueFrom(output, { defaultValue: null })
      expect(last).toEqual(null)
    })

    test('emit only update', async () => {
      const messages: Message[] = [
        {
          messageType: MessageType.Orders,
          message: [createOrder().copy({ status: 'filled' }) as any],
        },
      ]
      const input: Observable<Message> = of(...messages)
      const output = input.pipe(getUserOrdersUpdates())

      const last = await lastValueFrom(output, { defaultValue: null })
      expect(last).toEqual(null)
    })

    test('normal', async () => {
      const messages: Message[] = [
        {
          messageType: MessageType.MyOrders,
          message: ['1'],
        },
        {
          messageType: MessageType.Orders,
          message: [createOrder().copy({ status: 'filled', id: '1' }) as any],
        },
      ]
      const input: Observable<Message> = of(...messages)
      const output = input.pipe(getUserOrdersUpdates())

      const last = await lastValueFrom(output)
      expect(last).toEqual({ id: '1', status: 'filled' })
    })
  })
}

describe('pipes.orders', () => {
  testScan()
})
