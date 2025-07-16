import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";

interface Props {
  children: JSX.Element;
}

const PublicRoute: React.FC<Props> = ({ children }) => {
  const email = useSelector((state: RootState) => state.email);
  const storedUser = localStorage.getItem("user");

  // If user is logged in, redirect to home or dashboard
  if (email.length >0 && storedUser) {
    return <Navigate to="/"  />;
  }

  // Otherwise, render the public page (login/register)
  return children;
};

export default PublicRoute;
