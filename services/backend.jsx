import { BASE_URL } from "@/constants/constants";
import { useAuth } from "@/context/AuthContext";
import {
  FrappeProvider as SDKProvider,
  useFrappeAuth,
  useFrappeCall,
  useFrappeCreateDoc,
  useFrappeGetDoc,
  useFrappeGetDocCount,
  useFrappeGetDocList,
} from "frappe-react-sdk";
import React, { createContext, useContext } from "react";
``
const FrappeContext = createContext(null);

const FrappeProvider = ({ children }) => {
  const { frappeToken } = useAuth();

  return (
    <SDKProvider
      url={BASE_URL}
      tokenParams={{
        useToken: frappeToken != null,
        type: "token",
        token: () => frappeToken,
      }}
    >
      <FrappeContext.Provider
        value={{
          useCall: useFrappeCall,
          useGetDoc: useFrappeGetDoc,
          useGetDocList: useFrappeGetDocList,
          useAuth: useFrappeAuth,
          useCount: useFrappeGetDocCount,
          useCreate: useFrappeCreateDoc,
        }}
      >
        {children}
      </FrappeContext.Provider>
    </SDKProvider>
  );
};

export const useFrappe = () => {
  const frappe = useContext(FrappeContext);
  return frappe;
};

export { FrappeContext, FrappeProvider };
