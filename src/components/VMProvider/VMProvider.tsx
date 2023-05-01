import { Context, ReactNode, useLayoutEffect } from "react"
import { ViewModel } from "../../vm"

interface Props<VM extends ViewModel> {
  vm: VM | null
  context: Context<VM | null>
  children: ReactNode
}

export default function VMProvider<VM extends ViewModel>({
  children,
  context,
  vm
}: Props<VM>) {
  useLayoutEffect(() => {
    vm?.onInit()

    return () => {
      vm?.onDispose()
    }
  }, [])

  return (
    <context.Provider value={vm}>
      {children}
    </context.Provider>
  )
}
