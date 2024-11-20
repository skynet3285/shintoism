import React, { createContext, useContext, useState, ReactNode } from "react";

type FrameContextType = {
  frameIndex: number;
  setFrameIndex: (index: number) => void;
};

// 기본값 설정
const FrameContext = createContext<FrameContextType | undefined>(undefined);

type FrameProviderProps = {
  children: ReactNode;
};

// FrameProvider 컴포넌트 정의
export const FrameProvider = ({ children }: FrameProviderProps) => {
  const [frameIndex, setFrameIndex] = useState<number>(0);

  return (
    <FrameContext.Provider value={{ frameIndex, setFrameIndex }}>
      {children}
    </FrameContext.Provider>
  );
};

// useFrameContext 훅 만들기
export const useFrameContext = (): FrameContextType => {
  const context = useContext(FrameContext);
  if (!context) {
    throw new Error("useFrameContext must be used within a FrameProvider");
  }
  return context;
};
