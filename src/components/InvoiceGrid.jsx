import { useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useDelayAlert } from '../hooks/useDelayAlert';

export default function InvoiceGrid({ livraisons, animatingIds }) {
  const triggeredConfetti = useRef(new Set());
  const delayedIds = useDelayAlert(livraisons);

  useEffect(() => {
    animatingIds.forEach((id) => {
      if (!triggeredConfetti.current.has(id)) {
        triggeredConfetti.current.add(id);
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
    });
  }, [animatingIds]);

  const groups = useMemo(() => {
    const map = new Map();
    const unknownKey = '_unknown_';

    (livraisons || []).forEach((inv) => {
      const stores = inv.magasins && inv.magasins.length ? inv.magasins : (inv.magasin ? [inv.magasin] : [{ id: unknownKey, nom: 'Magasin inconnu' }]);

      stores.forEach((s) => {
        // Vérifier le statut de livraison pour ce magasin spécifique
        const magasinStatus = s.statut || 'pending'; // Si pas de statut, considérer comme pending
        
        // Ne pas afficher si complètement livré pour ce magasin
        if (magasinStatus === 'delivered') {
          return;
        }

        const id = s.id ?? unknownKey;
        if (!map.has(id)) map.set(id, { magasin: s, invoices: [] });
        map.get(id).invoices.push(inv);
      });
    });

    return Array.from(map.values());
  }, [livraisons]);

  const cols = Math.max(1, groups.length);

  return (
    <div className="list-col">
      <div className="col-title">Factures en attente de retrait</div>

      <div className="columns" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '20px' }}>
        {groups.map((g) => (
          <div key={g.magasin.id ?? g.magasin.nom} className="store-column">
            <div className="store-header">{g.magasin.nom}</div>
            <div className="store-list">
              {g.invoices.map((inv) => (
                <div
                  key={`${g.magasin.id ?? 'unk'}-${inv.id}`}
                  className={`inv-card ${inv.statut === 'partial' ? 'inv-partial' : ''} ${delayedIds.has(inv.id) ? 'inv-delayed' : ''} ${animatingIds.has(inv.id) ? 'leaving' : ''}`}
                  role="listitem"
                >
                  <div className="inv-ref">{inv.reference}</div>
                  <div className="inv-client">{inv.client_nom}</div>
                  <div className="inv-time">{inv.date_creation.substring(11, 16)}</div>
                  <div className="inv-progress">{inv.articles_complets}/{inv.articles_totaux} articles</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
