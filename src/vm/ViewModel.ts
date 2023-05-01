import { Subscription } from 'rxjs'

export abstract class ViewModel {
  private readonly _subs: Subscription[] = []

  /**
   * adds a subscription to subscriptions that are
   * automatically canceled after dispose
   */
  addSub(sub: Subscription) {
    this._subs.push(sub)
  }

  onInit() {}

  /**
   * required call
   */
  onDispose() {
    this._subs.forEach((sub) => {
      sub.unsubscribe()
    })
  }
}
