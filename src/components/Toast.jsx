import { useEffect } from 'react';
import './Toast.css';

export default function Toast({ message, visible, duration = 4000, onClose, type = 'delivered' }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const toastClass = type === 'new' ? 'toast-new' : 'toast-delivered';
  const icon = type === 'new' ? '📥' : '✓';

  return (
    <div className="toast-container">
      <div className={`toast-content ${toastClass}`}>
        <div className="toast-icon">{icon}</div>
        <div className="toast-message">{message}</div>
      </div>
    </div>
  );
}
