
import { useId, useState } from "react";
import { SMART_PEOPLE } from "../data/scientists.js";

function ScientistDirectory() {
  // ======================================
  // 1. Independent React states
  // ======================================

  const [query, setQuery] = useState("");
  const [minIq, setMinIq] = useState(160);

  // ======================================
  // 2. Accessible input IDs
  // ======================================

  const searchId = useId();
  const minIqId = useId();

  // ======================================
  // 3. Derived values
  // ======================================

  // Normalize the search query
  const normalizedQuery = query.trim().toLowerCase();

  // Treat an empty IQ input as no restriction
  const effectiveMinIq = minIq ?? 0;

  // Apply name and IQ filters together
  const visiblePeople = SMART_PEOPLE.filter((person) => {
    const matchesName = person.name
      .toLowerCase()
      .includes(normalizedQuery);

    const matchesIq = person.iq >= effectiveMinIq;

    return matchesName && matchesIq;
  });

  // ======================================
  // 4. Event handlers
  // ======================================

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleMinIqChange = (event) => {
    const value = event.target.valueAsNumber;

    // Avoid storing NaN in React state
    setMinIq(Number.isNaN(value) ? null : value);
  };

  // ======================================
  // 5. Render UI
  // ======================================

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

      {/* Search and IQ controls */}
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

      {/* Accessible live result count */}
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

      {/* Scientist cards or empty state */}
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

          <p>
            Try changing your search or minimum IQ.
          </p>
        </div>
      )}
    </section>
  );
}

export default ScientistDirectory;
