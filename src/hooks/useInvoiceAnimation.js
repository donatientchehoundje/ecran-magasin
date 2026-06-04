import { useState, useEffect, useRef } from 'react';

export function useInvoiceAnimation(livraisons) {
  const [displayedLivraisons, setDisplayedLivraisons] = useState(livraisons);
  const [animatingIds, setAnimatingIds] = useState(new Set());
  const [lastDelivered, setLastDelivered] = useState(null);
  const [lastNew, setLastNew] = useState(null);
  const prevRef = useRef([]);
  const timeoutsRef = useRef(new Map());

  useEffect(() => {
    // Normaliser les IDs en string pour éviter les problèmes de comparaison
    const prevIds = new Set(prevRef.current.map(inv => String(inv.id)));
    const currentIds = new Set((livraisons || []).map(inv => String(inv.id)));

    // Factures qui disparaissent
    const disappearing = Array.from(prevIds).filter(id => !currentIds.has(id));

    // Factures qui apparaissent
    const newInvoices = Array.from(currentIds).filter(id => !prevIds.has(id));

    if (disappearing.length > 0) {
      // Marquer en animation (utiliser update fonctionnelle pour être sûr d'avoir la valeur à jour)
      setAnimatingIds(prev => {
        const next = new Set(prev);
        disappearing.forEach(id => next.add(id));
        return next;
      });

      // Garder les cartes qui doivent encore jouer l'animation (utiliser prevRef pour éviter dépendance)
      const cardsToKeep = (prevRef.current || []).filter(inv => !currentIds.has(String(inv.id)));
      setDisplayedLivraisons(() => [...(livraisons || []), ...cardsToKeep]);

      if (cardsToKeep.length > 0) {
        setLastDelivered(cardsToKeep[0]);
      }

      // Planifier la suppression après l'animation
      disappearing.forEach(id => {
        // Si un timeout existait, clear it
        const existing = timeoutsRef.current.get(id);
        if (existing) clearTimeout(existing);

        const t = setTimeout(() => {
          setDisplayedLivraisons(prev => prev.filter(inv => String(inv.id) !== id));
          setAnimatingIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
          timeoutsRef.current.delete(id);
        }, 1200);

        timeoutsRef.current.set(id, t);
      });
    } else {
      // Mise à jour normale
      setDisplayedLivraisons(livraisons || []);
      setLastDelivered(null);
    }

    // Dernière nouvelle facture
    if (newInvoices.length > 0) {
      const newInvoice = (livraisons || []).find(inv => newInvoices.includes(String(inv.id)));
      if (newInvoice) setLastNew(newInvoice);
    } else {
      setLastNew(null);
    }

    prevRef.current = livraisons || [];
  }, [livraisons]);

  // cleanup on unmount
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(t => clearTimeout(t));
      timeouts.clear();
    };
  }, []);

  return { displayedLivraisons, animatingIds, lastDelivered, lastNew };
}
