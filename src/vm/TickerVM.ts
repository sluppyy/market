import { createContext, useContext } from 'react'

export class TickerVM {
  static Context = createContext<TickerVM | null>(null)
  static use() {
    return useContext(this.Context)
  }
}
