import { InlineDiff, SideBySideTable } from './DiffView.jsx';

function renderLines(items, className) {
  if (!items.length) {
    return <li className="list-item muted">No entries</li>;
  }

  return items.map((line, index) => (
    <li key={`${line}-${index}`} className={`list-item ${className}`}>{line}</li>
  ));
}

export default function ResultsPanel({
  result,
  mode,
  selectedDuplicates,
  onToggleDuplicate,
  onSelectAllDuplicates,
  onDeselectAllDuplicates,
  onRemoveSelectedDuplicates,
  duplicateFilter,
  onDuplicateFilter,
}) {
  if (!result) {
    return null;
  }

  return (
    <section className="results-grid">
      <article className="card summary-card">
        <h3>Explain Differences</h3>
        <p>{result.explainSummary}</p>
        <div className="summary-metrics">
          <span>Overall Similarity: {result.bestSimilarityAcrossAll.toFixed(1)}%</span>
          <span>Exact: {result.duplicates.length}</span>
          <span>Partial: {result.partials.length}</span>
          <span>Only A: {result.onlyA.length}</span>
          <span>Only B: {result.onlyB.length}</span>
        </div>
      </article>

      <article className="card diff-card">
        <h3>{mode === 'side' ? 'Side-by-side Comparison' : 'Inline Diff'}</h3>
        {mode === 'side' ? (
          <SideBySideTable rows={result.sideBySideRows} />
        ) : (
          <InlineDiff rows={result.unifiedRows} />
        )}
      </article>

      <article className="card list-card duplicates-card">
        <h3>Common Lines (Exact Duplicates)</h3>
        <div className="dup-tools">
          <input
            type="text"
            className="dup-filter"
            placeholder="Filter duplicates..."
            value={duplicateFilter}
            onChange={(event) => onDuplicateFilter(event.target.value)}
          />
          <button className="btn" onClick={onSelectAllDuplicates} disabled={!result.duplicates.length}>
            Select all
          </button>
          <button className="btn btn-ghost" onClick={onDeselectAllDuplicates} disabled={!selectedDuplicates.size}>
            Deselect all
          </button>
          <button className="btn btn-danger" onClick={onRemoveSelectedDuplicates} disabled={!selectedDuplicates.size}>
            Remove selected duplicates
          </button>
        </div>

        <ul className="dup-list">
          {result.duplicates.length ? result.duplicates
            .filter((line) => line.toLowerCase().includes(duplicateFilter.toLowerCase()))
            .map((line, index) => (
              <li key={`${line}-${index}`} className={`list-item exact dup-row ${selectedDuplicates.has(line) ? 'active' : ''}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedDuplicates.has(line)}
                    onChange={(event) => onToggleDuplicate(line, event.target.checked)}
                  />
                  <span>{line}</span>
                </label>
              </li>
            )) : <li className="list-item muted">No exact duplicates found.</li>}
        </ul>
        <p className="selection-note">
          {selectedDuplicates.size
            ? `${selectedDuplicates.size} selected for removal from List B`
            : 'Select duplicate rows above and remove them from List B'}
        </p>
      </article>

      <article className="card list-card">
        <h3>Only In List A</h3>
        <ul>{renderLines(result.onlyA, '')}</ul>
      </article>

      <article className="card list-card">
        <h3>Only In List B</h3>
        <ul>{renderLines(result.onlyB, '')}</ul>
      </article>

      <article className="card list-card">
        <h3>Partial Similar Lines</h3>
        <ul>
          {result.partials.length ? result.partials.map((item, index) => (
            <li key={`${item.sourceLine}-${index}`} className="list-item partial">
              <div>{item.sourceLine}</div>
              <small>~ {item.targetLine} ({item.score.toFixed(1)}%)</small>
            </li>
          )) : <li className="list-item muted">No partial matches above threshold.</li>}
        </ul>
      </article>

      <article className="card list-card">
        <h3>Cleaned Output</h3>
        <ul>{renderLines(result.mergedCleaned, '')}</ul>
      </article>
    </section>
  );
}
