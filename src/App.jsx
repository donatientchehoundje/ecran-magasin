import { useState, useEffect } from 'react';
import { useLivraisons } from './hooks/useLivraisons';
import { useInvoiceAnimation } from './hooks/useInvoiceAnimation';
import { useSpeech } from './hooks/useSpeech';
import { useSoundNotification } from './hooks/useSoundNotification';
import TopBar from './components/TopBar';
import CounterBar from './components/CounterBar';
import InvoiceGrid from './components/InvoiceGrid';
import Sidebar from './components/Sidebar';
import TickerBar from './components/TickerBar';
import Toast from './components/Toast';
import './App.css';

export default function App() {
  const { livraisons, stats, loading, error, tenant } = useLivraisons(5000);
  const { displayedLivraisons, animatingIds, lastDelivered, lastNew } = useInvoiceAnimation(livraisons);
  const { speak } = useSpeech();
  const { playDelivered, playNew } = useSoundNotification();

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('delivered'); // 'delivered' ou 'new'

  // Notification quand une facture est livrée
  useEffect(() => {
    if (lastDelivered) {
      const message = `FACTURE N° ${lastDelivered.reference} LIVRÉE`;
      setToastMessage(message);
      setToastType('delivered');
      setShowToast(true);

      playDelivered();
      speak(message, {
        rate: 1.2,
        pitch: 1.0,
        volume: 1.0,
        lang: 'fr-FR',
      });
    }
  }, [lastDelivered, speak, playDelivered]);

  // Notification quand une nouvelle facture arrive
  useEffect(() => {
    if (lastNew) {
      const message = `NOUVELLE FACTURE N° ${lastNew.reference}`;
      setToastMessage(message);
      setToastType('new');
      setShowToast(true);

      playNew();
      speak(message, {
        rate: 1.0,
        pitch: 1.2, // Pitch plus haut pour les nouvelles
        volume: 1.0,
        lang: 'fr-FR',
      });
    }
  }, [lastNew, speak, playNew]);

  return (
    <div className="screen">
      <TopBar />
      <CounterBar stats={stats} />
      <div className="body">
        <InvoiceGrid livraisons={displayedLivraisons} animatingIds={animatingIds} />
        <Sidebar />
      </div>
      <TickerBar />
      <Toast
        message={toastMessage}
        visible={showToast}
        duration={4000}
        onClose={() => setShowToast(false)}
        type={toastType}
      />
      {/* Badge Tenant (dev) */}
      <div style={{ position: 'fixed', top: 10, left: 10, background: '#1e40af', color: '#4ade80', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', zIndex: 1000 }}>
        Tenant: {tenant}
      </div>
      {error && (
        <div style={{ position: 'fixed', bottom: 10, right: 10, background: '#e74c3c', color: 'white', padding: '15px', borderRadius: '5px', fontSize: '14px', maxWidth: '300px', zIndex: 9999 }}>
          <strong>Erreur:</strong> {error}
        </div>
      )}
    </div>
  );
}
