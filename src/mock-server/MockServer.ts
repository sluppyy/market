import { Message, MockConnection } from '../connection'

export class MockServer {
  constructor(private readonly _connection: MockConnection) {
    _connection.outMessages$.subscribe(this.onMessage)
  }

  onMessage(msg: Message) {}

  send(msg: Message) {
    this._connection.outSend(msg)
  }
}
