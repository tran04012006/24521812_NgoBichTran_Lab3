
import { useState } from "react";

import SquadSelector from "./SquadSelector.jsx";
import TelemetryStatus from "./TelemetryStatus.jsx";

import { useTelemetry } from "../hooks/useTelemetry.js";

function PubgMatchTelemetry() {
  const [selectedSquadId, setSelectedSquadId] =
    useState(null);

  const view = useTelemetry(selectedSquadId);

  const handleSelectSquad = (squadId) => {
    setSelectedSquadId(squadId);
  };

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
        <TelemetryStatus view={view} />
      </div>
    </section>
  );
}

export default PubgMatchTelemetry;
