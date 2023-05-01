import { useLayoutEffect, useState } from 'react'
import styles from './styles.module.css'
import { TickerVM } from '../../vm'
import Ticker from '../Ticker/Ticker'
import { Connection } from '../../connection'
import VMProvider from '../VMProvider/VMProvider'

interface Props {
  connection: Connection
}

export default function TickerGroup({ connection }: Props) {
  const [vms, setVMs] = useState<TickerVM[]>([])
  const [instrument, setInstrument] = useState('')

  function onAdd() {
    if (instrument == '') return
    if (!vms.find(vm => vm.instrument == instrument)) {
      setVMs([...vms, new TickerVM(connection, instrument)])
    }
  }

  function onDelete(instrument: string) {
    setVMs(vms.filter(vm => vm.instrument != instrument))
  }

  return (
    <div className={styles['ticker-group']}>
      <div className={styles['container']}>
        {vms.map(vm => 
          <VMProvider vm={vm} context={TickerVM.Context} key={vm.instrument}>
            <Ticker onDelete={() => onDelete(vm.instrument)}/>
          </VMProvider>
        )}
      </div>
      
      <div className={styles['form']}>
        <input value={instrument} onChange={e => setInstrument(e.target.value)}/>
        <button
          className={styles['add']}
          onClick={onAdd}
        >
          +
        </button>
      </div>
    </div>
  )
}
