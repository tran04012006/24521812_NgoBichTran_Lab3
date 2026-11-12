
export default function HitHistory({ hits, onClear }) {
  return (
    <section
      className="feedback-card"
      aria-labelledby="hit-history-title"
    >
      <div className="feedback-card__header">
        <h3 id="hit-history-title">Recent hits</h3>

        <button
          type="button"
          className="clear-button"
          onClick={onClear}
          disabled={hits.length === 0}
        >
          Clear history
        </button>
      </div>

      <p
        className="feedback-note"
        id="hit-history-description"
      >
        Most recent first; up to 12 hits.
      </p>

      {hits.length === 0 ? (
        <p className="history-empty">
          No hits yet. Play a drum to begin.
        </p>
      ) : (
        <ol
          className="hit-list"
          aria-describedby="hit-history-description"
        >
          {hits.map((hit) => (
            <li
              key={hit.id}
              className="hit-list__item"
            >
              <span className="hit-list__name">
                {hit.name}
              </span>

              <span className="hit-list__metadata">
                Key {hit.key} · {hit.time}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
