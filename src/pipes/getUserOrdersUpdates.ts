import { Observable, combineLatest, filter, map, mergeMap, of, tap } from 'rxjs'
import { Message } from '../connection'
import { filterUserOrders } from './filterUserOrders'
import { scanUserOrders } from './scanUserOrders'
import { filterOrders } from './filterOrders'

export const getUserOrdersUpdates =
  () =>
  (
    input: Observable<Message>
  ): Observable<{ id: string; status: 'rejected' | 'filled' }> => {
    let updateReason: 1 | 2 = 1

    return combineLatest([
      input.pipe(
        filterUserOrders(),
        scanUserOrders(),
        tap((_) => (updateReason = 1))
      ),
      input.pipe(
        filterOrders(),
        mergeMap((msg) => of(...msg)),
        filter((order) => order.status != 'active'),
        tap((_) => {
          updateReason = 2
        })
      ),
    ]).pipe(
      filter(([ids, order]) => ids.has(order.id)),
      filter((_) => updateReason === 2),
      map(([_, { id, status }]) => ({
        id,
        status: status as any,
      }))
    )
  }
