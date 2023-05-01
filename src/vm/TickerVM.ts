import { createContext, useContext } from 'react'
import { Connection, MessageType } from '../connection'
import { BehaviorSubject } from 'rxjs'
import { filterInstrumentPricesUpdate } from '../pipes/filterInstrumentPricesUpdate'
import { filterSubscriptionResult } from '../pipes'
import { ViewModel } from './ViewModel'

interface MarketState {
  buyOnMarket: number
  sellOnMarket: number
}

export class TickerVM extends ViewModel {
  readonly marketState$ = new BehaviorSubject<MarketState>({
    buyOnMarket: 0,
    sellOnMarket: 0,
  })

  private _subId?: string

  constructor(
    private readonly _connection: Connection,
    readonly instrument: string
  ) {
    super()
  }

  onInit(): void {
    this.addSub(
      this._connection.messages$
        .pipe(filterInstrumentPricesUpdate(this.instrument))
        .subscribe(({ newBuy, newSell }) =>
          this.marketState$.next({
            buyOnMarket: newBuy,
            sellOnMarket: newSell,
          })
        )
    )

    this.addSub(
      this._connection.messages$
        .pipe(filterSubscriptionResult())
        .subscribe((msg) => {
          if (msg.type == 'ok') {
            this._subId = msg.subId
          } else {
            //TODO add error handler
          }
        })
    )

    this._connection.send({
      messageType: MessageType.Subscribe,
      message: this.instrument,
    })
  }

  onDispose() {
    super.onDispose()

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
