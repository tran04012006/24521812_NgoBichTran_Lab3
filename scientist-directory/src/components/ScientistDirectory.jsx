
import { SMART_PEOPLE } from "../data/scientists.js";

function ScientistDirectory() {
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
