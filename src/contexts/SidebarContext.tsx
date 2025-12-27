import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(() => {
    // Get saved preference from localStorage
    const userNimNip = localStorage.getItem("userNimNip");
    const savedPreference = localStorage.getItem(`sidebar_${userNimNip}`);
    
    // Default: always open (full sidebar)
    if (savedPreference !== null) {
      return savedPreference === "true";
    }
    return true;
  });

  // Save preference when it changes
  useEffect(() => {
    const userNimNip = localStorage.getItem("userNimNip");
    if (userNimNip) {
      localStorage.setItem(`sidebar_${userNimNip}`, String(isOpen));
    }
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  const setSidebarOpen = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
