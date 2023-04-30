import { createContext, useContext } from 'react'
import { Connection, MessageType } from '../connection'
import { BehaviorSubject, Subscription, tap } from 'rxjs'
import { filterInstrumentPricesUpdate } from '../pipes/filterInstrumentPricesUpdate'
import { filterSubscriptionResult } from '../pipes'

interface MarketState {
  buyOnMarket: number
  sellOnMarket: number
}

export class TickerVM {
  readonly marketState$: BehaviorSubject<MarketState> = new BehaviorSubject({
    buyOnMarket: 0,
    sellOnMarket: 0,
  })

  private _instrumentSub?: Subscription
  private _subId?: string

  constructor(
    private readonly _connection: Connection,
    readonly instrument: string
  ) {
    _connection.send({
      messageType: MessageType.Subscribe,
      message: instrument,
    })

    this._instrumentSub = _connection.messages$
      .pipe(filterInstrumentPricesUpdate(instrument))
      .subscribe(({ newBuy, newSell }) =>
        this.marketState$.next({
          buyOnMarket: newBuy,
          sellOnMarket: newSell,
        })
      )

    _connection.messages$.pipe(filterSubscriptionResult()).subscribe((msg) => {
      if (msg.type == 'ok') {
        this._subId = msg.subId
      } else {
        //TODO add error handler
      }
    })
  }

  dispose() {
    if (this._instrumentSub) this._instrumentSub.unsubscribe()

    if (this._subId)
      this._connection.send({
        messageType: MessageType.Unsubscribe,
        message: { subId: this._subId },
      })
  }

  static Context = createContext<TickerVM | null>(null)
  static use() {
    return useContext(this.Context)
  }
}
