import OrdersTable from "./components/OrdersTable/OrdersTable"
import { MockConnection } from "./connection"
import { MockServer } from "./mock-server"
import { OrdersVM } from "./vm"

const connection = new MockConnection()
connection.connect()
const server = new MockServer(connection)
const ordersVm = new OrdersVM(connection)

function App() {
  return (
  <OrdersVM.Context.Provider value={ordersVm}>
  <div className="App">
    <div style={{
      border: '1px solid black',
      padding: '1em',
      width: 'fit-content'
    }}>
      <h1>Debug</h1>
      <button onClick={() => server.addRandom()}>Add random order</button>
    </div>
    
    <OrdersTable />  
  </div>
  </OrdersVM.Context.Provider>)
}

export default App
