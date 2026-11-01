
import {
  PUBG_VN_SQUADS,
} from "../data/pubgTelemetry.js";

function SquadSelector({
  selectedSquadId,
  onSelectSquad,
}) {
  return (
    <section
      className="selector-section"
      aria-labelledby="squad-selector-heading"
    >
      <h3 id="squad-selector-heading">
        Select a PUBG Squad
      </h3>

      <div
        className="squad-list"
        role="group"
        aria-label="PUBG squad selection"
      >
        {PUBG_VN_SQUADS.map((squad) => {
          const isSelected =
            squad.id === selectedSquadId;

          return (
            <button
              key={squad.id}
              type="button"
              className={
                isSelected
                  ? "squad-item squad-item-active"
                  : "squad-item"
              }
              aria-pressed={isSelected}
              onClick={() => onSelectSquad(squad.id)}
            >
              {squad.name}
            </button>
          );
        })}
      </div>

      <p className="helper-text">
        Choose a team to load its match telemetry.
      </p>
    </section>
  );
}

export default SquadSelector;
