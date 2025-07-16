import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";

interface Props {
  children: JSX.Element;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const email = useSelector((state: RootState) => state.email);
  const storedUser = localStorage.getItem("user");
console.log(email)
  if (email.length>0 && storedUser) {
    return children;
  }

  return <Navigate to="/login"  />;
};

export default PrivateRoute;
