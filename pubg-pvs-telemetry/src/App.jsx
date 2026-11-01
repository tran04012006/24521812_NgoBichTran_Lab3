
import PubgMatchTelemetry from "./components/PubgMatchTelemetry.jsx";
import "./styles/App.css";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-content">
          <p className="app-overline">
            KRAFTON × PUBG VIETNAM SERIES
          </p>

          <h1>PVS Live Telemetry</h1>

          <p className="app-subtitle">
            Fault-tolerant esports match radar
            for Vietnamese PUBG pro squads.
          </p>
        </div>

        <div className="header-indicator">
          EXERCISE 3
        </div>
      </header>

      <main className="main-content">
        <PubgMatchTelemetry />
      </main>

      <footer className="app-footer">
        PUBG Vietnam Series — Simulated
        Match Telemetry
      </footer>
    </div>
  );
}

export default App;
