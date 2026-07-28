import { useRef, useState } from "react";
import { ToastContext } from "./ToastContext";

const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = (message, type = "success", id = crypto.randomUUID()) => {
    clearTimeout(timerRef.current);

    setToast({ message, type, id });

    timerRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
