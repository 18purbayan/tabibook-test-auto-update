import React, {useState, useEffect} from "react";
import {Navigate, Outlet} from "react-router-dom";

const NotLogInAuth = () => {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userData")));

  return !userData ? <Outlet /> : <Navigate to="/" />;
};

export default NotLogInAuth;
