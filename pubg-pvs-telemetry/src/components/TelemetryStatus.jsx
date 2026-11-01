
import BlueZoneSkeleton from "./BlueZoneSkeleton.jsx";
import TelemetryError from "./TelemetryError.jsx";

import {
  TELEMETRY_STATUS,
} from "../hooks/useTelemetry.js";

function TelemetryStatus({ view, onRetry }) {
  switch (view.status) {
    case TELEMETRY_STATUS.IDLE:
      return (
        <section className="telemetry-message idle-message">
          <h3>Telemetry Ready</h3>

          <p>
            Select a PUBG squad to begin tracking
            match statistics.
          </p>
        </section>
      );

    case TELEMETRY_STATUS.LOADING:
      return <BlueZoneSkeleton />;

    case TELEMETRY_STATUS.ERROR:
      return (
        <TelemetryError
          error={view.error}
          onRetry={onRetry}
        />
      );

    case TELEMETRY_STATUS.SUCCESS: {
      const squad = view.data;

      if (!squad) {
        return (
          <TelemetryError
            error="No squad data was returned."
            onRetry={onRetry}
          />
        );
      }

      return (
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
      );
    }

    default:
      return null;
  }
}

export default TelemetryStatus;
