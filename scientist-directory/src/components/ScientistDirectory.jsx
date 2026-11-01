
import { useId, useState } from "react";
import { SMART_PEOPLE } from "../data/scientists.js";

function ScientistDirectory() {
  // Independent state
  const [query, setQuery] = useState("");
  const [minIq, setMinIq] = useState(160);

  // Accessible input IDs
  const searchId = useId();
  const minIqId = useId();

  // Derived state: name search only for Commit 5
  const normalizedQuery = query.trim().toLowerCase();

  const visiblePeople = SMART_PEOPLE.filter((person) =>
    person.name.toLowerCase().includes(normalizedQuery)
  );

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleMinIqChange = (event) => {
    const value = event.target.valueAsNumber;

    setMinIq(Number.isNaN(value) ? null : value);
  };

  return (
    <section
      className="scientist-directory"
      aria-label="Pioneer Directory"
    >
      <div className="directory-header">
        <h2>Scientist Directory</h2>

        <p>
          Explore famous scientists and pioneers.
        </p>
      </div>

      <form
        className="directory-controls"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="form-group">
          <label htmlFor={searchId}>
            Search by scientist name
          </label>

          <input
            id={searchId}
            type="search"
            placeholder="Search scientists..."
            value={query}
            onChange={handleSearchChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor={minIqId}>
            Minimum IQ
          </label>

          <input
            id={minIqId}
            type="number"
            min="0"
            step="1"
            value={minIq ?? ""}
            onChange={handleMinIqChange}
          />
        </div>
      </form>

      <p
        className="result-count"
        role="status"
        aria-live="polite"
      >
        Found {visiblePeople.length}{" "}
        {visiblePeople.length === 1
          ? "scientist"
          : "scientists"}
      </p>

      {visiblePeople.length > 0 ? (
        <div className="scientist-list">
          {visiblePeople.map((person) => (
            <article
              className="scientist-card"
              key={person.id}
            >
              <h3>{person.name}</h3>

              <div className="scientist-info">
                <p>
                  <strong>Age:</strong> {person.age}
                </p>

                <p>
                  <strong>IQ:</strong> {person.iq}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No scientists found.</p>
          <p>Try changing your search criteria.</p>
        </div>
      )}
    </section>
  );
}

export default ScientistDirectory;
