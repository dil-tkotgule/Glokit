import ProductList from './page/ProductList'
import CreateProduct from './page/CreateProduct'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProductDetails from './component/ProductDetails'
import UpdateProduct from './page/UpdateProduct'
import SidePannel from './component/SidePannel'
import Login from './page/Login'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SidePannel><ProductList /></SidePannel>} />
        <Route path="/home" element={<SidePannel><ProductList /></SidePannel>} />
        <Route path="/create" element={<SidePannel><CreateProduct /></SidePannel>} />
        <Route path="/product/:id" element={<SidePannel><ProductDetails /></SidePannel>} />
        <Route path="/product/update/:id" element={<SidePannel><UpdateProduct /></SidePannel>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App;
