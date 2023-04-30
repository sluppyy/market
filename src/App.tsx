import OrdersTable from "./components/OrdersTable/OrdersTable"
import TickerGroup from "./components/TickerGroup/TickerGroup"
import { MockConnection } from "./connection"
import { MockServer } from "./mock-server"
import { MyOrdersServer } from "./services"
import { OrdersVM } from "./vm"

const connection = new MockConnection()
connection.connect()
const server = new MockServer(connection)
const myOrdersServer = new MyOrdersServer(connection)
const ordersVm = new OrdersVM(connection)

Array(5).fill(0).forEach(server.addRandom.bind(server))

function App() {
  return (
  <OrdersVM.Context.Provider value={ordersVm}>
  
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
      <TickerGroup connection={connection}/>
    </div>
  
    <OrdersTable />  
  </div>
  
  </OrdersVM.Context.Provider>)
}

export default App
