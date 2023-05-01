import OrdersTable from "./components/OrdersTable/OrdersTable"
import TickerGroup from "./components/TickerGroup/TickerGroup"
import VMProvider from "./components/VMProvider/VMProvider"
import { MockConnection } from "./connection"
import { MockServer } from "./mock-server"
import { MyOrdersService } from "./services"
import { OrdersVM } from "./vm"
import { MyOrdersVM } from "./vm/MyOrdersVM"

const connection = new MockConnection()
connection.connect()
const server = new MockServer(connection)
const myOrdersService = new MyOrdersService(connection)
const ordersVm = new OrdersVM(connection)
const myOrdersVm = new MyOrdersVM(myOrdersService)

Array(5).fill(0).forEach(server.addRandom.bind(server))

function App() {
  return (
  <VMProvider vm={ordersVm} context={OrdersVM.Context}>
  <MyOrdersVM.Context.Provider value={myOrdersVm}>
  
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
      <button onClick={() => {
        navigator.clipboard
          .writeText(ordersVm.exportOrdersAsCvs())
          .then(() => {
            alert('Table copied to your clipboard')
          })
      }}>Export to cvs</button>
    </div>
  
    <div style={{ margin: '1em' }}>
      <TickerGroup connection={connection}/>
    </div>
  
    <OrdersTable />  
  </div>
  
  </MyOrdersVM.Context.Provider>
  </VMProvider>)
}

export default App
