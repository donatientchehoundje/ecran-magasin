import { useState, useEffect } from 'react';

export function useDelayAlert(livraisons, delayMinutes = 20) {
  const [delayedIds, setDelayedIds] = useState(new Set());

  useEffect(() => {
    const checkDelays = () => {
      const now = new Date();
      const delayed = new Set();

      (livraisons || []).forEach((inv) => {
        if (inv.statut !== 'delivered' && inv.date_creation) {
          const createdAt = new Date(inv.date_creation);
          const elapsedMinutes = (now - createdAt) / 1000 / 60;

          if (elapsedMinutes > delayMinutes) {
            delayed.add(inv.id);
          }
        }
      });

      setDelayedIds(delayed);
    };

    checkDelays();
    const interval = setInterval(checkDelays, 30000); // Vérifier toutes les 30s

    return () => clearInterval(interval);
  }, [livraisons, delayMinutes]);

  return delayedIds;
}
