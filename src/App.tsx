import OrdersTable from "./components/OrdersTable/OrdersTable"
import Ticker from "./components/Ticker/Ticker"
import { MockConnection } from "./connection"
import { MockServer } from "./mock-server"
import { OrdersVM } from "./vm"
import { TickerVM } from "./vm/TickerVM"

const connection = new MockConnection()
connection.connect()
const server = new MockServer(connection)
const ordersVm = new OrdersVM(connection)
const tickerVm = new TickerVM()

function App() {
  return (
  <OrdersVM.Context.Provider value={ordersVm}>
  <TickerVM.Context.Provider value={tickerVm}>
  
  <div className="App">
    <div style={{
      border: '1px solid black',
      padding: '1em',
      width: 'fit-content',
      position: 'absolute',
      right: '2em'}}
    >
      <h1>Debug</h1>
      <button onClick={() => server.addRandom()}>Add random order</button>
    </div>
  
    <div style={{ margin: '1em' }}>
      <Ticker />
    </div>
  
    <OrdersTable />  
  </div>
  
  </TickerVM.Context.Provider>
  </OrdersVM.Context.Provider>)
}

export default App
