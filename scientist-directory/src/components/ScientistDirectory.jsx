
import { useId, useState } from "react";
import { SMART_PEOPLE } from "../data/scientists.js";

function ScientistDirectory() {
  // Independent state: the text entered by the user
  const [query, setQuery] = useState("");

  // Generate a unique ID for the search input
  const searchId = useId();

  // Normalize the search query
  const normalizedQuery = query.trim().toLowerCase();

  // Derived state: calculate matching scientists
  const visiblePeople = SMART_PEOPLE.filter((person) =>
    person.name.toLowerCase().includes(normalizedQuery)
  );

  // Handle changes in the search input
  const handleSearchChange = (event) => {
    setQuery(event.target.value);
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

      {/* Search input */}
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
      </form>

      {/* Live result count */}
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

      {/* Results */}
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
          <p>Try searching for another name.</p>
        </div>
      )}
    </section>
  );
}

export default ScientistDirectory;
