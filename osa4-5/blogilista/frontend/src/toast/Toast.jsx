import "./toast.css";
import { useRef, useEffect } from "react";

function Toast({ toast, setToast }) {
  const timeout = useRef(null);

  useEffect(() => {
    if (!toast) return;

    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      clearTimeout(timeout.current);
    };
  }, [toast, setToast]);

  if (!toast) return null;

  return (
    <div key={toast.id} className={`toast ${toast.type}`}>
      {toast.message}
    </div>
  );
}

export default Toast;
