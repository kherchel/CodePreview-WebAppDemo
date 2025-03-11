import { createContext, useContext, useState } from "react";
import { Toast, ToastCreateProps } from "../types";

type ContextType = {
  toasts: Toast[];
  add: (toast: ToastCreateProps) => void;
  remove: (id: number) => void;
  clear: () => void;
};

export const ToastsContext = createContext<ContextType>({
  toasts: [],
  add: () => {},
  remove: () => {},
  clear: () => {},
});

export const ToastsProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = (toast: ToastCreateProps) => {
    const newToastId = Date.now();
    setToasts((prev) => [
      ...(toast.sameId ? prev.filter((t) => t.sameId !== toast.sameId) : prev),
      { ...toast, id: newToastId, createdAt: new Date() },
    ]);

    setTimeout(() => {
      remove(newToastId);
    }, toast.duration || 5000);
  };

  const remove = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const clear = () => {
    setToasts([]);
  };

  return (
    <ToastsContext.Provider value={{ toasts, add, remove, clear }}>
      {children}
    </ToastsContext.Provider>
  );
};

export const useToasts = () => {
  const context = useContext(ToastsContext);
  if (context === undefined) {
    throw new Error("useToasts must be used within a ToastsProvider");
  }
  return context;
};
