
import { useId, useState } from "react";
import { SMART_PEOPLE } from "../data/scientists.js";

function ScientistDirectory() {
  // ============================================
  // 1. Independent states
  // ============================================

  const [query, setQuery] = useState("");
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState("iq-desc");

  // ============================================
  // 2. Accessible IDs
  // ============================================

  const searchId = useId();
  const minIqId = useId();
  const sortId = useId();

  // ============================================
  // 3. Normalize filter values
  // ============================================

  const normalizedQuery = query.trim().toLowerCase();

  // An empty IQ input means no restriction
  const effectiveMinIq = minIq ?? 0;

  // ============================================
  // 4. Derived-state pipeline
  // ============================================

  const visiblePeople = SMART_PEOPLE
    // Filter by name and minimum IQ
    .filter((person) => {
      const matchesName = person.name
        .toLowerCase()
        .includes(normalizedQuery);

      const matchesIq = person.iq >= effectiveMinIq;

      return matchesName && matchesIq;
    })

    // Sort filtered results without mutation
    .toSorted((a, b) =>
      sortBy === "iq-desc"
        ? b.iq - a.iq
        : a.iq - b.iq
    );

  // ============================================
  // 5. Event handlers
  // ============================================

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

  // ============================================
  // 6. Render
  // ============================================

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

      {/* Interactive controls */}
      <form
        className="directory-controls"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        {/* Name search */}
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

        {/* Minimum IQ filter */}
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

        {/* IQ sorting */}
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

      {/* Scientist list */}
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
