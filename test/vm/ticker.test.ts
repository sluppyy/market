import { Message, MessageType, MockConnection } from '../../src/connection'
import { TickerVM } from '../../src/vm'

let _id = 0
function id() {
  return (_id++).toString()
}

describe('vm.ticker', () => {
  let connection: MockConnection
  beforeEach(() => {
    connection = new MockConnection()
    connection.connect()
  })
  afterEach(() => {
    connection.disconnect()
  })

  test('create', async () => {
    const msgs: Message[] = []
    connection.outMessages$.subscribe(msgs.push.bind(msgs))

    const vm = new TickerVM(connection, '1')
    vm.onInit()
    await wait(1)

    expect(msgs).toEqual([{ messageType: MessageType.Subscribe, message: '1' }])
  })

  test('on new value', async () => {
    const vm = new TickerVM(connection, '1')
    vm.onInit()

    expect(vm.marketState$.value).toEqual({
      buyOnMarket: 0,
      sellOnMarket: 0,
      position: 0,
    })

    connection.outSend({
      messageType: MessageType.MarketData,
      message: {
        instrument: '1',
        newBuy: 10,
        newSell: 10,
        newPosition: 1,
      },
    })
    await wait(1)
    expect(vm.marketState$.value).toEqual({
      buyOnMarket: 10,
      sellOnMarket: 10,
      position: 1,
    })
  })

  test('unsubscribe after dispose', async () => {
    const msgs: Message[] = []
    connection.outMessages$.subscribe(msgs.push.bind(msgs))

    const vm = new TickerVM(connection, '1')
    vm.onInit()

    const subId = id()
    expect(msgs).toEqual([{ messageType: MessageType.Subscribe, message: '1' }])
    connection.outSend({
      messageType: MessageType.SubscribeResult,
      message: {
        type: 'ok',
        subId,
      },
    })
    msgs.pop()

    vm.onDispose()
    await wait(1)

    expect(msgs).toEqual([
      {
        messageType: MessageType.Unsubscribe,
        message: { subId },
      },
    ])
  })

  test('take first sub', async () => {
    const msgs: Message[] = []
    connection.outMessages$.subscribe(msgs.push.bind(msgs))

    const vm = new TickerVM(connection, '1')
    vm.onInit()

    const subId = id()
    expect(msgs).toEqual([{ messageType: MessageType.Subscribe, message: '1' }])
    connection.outSend({
      messageType: MessageType.SubscribeResult,
      message: {
        type: 'ok',
        subId,
      },
    })
    connection.outSend({
      messageType: MessageType.SubscribeResult,
      message: {
        type: 'ok',
        subId: id(),
      },
    })
    msgs.pop()

    vm.onDispose()
    await wait(1)

    expect(msgs).toEqual([
      {
        messageType: MessageType.Unsubscribe,
        message: { subId },
      },
    ])
  })
})

function wait(delay: number) {
  return new Promise((r) => setTimeout(r, delay))
}
