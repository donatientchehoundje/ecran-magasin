export default function TickerBar() {
  const messages = [
    'Merci de votre visite',
    'Nous espérons vous revoir bientôt',
    'Découvrez nos nouvelles offres',
    'Suivez-nous sur les réseaux sociaux',
    'Profitez de nos promotions exclusives',
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
