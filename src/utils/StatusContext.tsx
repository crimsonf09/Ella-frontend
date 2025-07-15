import { createContext, useContext, useState, type ReactNode } from "react";

type StatusType = "off" | "warning" | "error" | "Rewrite & Correct Mode" | "Contextual Expansion Mode" | "Full Prompt Generator Mode";

type StatusContextType = {
  status: StatusType;
  setStatus: (s: StatusType) => void;
};

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const StatusProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<StatusType>("warning");

  return (
    <StatusContext.Provider value={{ status, setStatus }}>
      {children}
    </StatusContext.Provider>
  );
};
export const useStatus = () => {
  const context = useContext(StatusContext);
  if (!context) {
    throw new Error("useStatus must be used within a StatusProvider");
  }
  return context;
};

