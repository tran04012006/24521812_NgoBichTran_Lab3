
import { useId, useState } from "react";
import { SMART_PEOPLE } from "../data/scientists.js";

function ScientistDirectory() {
  const [query, setQuery] = useState("");
  const searchId = useId();

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
            onChange={(event) =>
              setQuery(event.target.value)
            }
          />
        </div>
      </form>

      <div className="scientist-list">
        {SMART_PEOPLE.map((person) => (
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
    </section>
  );
}

export default ScientistDirectory;
