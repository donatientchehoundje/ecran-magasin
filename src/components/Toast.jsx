import { useEffect } from 'react';
import './Toast.css';

export default function Toast({ message, visible, duration = 4000, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <div className="toast-container">
      <div className="toast-content">
        <div className="toast-icon">✓</div>
        <div className="toast-message">{message}</div>
      </div>
    </div>
  );
}
