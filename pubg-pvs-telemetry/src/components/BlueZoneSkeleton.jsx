
function BlueZoneSkeleton() {
  return (
    <div
      className="blue-zone-skeleton"
      aria-label="Loading match telemetry"
    >
      <div
        className="skeleton-content"
        aria-hidden="true"
      >
        <div className="skeleton-header">
          <div className="skeleton-avatar skeleton-pulse" />

          <div className="skeleton-header-lines">
            <div className="skeleton-line skeleton-title skeleton-pulse" />
            <div className="skeleton-line skeleton-subtitle skeleton-pulse" />
          </div>
        </div>

        <div className="skeleton-stats">
          <div className="skeleton-stat skeleton-pulse" />
          <div className="skeleton-stat skeleton-pulse" />
          <div className="skeleton-stat skeleton-pulse" />
          <div className="skeleton-stat skeleton-pulse" />
        </div>

        <div className="skeleton-footer skeleton-pulse" />
      </div>

      <p className="skeleton-caption">
        Receiving Blue-Zone satellite telemetry...
      </p>
    </div>
  );
}

export default BlueZoneSkeleton;
