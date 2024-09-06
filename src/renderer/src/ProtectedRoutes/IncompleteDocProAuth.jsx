import React, {useState, useEffect} from "react";
import {Navigate, Outlet} from "react-router-dom";
import {useUserContext} from "../context/UserContext";

const IncompleteDocProAuth = ({allowedRoles}) => {
  const {setIsActiveDocAcc} = useUserContext();
  const [userData] = useState(JSON.parse(localStorage.getItem("tabsbookLoginInfo")));
  const [aciveDoctorAcc] = useState(localStorage.getItem("isAciveDoctorAcc"));

  useEffect(() => {
    setIsActiveDocAcc(aciveDoctorAcc === "1");
  }, [aciveDoctorAcc, setIsActiveDocAcc]);

  return allowedRoles.includes(userData?.users?.type) && aciveDoctorAcc == "1" ? <Outlet /> : <Navigate to={"/doctor/profile"} replace />;
};

export default IncompleteDocProAuth;
