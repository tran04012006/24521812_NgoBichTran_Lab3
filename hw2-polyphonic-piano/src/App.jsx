
import Piano from "./components/Piano.jsx";
import "./App.css";

function App() {
  return (
    <main className="app">
      <header className="app-header">
        <div className="app-header__badge">
          HOMEWORK 2 | REACT 19
        </div>

        <h1>
          88-Key Polyphonic Piano
          <span> & Concurrent FIFO Sequencer</span>
        </h1>

        <p className="app-header__description">
          An interactive piano built with React 19.
          Explore all 88 notes before adding polyphonic
          sound generation, voice stealing, recording,
          and asynchronous playback.
        </p>
      </header>

      <Piano />

      <section className="upcoming-features">
        <h2>Upcoming Features</h2>

        <div className="feature-grid">
          <article className="feature-card">
            <h3>Polyphonic Audio</h3>
            <p>
              Play up to 8 simultaneous notes using
              the Web Audio API.
            </p>
            <span>Task 2</span>
          </article>

          <article className="feature-card">
            <h3>Keyboard Controls</h3>
            <p>
              Play notes using physical keyboard
              and pointer interactions.
            </p>
            <span>Task 3</span>
          </article>

          <article className="feature-card">
            <h3>FIFO Sequencer</h3>
            <p>
              Record musical events and replay them
              at different speeds.
            </p>
            <span>Task 4</span>
          </article>
        </div>
      </section>

      <footer className="app-footer">
        <p>
          HW2 — React 19 | 88-Key Piano |
          Concurrent FIFO Sequencer
        </p>
      </footer>
    </main>
  );
}

export default App;
