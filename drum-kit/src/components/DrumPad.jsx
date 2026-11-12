
export default function DrumPad({
  drum,
  isActive,
  onTrigger,
}) {
  return (
    <button
      type="button"
      className={
        `drum-pad drum-pad--${drum.color}` +
        (isActive ? " is-active" : "")
      }
      aria-label={
        `${drum.name} drum pad, physical key ${drum.key}`
      }
      onClick={() => onTrigger(drum.id)}
    >
      <span
        className="drum-pad__key"
        aria-hidden="true"
      >
        {drum.key}
      </span>

      <span
        className="drum-pad__name"
        aria-hidden="true"
      >
        {drum.name}
      </span>

      <span
        className="drum-pad__hint"
        aria-hidden="true"
      >
        {isActive ? "Playing" : "Play drum"}
      </span>
    </button>
  );
}
