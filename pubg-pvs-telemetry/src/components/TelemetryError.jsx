
function TelemetryError({ error, onRetry }) {
  return (
    <section
      className="telemetry-message error-message"
      role="alert"
      aria-labelledby="telemetry-error-heading"
    >
      <h3 id="telemetry-error-heading">
        Satellite Connection Lost
      </h3>

      <p>
        {error ||
          "Unable to retrieve PUBG match telemetry."}
      </p>

      <p>
        The selected squad may be experiencing
        packet loss or a connection timeout.
      </p>

      <button
        type="button"
        className="retry-button"
        onClick={onRetry}
      >
        Reconnect Satellite (Retry)
      </button>
    </section>
  );
}

export default TelemetryError;
