import {NotificationManager} from "react-notifications";
import secureLocalStorage from "react-secure-storage";
import Cookies from "js-cookie";

let logoutTimer;
export const handleLogout = () => {
  localStorage.removeItem("wealthNexusLoginInfo");

  const cookies = Object.keys(Cookies.get());
  cookies.forEach((cookie) => Cookies.remove(cookie));

  clearTimeout(logoutTimer);

  NotificationManager.success("Logout successfully", "", 3000);
};

export const setLogoutTimer = () => {
  logoutTimer = setInterval(() => {
    handleLogout();
  }, 2 * 60 * 60 * 1000); // 2 hours
};

// Function to reset the logout timer on user activity
export const resetLogoutTimer = () => {
  clearInterval(logoutTimer);
  setLogoutTimer();
};

export const onLogout = () => {
  handleLogout();
};

 
export const logInDetails = () => {
  // let value = JSON.parse(localStorage.getItem('wealthNexusLoginInfo'));
  let value = JSON.parse(secureLocalStorage.getItem("wealthNexusLoginInfo"));
  return value;
};

export const dateFormat = date => {
  if (date !== undefined) {
    const [year, month, day] = date.split("-");
    const result = [month, day, year].join("-");
    return result;
  } else {
    return 0; 
  }
};

export const changeTitle = newTitle => {
  // document.title = newTitle;
};

