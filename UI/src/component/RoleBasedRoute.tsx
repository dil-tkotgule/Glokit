// src/component/RoleBasedRoute.tsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { type RootState } from "../redux/store";
import SidePannel from "./SidePannel";
import ProductList from "../page/ProductList";
import HomePage from "./User/HomePage";

const RoleBasedRoute: React.FC = () => {
  const role = useSelector((state: RootState) => state.role);
  const email = useSelector((state: RootState) => state.email);
  const isLoggedIn = !!email;

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return role === "fresher" ? 
   <SidePannel> <HomePage /></SidePannel>
  : (
    <SidePannel>
      <ProductList />
    </SidePannel>
  );
};

export default RoleBasedRoute;
