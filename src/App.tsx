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
  <div className="App">
    <OrdersVM.Context.Provider value={ordersVm}>
      <OrdersTable />  
    </OrdersVM.Context.Provider>
  </div>)
}

export default App
