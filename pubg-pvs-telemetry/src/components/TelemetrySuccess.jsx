
function TelemetrySuccess({ squad }) {
  return (
    <article
      className="match-card"
      aria-labelledby="current-squad-heading"
    >
      <div className="match-card-header">
        <div>
          <p className="eyebrow">
            CURRENT SQUAD
          </p>

          <h3 id="current-squad-heading">
            {squad.name}
          </h3>
        </div>

        <span className="map-badge">
          {squad.map}
        </span>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <span className="stat-label">
            Match Phase
          </span>

          <strong className="stat-value">
            {squad.phase}
          </strong>
        </div>

        <div className="stat-box">
          <span className="stat-label">
            Alive
          </span>

          <strong className="stat-value">
            {squad.alive}
          </strong>
        </div>

        <div className="stat-box">
          <span className="stat-label">
            Kills
          </span>

          <strong className="stat-value">
            {squad.kills}
          </strong>
        </div>

        <div className="stat-box">
          <span className="stat-label">
            WWCD Probability
          </span>

          <strong className="stat-value">
            {squad.wwcdProb}%
          </strong>
        </div>
      </div>

      <div className="status-section">
        <span className="status-label">
          Current Status
        </span>

        <span className="status-value">
          {squad.status}
        </span>
      </div>
    </article>
  );
}

export default TelemetrySuccess;
