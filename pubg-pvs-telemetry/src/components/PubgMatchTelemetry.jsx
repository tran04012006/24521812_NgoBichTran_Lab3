
import {
  PUBG_VN_SQUADS,
  DEFAULT_SQUAD_ID,
  getSquadById,
} from "../data/pubgTelemetry.js";

function PubgMatchTelemetry() {
  const squad = getSquadById(DEFAULT_SQUAD_ID);

  return (
    <section
      className="telemetry-panel"
      aria-labelledby="telemetry-heading"
    >
      <div className="panel-header">
        <div>
          <p className="eyebrow">MATCH TELEMETRY</p>

          <h2 id="telemetry-heading">
            Live Squad Radar
          </h2>
        </div>

        <span className="live-badge">
          ● DEMO
        </span>
      </div>

      <div className="selector-section">
        <h3>Available Squads</h3>

        <div className="squad-list">
          {PUBG_VN_SQUADS.map((item) => (
            <div
              key={item.id}
              className={
                item.id === squad.id
                  ? "squad-item squad-item-active"
                  : "squad-item"
              }
            >
              {item.name}
            </div>
          ))}
        </div>

        <p className="helper-text">
          Interactive selection will be added
          in Task 2.
        </p>
      </div>

      <article
        className="match-card"
        aria-label={`${squad.name} match statistics`}
      >
        <div className="match-card-header">
          <div>
            <p className="eyebrow">
              CURRENT SQUAD
            </p>

            <h3>{squad.name}</h3>
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
    </section>
  );
}

export default PubgMatchTelemetry;
