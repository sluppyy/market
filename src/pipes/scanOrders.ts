import { Observable, scan } from 'rxjs'
import { Order } from '../models'

/**
 * reduce orders into map, replace old orders
 */
export const scanOrders =
  () =>
  (input: Observable<Order[]>): Observable<Map<Order['id'], Order>> =>
    input.pipe(
      scan((map, arr) => {
        const newMap = new Map(map)
        arr.forEach((order) => {
          newMap.set(order.id, order)
        })
        return newMap
      }, new Map())
    )
