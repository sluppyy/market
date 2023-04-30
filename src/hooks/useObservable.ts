import { useEffect, useState } from 'react'
import { Observable } from 'rxjs'

export function useObservable<T>(obs: Observable<T>, byDefault: T): T {
  const [state, setState] = useState(byDefault)

  useEffect(() => {
    const sub = obs.subscribe(setState)

    return sub.unsubscribe.bind(sub)
  }, [obs])

  return state
}
