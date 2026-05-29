export default function CounterBar({ stats }) {
  return (
    <div className="counter-bar">
      <div className="counter">
        <div className="counter-icon ci-wait" aria-hidden="true">
          <i className="ti ti-clock-hour4"></i>
        </div>
        <div>
          <div className="counter-num">{stats.en_attente || 0}</div>
          <div className="counter-lbl">En attente</div>
        </div>
      </div>
      <div className="counter">
        <div className="counter-icon ci-done" aria-hidden="true">
          <i className="ti ti-circle-check"></i>
        </div>
        <div>
          <div className="counter-num">{stats.livrées || 0}</div>
          <div className="counter-lbl">Livrées aujourd'hui</div>
        </div>
      </div>
      <div className="counter">
        <div className="counter-icon ci-partial" aria-hidden="true">
          <i className="ti ti-packages"></i>
        </div>
        <div>
          <div className="counter-num">{stats.partielles || 0}</div>
          <div className="counter-lbl">Partielles</div>
        </div>
      </div>
    </div>
  );
}
