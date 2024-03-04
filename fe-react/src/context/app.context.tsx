import React, { createContext, useContext, useState, ReactNode } from "react";

interface DataContextProps {
  children: ReactNode;
}

interface DataContextValue {
  sharedData: boolean;
  setSharedData: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<DataContextProps> = ({ children }) => {
  const [sharedData, setSharedData] = useState<boolean>(false);

  return (
    <DataContext.Provider value={{ sharedData, setSharedData }}>
      {children}
    </DataContext.Provider>
  );
};

export function useData(): DataContextValue {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
