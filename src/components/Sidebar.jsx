export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="legend-box">
        <div className="legend-title">Légende</div>
        <div className="legend-item">
          <div className="leg-dot leg-wait"></div>
          En attente de retrait
        </div>
        <div className="legend-item">
          <div className="leg-dot leg-partial"></div>
          Livraison partielle
        </div>
        <div className="legend-item">
          <div className="leg-dot leg-done"></div>
          Livré — disparaît
        </div>
      </div>
      <div className="info-box">
        <div className="info-title">
          <i className="ti ti-info-circle" style={{ fontSize: '14px' }} aria-hidden="true"></i>
          À savoir
        </div>
        <div className="info-msg">Présentez votre numéro de facture au comptoir</div>
        <div className="info-msg">Contrôlez votre commande avant de partir</div>
        <div className="info-msg">Retrait possible de 08h à 18h</div>
      </div>
    </div>
  );
}
