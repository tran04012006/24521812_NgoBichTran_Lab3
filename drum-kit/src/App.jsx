
const plannedFeatures = [
  "Seven physical keyboard shortcuts",
  "Click-to-play drum pads",
  "Accessible hit history",
  "Visual sound-level feedback",
];

export default function App() {
  return (
    <main className="app-shell">
      <section
        className="intro"
        aria-labelledby="page-title"
      >
        <p className="eyebrow">
          HOMEWORK 1 · REACT 19
        </p>

        <h1 id="page-title">
          Production Studio Drum Kit
        </h1>

        <p className="description">
          An accessible, keyboard-friendly drum studio.
          This is the Task 1 foundation; interactive
          pads and audio arrive in later tasks.
        </p>
      </section>

      <section
        className="feature-panel"
        aria-labelledby="features-title"
      >
        <h2 id="features-title">
          Features we will build
        </h2>

        <ul className="feature-list">
          {plannedFeatures.map((feature) => (
            <li key={feature}>
              {feature}
            </li>
          ))}
        </ul>

        <p className="status">
          Task 1: Project setup
        </p>
      </section>
    </main>
  );
}
