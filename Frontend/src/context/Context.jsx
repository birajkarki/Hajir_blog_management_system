import { createContext, useEffect, useState } from "react";
import ApiRequest from "../utils/apiRequests";

export const Context = createContext({
  isAuthenticated: false,
});

export const ContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(false);

  return (
    <Context.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser }}
    >
      {children}
    </Context.Provider>
  );
};
