
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { SMART_PEOPLE } from "../data/scientists.js";

function ScientistDirectory() {
  // ============================================
  // 1. Independent React states
  // ============================================

  const [people, setPeople] = useState(SMART_PEOPLE);
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
  // 3. DOM and focus references
  // ============================================

  const listRef = useRef(null);
  const resetRef = useRef(null);
  const pendingFocusIndex = useRef(null);

  // ============================================
  // 4. Derived-state pipeline
  // ============================================

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

  // ============================================
  // 5. Restore focus after deletion
  // ============================================

  useLayoutEffect(() => {
    const deletedIndex = pendingFocusIndex.current;

    if (deletedIndex === null) {
      return;
    }

    // Clear the pending request
    pendingFocusIndex.current = null;

    // Get the Delete buttons still in the DOM
    const remainingButtons =
      listRef.current?.querySelectorAll(
        ".delete-button"
      );

    if (remainingButtons?.length > 0) {
      // Focus next item, or previous if last was deleted
      const nextIndex = Math.min(
        deletedIndex,
        remainingButtons.length - 1
      );

      remainingButtons[nextIndex].focus();
    } else {
      // If no scientists are visible, focus Reset
      resetRef.current?.focus();
    }
  }, [people]);

  // ============================================
  // 6. Input handlers
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
  // 7. Immutable deletion
  // ============================================

  const handleDelete = (id, index) => {
    // Remember the position to restore keyboard focus
    pendingFocusIndex.current = index;

    // Update the scientist collection immutably
    setPeople((prevPeople) =>
      prevPeople.filter((person) => person.id !== id)
    );
  };

  // ============================================
  // 8. Reset all state
  // ============================================

  const handleReset = () => {
    pendingFocusIndex.current = null;

    setPeople(SMART_PEOPLE);
    setQuery("");
    setMinIq(160);
    setSortBy("iq-desc");
  };

  // ============================================
  // 9. Render
  // ============================================

  return (
    <section
      className="scientist-directory"
      aria-label="Pioneer Directory"
    >
      {/* Directory header */}
      <div className="directory-header">
        <div>
          <h2>Scientist Directory</h2>
          <p>
            Explore famous scientists and pioneers.
          </p>
        </div>

        <button
          ref={resetRef}
          type="button"
          className="reset-button"
          onClick={handleReset}
        >
          Reset Directory
        </button>
      </div>

      {/* Search and filter controls */}
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

      {/* Screen-reader accessible result count */}
      <p
        className="result-count"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Found {visiblePeople.length}{" "}
        {visiblePeople.length === 1
          ? "scientist"
          : "scientists"}
      </p>

      {/* Scientist results */}
      {visiblePeople.length > 0 ? (
        <div
          className="scientist-list"
          ref={listRef}
        >
          {visiblePeople.map((person, index) => (
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
                onClick={() =>
                  handleDelete(person.id, index)
                }
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No scientists found.</p>

          <p>
            Try changing your filters or
            resetting the directory.
          </p>
        </div>
      )}
    </section>
  );
}

export default ScientistDirectory;
