
import DrumKit from "./components/DrumKit.jsx";

export default function App() {
  return (
    <main className="app-shell">
      <header className="intro">
        <p className="eyebrow">
          Homework 1 · React 19
        </p>

        <h1>Production Studio Drum Kit</h1>

        <p className="description">
          Play seven synthesized drums with a mouse,
          touch, or keyboard. Follow the recent-hit
          history and live digital sound-level meter
          for feedback that does not depend on
          hearing the sounds.
        </p>
      </header>

      <DrumKit />
    </main>
  );
}
