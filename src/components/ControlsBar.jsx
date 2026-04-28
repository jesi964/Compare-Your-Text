export default function ControlsBar({
  mode,
  setMode,
  darkMode,
  setDarkMode,
  fuzzyThreshold,
  setFuzzyThreshold,
  mergeSimilar,
  setMergeSimilar,
  onCompare,
  onClean,
  onClear,
  canClean,
}) {
  const strictnessLabel = fuzzyThreshold >= 85 ? 'Strict' : fuzzyThreshold >= 70 ? 'Balanced' : 'Flexible';

  return (
    <section className="controls card">
      <div className="control-row">
        <div className="toggle-group">
          <span>Diff View</span>
          <button
            className={mode === 'side' ? 'toggle active' : 'toggle'}
            onClick={() => setMode('side')}
          >
            Side-by-side
          </button>
          <button
            className={mode === 'inline' ? 'toggle active' : 'toggle'}
            onClick={() => setMode('inline')}
          >
            Inline
          </button>
        </div>

        <div className="toggle-group">
          <span>Theme</span>
          <button
            className={darkMode ? 'toggle active' : 'toggle'}
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {darkMode ? 'Dark' : 'Light'}
          </button>
        </div>
      </div>

      <div className="control-row">
        <label className="slider-wrap">
          <span>Similarity sensitivity: {fuzzyThreshold}% ({strictnessLabel})</span>
          <input
            type="range"
            min="55"
            max="95"
            value={fuzzyThreshold}
            onChange={(event) => setFuzzyThreshold(Number(event.target.value))}
          />
        </label>

        <label className="check-wrap">
          <input
            type="checkbox"
            checked={mergeSimilar}
            onChange={(event) => setMergeSimilar(event.target.checked)}
          />
          Merge similar lines in cleaned output
        </label>
      </div>

      <p className="helper-text">
        Similarity sensitivity decides how close two lines should be to count as a near match.
        Higher value means stricter matching, lower value means more flexible matching.
      </p>

      <div className="btn-row">
        <button className="btn btn-primary" onClick={onCompare}>Compare</button>
        <button className="btn" onClick={onClean} disabled={!canClean}>One-click clean</button>
        <button className="btn btn-ghost" onClick={onClear}>Clear</button>
      </div>
    </section>
  );
}
