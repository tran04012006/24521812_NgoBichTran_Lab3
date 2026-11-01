
import { useRef, useState } from "react";

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

  const selectorContainerRef = useRef(null);

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

    const selectedButton =
      selectorContainerRef.current?.querySelector(
        '[aria-pressed="true"]'
      );

    selectedButton?.focus();

    setRetryTick((previous) => previous + 1);
  };

  const isLoading =
    view.status === TELEMETRY_STATUS.LOADING;

  let statusMessage = "";

  switch (view.status) {
    case TELEMETRY_STATUS.IDLE:
      statusMessage =
        "Telemetry ready. Select a squad.";
      break;

    case TELEMETRY_STATUS.LOADING:
      statusMessage = selectedSquad
        ? `Loading telemetry for ${selectedSquad.name}.`
        : "Loading telemetry.";
      break;

    case TELEMETRY_STATUS.SUCCESS:
      statusMessage = view.data
        ? `${view.data.name} telemetry loaded successfully.`
        : "Telemetry response received.";
      break;

    case TELEMETRY_STATUS.ERROR:
      statusMessage = "";
      break;

    default:
      break;
  }

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

      <div ref={selectorContainerRef}>
        <SquadSelector
          selectedSquadId={selectedSquadId}
          onSelectSquad={handleSelectSquad}
        />
      </div>

      <div
        className="screen-reader-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {statusMessage}
      </div>

      <div
        id="telemetry-results"
        className="telemetry-content"
        role="region"
        aria-label="PUBG squad telemetry results"
        aria-busy={isLoading}
      >
        {selectedSquad && (
          <p className="helper-text selected-squad-label">
            Selected squad: {selectedSquad.name}
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
