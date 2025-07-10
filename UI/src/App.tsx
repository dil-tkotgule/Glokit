import ProductList from './component/ProductList'
import CreateProduct from './component/CreateProduct'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProductDetails from './component/ProductDetails'
import UpdateProduct from './component/UpdateProduct'
import SidePannel from './component/SidePannel'
import HomePage from '../src/component/User/HomePage'

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
          <Route path="/product/list" element={<HomePage/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
