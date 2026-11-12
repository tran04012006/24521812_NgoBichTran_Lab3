
import DrumKit from "./components/DrumKit.jsx";

export default function App() {
  return (
    <main className="app-shell">
      <header className="intro">
        <p className="eyebrow">
          Homework 1 · React 19
        </p>

        <h1>
          Production Studio Drum Kit
        </h1>

        <p className="description">
          A responsive, accessible drum-pad interface.
          Select pads by mouse, touch, or standard
          button keyboard controls. Audio playback
          and dedicated drum shortcuts will be
          added in Task 3.
        </p>
      </header>

      <DrumKit />
    </main>
  );
}
