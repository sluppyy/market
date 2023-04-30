import { Observable, scan } from 'rxjs'
import { Message } from '../connection'

export const scanUserOrders = () => (input: Observable<string[]>) =>
  input.pipe(
    scan((set, arr) => {
      const newSet = new Set(set)
      arr.forEach((id) => {
        newSet.add(id)
      })
      return newSet
    }, new Set() as Set<string>)
  )
