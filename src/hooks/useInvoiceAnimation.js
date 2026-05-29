import { useState, useEffect, useRef } from 'react';

export function useInvoiceAnimation(livraisons) {
  const [displayedLivraisons, setDisplayedLivraisons] = useState(livraisons);
  const [animatingIds, setAnimatingIds] = useState(new Set());
  const [lastDelivered, setLastDelivered] = useState(null);
  const [lastNew, setLastNew] = useState(null);
  const prevRef = useRef([]);

  useEffect(() => {
    const prevIds = new Set(prevRef.current.map(inv => inv.id));
    const currentIds = new Set(livraisons.map(inv => inv.id));

    // Déterminer les factures qui disparaissent (livrées)
    const disappearing = Array.from(prevIds).filter(id => !currentIds.has(id));

    // Déterminer les factures qui apparaissent (nouvelles)
    const newInvoices = Array.from(currentIds).filter(id => !prevIds.has(id));

    if (disappearing.length > 0) {
      // Ajouter les IDs en animation
      const newAnimatingIds = new Set(animatingIds);
      disappearing.forEach(id => newAnimatingIds.add(id));
      setAnimatingIds(newAnimatingIds);

      // Garder les cartes en animation dans la liste pour laisser l'animation se jouer
      const cardsToKeep = displayedLivraisons.filter(inv => !currentIds.has(inv.id));
      setDisplayedLivraisons(prev => [...livraisons, ...cardsToKeep]);

      // Définir la dernière facture livrée (pour le toast)
      if (cardsToKeep.length > 0) {
        setLastDelivered(cardsToKeep[0]);
      }

      // Après l'animation, retirer les cartes
      disappearing.forEach(id => {
        setTimeout(() => {
          setDisplayedLivraisons(prev => prev.filter(inv => inv.id !== id));
          setAnimatingIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }, 1200); // Durée de l'animation
      });
    } else {
      // Pas de disparition, juste mettre à jour la liste
      setDisplayedLivraisons(livraisons);
      setLastDelivered(null);
    }

    // Déterminer la dernière nouvelle facture
    if (newInvoices.length > 0) {
      const newInvoice = livraisons.find(inv => newInvoices.includes(inv.id));
      if (newInvoice) {
        setLastNew(newInvoice);
      }
    } else {
      setLastNew(null);
    }

    prevRef.current = livraisons;
  }, [livraisons]);

  return { displayedLivraisons, animatingIds, lastDelivered, lastNew };
}
