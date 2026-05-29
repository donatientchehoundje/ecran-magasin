export default function TickerBar() {
  const messages = [
    'Facture FA-20254 livrée · Mme Adjoua Koffi — merci de votre visite',
    'Facture FA-20248 — livraison partielle disponible, solde en cours de préparation',
    'Facture FA-20246 prête au comptoir · SARL Bénin Négoce',
    'Munissez-vous de votre pièce d\'identité pour le retrait',
  ];

  return (
    <div className="ticker-bar" aria-live="polite">
      <div className="ticker-inner">
        {messages.map((msg, i) => (
          <span key={i} className="ticker-item">
            <span className={`ticker-dot ${i % 2 === 0 ? 'td-green' : 'td-amber'}`}></span>
            {msg}
          </span>
        ))}
        {messages.map((msg, i) => (
          <span key={`dup-${i}`} className="ticker-item">
            <span className={`ticker-dot ${i % 2 === 0 ? 'td-green' : 'td-amber'}`}></span>
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
