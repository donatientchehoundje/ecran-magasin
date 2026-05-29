import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function InvoiceGrid({ livraisons, animatingIds }) {
  const triggeredConfetti = useRef(new Set());

  return (
    <div className="list-col">
      <div className="col-title">Factures en attente de retrait</div>
      <div className="invoice-grid" role="list" aria-label="Factures en attente">
        {livraisons.map((inv) => {
          const isAnimating = animatingIds.has(inv.id);

          // Déclencher confetti UNE SEULE FOIS par facture
          if (isAnimating && !triggeredConfetti.current.has(inv.id)) {
            triggeredConfetti.current.add(inv.id);

            // Appeler confetti dans un requestAnimationFrame pour l'exécuter après le render
            requestAnimationFrame(() => {
              confetti({
                particleCount: 120,
                spread: 80,
                colors: ['#4ade80', '#22c55e', '#16a34a', '#15803d', '#10b981', '#059669'],
                origin: { x: Math.random(), y: 0.6 },
                disableForReducedMotion: false,
              });
            });
          }

          return (
            <div
              key={inv.id}
              className={`inv-card ${inv.statut === 'partial' ? 'inv-partial' : ''} ${
                isAnimating ? 'leaving' : ''
              }`}
              role="listitem"
            >
              <div className="inv-ref">{inv.reference}</div>
              <div className="inv-client">{inv.client_nom}</div>
              <div className="inv-time">{inv.date_creation.substring(11, 16)}</div>
              <div className="inv-progress">
                {inv.articles_complets}/{inv.articles_totaux} articles
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
