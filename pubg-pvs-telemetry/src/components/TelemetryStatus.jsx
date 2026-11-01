
import BlueZoneSkeleton from "./BlueZoneSkeleton.jsx";
import TelemetryError from "./TelemetryError.jsx";
import TelemetrySuccess from "./TelemetrySuccess.jsx";

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

    case TELEMETRY_STATUS.SUCCESS:
      if (!view.data) {
        return (
          <TelemetryError
            error="No squad data was returned."
            onRetry={onRetry}
          />
        );
      }

      return (
        <TelemetrySuccess squad={view.data} />
      );

    default:
      return null;
  }
}

export default TelemetryStatus;
