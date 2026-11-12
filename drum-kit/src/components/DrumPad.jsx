
export default function DrumPad({
  drum,
  isSelected,
  onSelect,
}) {
  return (
    <button
      className={
        `drum-pad drum-pad--${drum.color}` +
        (isSelected ? " is-selected" : "")
      }
      type="button"
      aria-label={`${drum.name} drum pad, key ${drum.key}`}
      aria-pressed={isSelected}
      onClick={() => onSelect(drum.id)}
    >
      <span className="drum-pad__key" aria-hidden="true">
        {drum.key}
      </span>

      <span className="drum-pad__name" aria-hidden="true">
        {drum.name}
      </span>

      <span className="drum-pad__hint" aria-hidden="true">
        {isSelected ? "Selected" : "Select pad"}
      </span>
    </button>
  );
}
