
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
          Play seven synthesized drum sounds by
          clicking a pad or using physical keyboard
          shortcuts. Hit history and the sound-level
          meter follow in Task 4.
        </p>
      </header>

      <DrumKit />
    </main>
  );
}
