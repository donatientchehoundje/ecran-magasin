import { useState, useEffect } from 'react';

export default function TopBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  const timeStr = time.toLocaleTimeString('fr-FR', { hour12: false });
  const dateStr = `${jours[time.getDay()]} ${time.getDate()} ${mois[time.getMonth()]} ${time.getFullYear()}`;

  return (
    <div className="top-bar">
      <div className="brand">
        <div className="brand-icon">
          <i className="ti ti-building-store" style={{ fontSize: '22px', color: '#93c5fd' }}></i>
        </div>
        <div>
          <div className="brand-name">Espace Livraison</div>
          <div className="brand-sub">Magasin central · Retraits du jour</div>
        </div>
      </div>
      <div className="top-right">
        <div className="live-pill">
          <div className="pulse"></div>
          En direct
        </div>
        <div className="clock-box">
          <div className="clock-time">{timeStr}</div>
          <div className="clock-date">{dateStr}</div>
        </div>
      </div>
    </div>
  );
}
