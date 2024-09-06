import {createContext, useContext, useState} from "react";

const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [userData, setUserData] = useState(JSON.parse(localStorage?.getItem("tabsbookLoginInfo")));
  const [isActiveDocAcc, setIsActiveDocAcc] = useState(false);
  const [searchValuesContext, setSearchValuesContext] = useState(JSON.parse(sessionStorage?.getItem("tabibookHomeSearchValue")));

  return (
    <UserContext.Provider value={{userData, setUserData, isActiveDocAcc, setIsActiveDocAcc, searchValuesContext, setSearchValuesContext}}>
      {children}
    </UserContext.Provider>
  );
};

export function useUserContext() {
  return useContext(UserContext);
}
