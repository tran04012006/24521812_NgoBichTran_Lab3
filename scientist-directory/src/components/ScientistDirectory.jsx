
import { useId, useState } from "react";
import { SMART_PEOPLE } from "../data/scientists.js";

function ScientistDirectory() {
  // 1. Independent states
  const [people, setPeople] = useState(SMART_PEOPLE);
  const [query, setQuery] = useState("");
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState("iq-desc");

  // 2. Accessible IDs
  const searchId = useId();
  const minIqId = useId();
  const sortId = useId();

  // 3. Derived values
  const normalizedQuery = query.trim().toLowerCase();
  const effectiveMinIq = minIq ?? 0;

  const visiblePeople = people
    .filter((person) => {
      const matchesName = person.name
        .toLowerCase()
        .includes(normalizedQuery);

      const matchesIq = person.iq >= effectiveMinIq;

      return matchesName && matchesIq;
    })
    .toSorted((a, b) =>
      sortBy === "iq-desc"
        ? b.iq - a.iq
        : a.iq - b.iq
    );

  // 4. Event handlers
  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleMinIqChange = (event) => {
    const value = event.target.valueAsNumber;

    setMinIq(Number.isNaN(value) ? null : value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // 5. Immutable deletion
  const handleDelete = (id) => {
    setPeople((prevPeople) =>
      prevPeople.filter((person) => person.id !== id)
    );
  };

  // 6. Render
  return (
    <section
      className="scientist-directory"
      aria-label="Pioneer Directory"
    >
      <div className="directory-header">
        <h2>Scientist Directory</h2>
        <p>Explore famous scientists and pioneers.</p>
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

        <div className="form-group">
          <label htmlFor={sortId}>
            Sort by IQ
          </label>
          <select
            id={sortId}
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="iq-desc">
              Highest IQ first
            </option>
            <option value="iq-asc">
              Lowest IQ first
            </option>
          </select>
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

              <button
                type="button"
                className="delete-button"
                aria-label={`Delete ${person.name}`}
                onClick={() => handleDelete(person.id)}
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No scientists found.</p>
          <p>Try changing your search or minimum IQ.</p>
        </div>
      )}
    </section>
  );
}

export default ScientistDirectory;
