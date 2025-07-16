import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// Change from specific string union to general string type
export type StatusType = string;

type StatusContextType = {
  status: StatusType;
  setStatus: (s: StatusType) => void;
};

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const StatusProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatusState] = useState<StatusType>("off");

  // Broadcast status change to all windows
  const setStatus = (s: StatusType) => {
    setStatusState(s);
    window.dispatchEvent(new CustomEvent("status-change", { detail: s }));
  };

  // Listen for status changes from other trees
  useEffect(() => {
    const handler = (e: any) => setStatusState(e.detail);
    window.addEventListener("status-change", handler as EventListener);
    return () => window.removeEventListener("status-change", handler as EventListener);
  }, []);

  return (
    <StatusContext.Provider value={{ status, setStatus }}>
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = () => {
  const context = useContext(StatusContext);
  if (!context) throw new Error("useStatus must be used within a StatusProvider");
  return context;
};
