import { Observable, filter, map } from 'rxjs'
import { Message, MessageMarketData, MessageType } from '../connection'

export const filterInstrumentDataUpdate =
  (instrument: string) => (input: Observable<Message>) =>
    input.pipe(
      filter(
        (msg) =>
          msg.messageType == MessageType.MarketData &&
          msg.message.instrument == instrument
      ),
      map((msg) => (msg as MessageMarketData).message)
    )
