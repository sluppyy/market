import { Subject } from 'rxjs'
import { Connection, Message } from './connection'

export class MockConnection implements Connection {
  messages$ = new Subject<Message>()
  readonly outMessages$ = new Subject<Message>()

  private _isConnected = false
  get isConnected() {
    return this._isConnected
  }

  connect(): void {
    this._isConnected = true
    if (this.messages$.closed) {
      this.messages$ = new Subject()
    }
  }

  disconnect(): void {
    this._isConnected = true
    this.messages$.complete()
  }

  send(message: Message): void {
    if (!this._isConnected) return
    this.outMessages$.next(message)
  }

  outSend(message: Message) {
    if (!this._isConnected) return
    this.messages$.next(message)
  }
}
