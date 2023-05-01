import { BehaviorSubject } from 'rxjs'
import { MyOrdersService } from '../services'
import { createContext, useContext } from 'react'
import { ViewModel } from './ViewModel'

export class MyOrdersVM extends ViewModel {
  myOrders$ = new BehaviorSubject(new Set<string>())

  constructor(private readonly _service: MyOrdersService) {
    super()
    this.addSub(_service.myOrders$.subscribe(this.myOrders$))
  }

  cancelOrder(id: string) {
    this._service.cancel(id)
  }

  static Context = createContext<MyOrdersVM | null>(null)
  static use() {
    return useContext(this.Context)
  }
}
