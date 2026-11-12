
import "./RecorderControls.css";

const SPEED_OPTIONS = [0.5, 1, 2];

function RecorderControls({
  isRecording,
  isPlaying,
  events,
  playbackSpeed,
  onSpeedChange,
  onStartRecording,
  onStopRecording,
  onPlay,
  onStopPlayback,
  onClearRecording,
}) {
  const hasEvents = events.length > 0;

  const statusText = isRecording
    ? "Recording"
    : isPlaying
      ? "Playing"
      : "Idle";

  return (
    <section className="recorder-panel">
      <div className="recorder-panel__header">
        <div>
          <h3>FIFO Sequencer</h3>

          <p>
            Record your notes and replay them
            with their original timing.
          </p>
        </div>

        <span
          className={[
            "recorder-status",
            isRecording
              ? "recorder-status--recording"
              : "",
            isPlaying
              ? "recorder-status--playing"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          role="status"
        >
          {statusText}
        </span>
      </div>

      <div className="recorder-panel__controls">
        {!isRecording ? (
          <button
            type="button"
            className="recorder-button recorder-button--record"
            onClick={onStartRecording}
            disabled={isPlaying}
          >
            Start Recording
          </button>
        ) : (
          <button
            type="button"
            className="recorder-button recorder-button--stop"
            onClick={onStopRecording}
          >
            Stop Recording
          </button>
        )}

        <button
          type="button"
          className="recorder-button recorder-button--play"
          onClick={onPlay}
          disabled={
            !hasEvents ||
            isRecording ||
            isPlaying
          }
        >
          Play Recording
        </button>

        <button
          type="button"
          className="recorder-button recorder-button--stop"
          onClick={onStopPlayback}
          disabled={!isPlaying}
        >
          Stop Playback
        </button>

        <button
          type="button"
          className="recorder-button recorder-button--clear"
          onClick={onClearRecording}
          disabled={
            !hasEvents ||
            isRecording ||
            isPlaying
          }
        >
          Clear
        </button>
      </div>

      <div className="recorder-speed">
        <span>Playback Speed</span>

        <div
          className="recorder-speed__options"
          role="group"
          aria-label="Playback speed"
        >
          {SPEED_OPTIONS.map((speed) => (
            <button
              key={speed}
              type="button"
              className={
                playbackSpeed === speed
                  ? "recorder-speed__button recorder-speed__button--active"
                  : "recorder-speed__button"
              }
              onClick={() => onSpeedChange(speed)}
              disabled={isPlaying}
              aria-pressed={playbackSpeed === speed}
            >
              {speed}×
            </button>
          ))}
        </div>
      </div>

      <div className="recorder-events">
        <div className="recorder-events__header">
          <h4>Recorded Events</h4>

          <span>
            {events.length}{" "}
            {events.length === 1
              ? "event"
              : "events"}
          </span>
        </div>

        {isRecording ? (
          <p className="recorder-events__message">
            Recording in progress. Play your notes
            and press Stop Recording to finish.
          </p>
        ) : !hasEvents ? (
          <p className="recorder-events__message">
            No recording available. Press Start
            Recording and play some notes.
          </p>
        ) : (
          <div className="recorder-events__scroll">
            <table className="recorder-events__table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>MIDI</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Delta</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{event.midi}</td>
                    <td>
                      {event.freqHz.toFixed(2)} Hz
                    </td>
                    <td>
                      {event.durationMs.toFixed(0)} ms
                    </td>
                    <td>
                      {event.deltaMs.toFixed(0)} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default RecorderControls;
