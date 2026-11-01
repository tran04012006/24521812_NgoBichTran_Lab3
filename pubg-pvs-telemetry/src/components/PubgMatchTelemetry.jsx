
import { useState } from "react";

import SquadSelector from "./SquadSelector.jsx";
import TelemetryStatus from "./TelemetryStatus.jsx";

import {
  PUBG_VN_SQUADS,
} from "../data/pubgTelemetry.js";

import {
  useTelemetry,
  TELEMETRY_STATUS,
} from "../hooks/useTelemetry.js";

function PubgMatchTelemetry() {
  const [selectedSquadId, setSelectedSquadId] =
    useState(null);

  const [retryTick, setRetryTick] = useState(0);

  const view = useTelemetry(
    selectedSquadId,
    retryTick
  );

  const selectedSquad = PUBG_VN_SQUADS.find(
    (squad) => squad.id === selectedSquadId
  );

  const handleSelectSquad = (squadId) => {
    setSelectedSquadId(squadId);
  };

  const handleRetry = () => {
    if (!selectedSquadId) {
      return;
    }

    setRetryTick((previous) => previous + 1);
  };

  const isLoading =
    view.status === TELEMETRY_STATUS.LOADING;

  return (
    <section
      className="telemetry-panel"
      aria-labelledby="telemetry-heading"
    >
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            MATCH TELEMETRY
          </p>

          <h2 id="telemetry-heading">
            Live Squad Radar
          </h2>
        </div>

        <span className="live-badge">
          ● DEMO
        </span>
      </div>

      <SquadSelector
        selectedSquadId={selectedSquadId}
        onSelectSquad={handleSelectSquad}
      />

      <div className="telemetry-content">
        {selectedSquad && (
          <p className="helper-text">
            Selected squad: {selectedSquad.name}
          </p>
        )}

        {isLoading && (
          <p className="helper-text">
            Requesting match telemetry...
          </p>
        )}

        <TelemetryStatus
          view={view}
          onRetry={handleRetry}
        />
      </div>
    </section>
  );
}

export default PubgMatchTelemetry;
