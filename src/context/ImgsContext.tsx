import React, { createContext, useContext, useState, ReactNode } from "react";

type ImgsContextType = {
  imgs: string[];
  setImgs: React.Dispatch<React.SetStateAction<string[]>>;
};

const ImgsContext = createContext<ImgsContextType | undefined>(undefined);

type ImgsProviderProps = {
  children: ReactNode;
};

export const ImgsProvider = ({ children }: ImgsProviderProps) => {
  const [imgs, setImgs] = useState<string[]>([]);

  return (
    <ImgsContext.Provider value={{ imgs, setImgs }}>
      {children}
    </ImgsContext.Provider>
  );
};

export const useImgsContext = (): ImgsContextType => {
  const context = useContext(ImgsContext);
  if (!context) {
    throw new Error("useImgsContext must be used within an ImgsProvider");
  }
  return context;
};
