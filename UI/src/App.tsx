import React from 'react';
import ProductList from './page/ProductList';
import CreateProduct from './page/CreateProduct';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductDetails from './component/ProductDetails';
import UpdateProduct from './page/UpdateProduct';
import SidePannel from './component/SidePannel';
import Login from './page/Login';
import Register from './page/Register';
import PrivateRoute from './component/PrivateRoute';  // adjust path if needed
import PublicRoute from './component/PublicRoute';    // add PublicRoute
import HomePage from './component/User/HomePage';
import RoleBasedRoute from './component/RoleBasedRoute';
import ForgotPassword from './page/ForgotPassword'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes wrapped inside PublicRoute to redirect logged-in users */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected routes wrapped inside PrivateRoute */}
    <Route
  path="/"
  element={
    <PrivateRoute>
      <RoleBasedRoute />
    </PrivateRoute>
  }
/>
        {/* <Route
          path="/home"
          element={
            <PrivateRoute>
              <SidePannel>
                <ProductList />
              </SidePannel>
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <SidePannel>
                <CreateProduct />
              </SidePannel>
            </PrivateRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PrivateRoute>
              <SidePannel>
                <ProductDetails />
              </SidePannel>
            </PrivateRoute>
          }
        />
        <Route
          path="/product/update/:id"
          element={
            <PrivateRoute>
              <SidePannel>
                <UpdateProduct />
              </SidePannel>
            </PrivateRoute>
          }
        />
          <Route
          path="/resetPassword"
          element={
            <PrivateRoute>
              <ForgotPassword></ForgotPassword>
            </PrivateRoute>
          }
        />
        <Route path='/home-page' element={<HomePage></HomePage>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
