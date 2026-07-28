import "./toast.css";
import { useToast } from "./ToastContext";

function Toast() {
  const { toast } = useToast();
  if (!toast) return null;

  return (
    <div key={toast.id} className={`toast ${toast.type}`}>
      {toast.message}
    </div>
  );
}

export default Toast;
