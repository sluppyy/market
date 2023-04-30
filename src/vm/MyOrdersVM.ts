import { BehaviorSubject } from 'rxjs'
import { MyOrdersService } from '../services'
import { createContext, useContext } from 'react'

export class MyOrdersVM {
  myOrders$: BehaviorSubject<Set<string>>

  constructor(private readonly _service: MyOrdersService) {
    this.myOrders$ = _service.myOrders$
  }

  cancelOrder(id: string) {
    this._service.cancel(id)
  }

  static Context = createContext<MyOrdersVM | null>(null)
  static use() {
    return useContext(this.Context)
  }
}
