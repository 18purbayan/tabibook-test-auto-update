import React, {useState, useEffect} from "react";
import {Navigate, Outlet} from "react-router-dom";

const Auth = ({allowedRoles}) => {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("tabsbookLoginInfo")));

  return allowedRoles.includes(userData?.users?.type) ? <Outlet /> : <Navigate to={"/"} replace />;
};

export default Auth;
