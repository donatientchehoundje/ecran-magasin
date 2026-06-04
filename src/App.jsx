import { useState, useEffect, useRef, useMemo } from 'react';
import { useLivraisons } from './hooks/useLivraisons';
import { useInvoiceAnimation } from './hooks/useInvoiceAnimation';
import { useSpeech } from './hooks/useSpeech';
import { useSoundNotification } from './hooks/useSoundNotification';
import TopBar from './components/TopBar';
import CounterBar from './components/CounterBar';
import InvoiceGrid from './components/InvoiceGrid';
import TickerBar from './components/TickerBar';
import Toast from './components/Toast';
import './App.css';

export default function App() {
  const { livraisons, stats, pendingTotal, error, tenant } = useLivraisons(5000);
  const { displayedLivraisons, animatingIds, lastDelivered, lastNew } = useInvoiceAnimation(livraisons);
  const { speak } = useSpeech();
  const { playDelivered, playNew } = useSoundNotification();

  const [showToast, setShowToast] = useState(false);
  const deliveredPlayedRef = useRef(null);
  const newPlayedRef = useRef(null);
  const lastToastIdRef = useRef(null);

  const toastInfo = useMemo(() => {
    if (lastDelivered) {
      return {
        id: `delivered-${lastDelivered.id}`,
        message: `FACTURE N° ${lastDelivered.reference} LIVRÉE`,
        type: 'delivered',
      };
    }
    if (lastNew) {
      return {
        id: `new-${lastNew.id}`,
        message: `NOUVELLE FACTURE N° ${lastNew.reference}`,
        type: 'new',
      };
    }
    return null;
  }, [lastDelivered, lastNew]);

  // Afficher le toast quand il y a une nouvelle action
  useEffect(() => {
    if (toastInfo && toastInfo.id !== lastToastIdRef.current) {
      lastToastIdRef.current = toastInfo.id;
      setShowToast(true);
    }
  }, [toastInfo]);

  useEffect(() => {
    if (lastDelivered && deliveredPlayedRef.current !== lastDelivered.id) {
      deliveredPlayedRef.current = lastDelivered.id;
      const message = `FACTURE N° ${lastDelivered.reference} LIVRÉE`;

      playDelivered();
      speak(message, {
        rate: 1.2,
        pitch: 1.0,
        volume: 1.0,
        lang: 'fr-FR',
      });
    }
  }, [lastDelivered, speak, playDelivered]);

  useEffect(() => {
    if (lastNew && newPlayedRef.current !== lastNew.id) {
      newPlayedRef.current = lastNew.id;
      const message = `NOUVELLE FACTURE N° ${lastNew.reference}`;

      playNew();
      speak(message, {
        rate: 1.0,
        pitch: 1.2,
        volume: 1.0,
        lang: 'fr-FR',
      });
    }
  }, [lastNew, speak, playNew]);

  return (
    <div className="screen">
      <TopBar />
      <CounterBar stats={stats} pendingTotal={pendingTotal} />
      <div className="body">
        <InvoiceGrid livraisons={displayedLivraisons} animatingIds={animatingIds} />
      </div>
      <TickerBar />
      <Toast
        message={toastInfo?.message || ''}
        visible={showToast}
        duration={4000}
        onClose={() => setShowToast(false)}
        type={toastInfo?.type || 'delivered'}
      />
      {/* Badge Tenant (dev) */}
      <div style={{ position: 'fixed', top: 16, left: 16, background: '#1e40af', color: '#4ade80', padding: '12px 18px', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', zIndex: 1000 }}>
        Tenant: {tenant}
      </div>
      {error && (
        <div style={{ position: 'fixed', bottom: 16, right: 16, background: '#ef4444', color: 'white', padding: '20px 28px', borderRadius: '8px', fontSize: '18px', maxWidth: '400px', zIndex: 9999, fontWeight: '600', border: '2px solid #dc2626' }}>
          <strong style={{ fontSize: '20px' }}>⚠ Erreur:</strong> {error}
        </div>
      )}
    </div>
  );
}
