import { Observable, filter, map } from 'rxjs'
import {
  Message,
  MessageInstrumentPricesUpdate,
  MessageType,
} from '../connection'

export const filterInstrumentPricesUpdate =
  (instrument: string) => (input: Observable<Message>) =>
    input.pipe(
      filter(
        (msg) =>
          msg.messageType == MessageType.InstrumentPricesUpdate &&
          msg.message.instrument == instrument
      ),
      map((msg) => (msg as MessageInstrumentPricesUpdate).message)
    )
