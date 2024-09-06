import {toast} from "react-toastify";

export const onLogout = () => {
  localStorage.removeItem("tabsbookLoginInfo");
  localStorage.removeItem("isAciveDoctorAcc");
  toast.success("Logout successfully", {autoClose: 1500});
};

export const logInDetails = () => {
  let value = JSON.parse(localStorage.getItem("tabsbookLoginInfo"));
  return value;
};
