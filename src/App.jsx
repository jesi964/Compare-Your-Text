import { useMemo, useState } from 'react';
import ControlsBar from './components/ControlsBar.jsx';
import InputPanel from './components/InputPanel.jsx';
import LoadingOverlay from './components/LoadingOverlay.jsx';
import ResultsPanel from './components/ResultsPanel.jsx';
import { compareTexts } from './utils/compareEngine.js';
import { exportAsCsv, exportAsJson, exportAsText } from './utils/exporters.js';
import { detectInputType, parseText, uniqueByNormalized } from './utils/text.js';

function toExportRows(result) {
  const rows = [];

  result.duplicates.forEach((line) => {
    rows.push({ section: 'common', line, similarityScore: 100 });
  });

  result.partials.forEach((item) => {
    rows.push({ section: 'partial', line: `${item.sourceLine} ~ ${item.targetLine}`, similarityScore: item.score.toFixed(2) });
  });

  result.onlyA.forEach((line) => {
    rows.push({ section: 'onlyA', line, similarityScore: 0 });
  });

  result.onlyB.forEach((line) => {
    rows.push({ section: 'onlyB', line, similarityScore: 0 });
  });

  result.mergedCleaned.forEach((line) => {
    rows.push({ section: 'cleaned', line, similarityScore: '' });
  });

  return rows;
}

export default function App() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [mode, setMode] = useState('side');
  const [darkMode, setDarkMode] = useState(true);
  const [fuzzyThreshold, setFuzzyThreshold] = useState(72);
  const [mergeSimilar, setMergeSimilar] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedDuplicates, setSelectedDuplicates] = useState(new Set());
  const [duplicateFilter, setDuplicateFilter] = useState('');

  const lineCountA = useMemo(() => parseText(textA).length, [textA]);
  const lineCountB = useMemo(() => parseText(textB).length, [textB]);

  const detectedType = useMemo(() => {
    const typeA = detectInputType(textA);
    const typeB = detectInputType(textB);
    return typeA === 'paragraph' || typeB === 'paragraph' ? 'Paragraph/List Mixed' : 'List';
  }, [textA, textB]);

  function runCompare(nextA, nextB) {
    const compared = compareTexts(nextA, nextB, fuzzyThreshold);

    if (!mergeSimilar) {
      compared.mergedCleaned = uniqueByNormalized([...compared.cleanedA, ...compared.cleanedB]);
    }

    setResult(compared);
    setSelectedDuplicates(new Set());
    setDuplicateFilter('');
  }

  function handleCompare() {
    setLoading(true);

    requestAnimationFrame(() => {
      runCompare(textA, textB);
      setLoading(false);
    });
  }

  function handleClean() {
    if (!result) return;
    const cleanedB = uniqueByNormalized(result.rawB).filter(
      (line) => !new Set(result.duplicates.map((dup) => dup.toLowerCase().trim())).has(line.toLowerCase().trim())
    );
    const nextB = cleanedB.join('\n');
    setTextB(nextB);
    runCompare(textA, nextB);
  }

  function toggleDuplicate(line, checked) {
    setSelectedDuplicates((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(line);
      } else {
        next.delete(line);
      }
      return next;
    });
  }

  function selectAllDuplicates() {
    if (!result) return;
    const visible = result.duplicates.filter((line) => line.toLowerCase().includes(duplicateFilter.toLowerCase()));
    setSelectedDuplicates(new Set(visible));
  }

  function deselectAllDuplicates() {
    setSelectedDuplicates(new Set());
  }

  function removeSelectedDuplicates() {
    if (!result || !selectedDuplicates.size) return;

    const selectedNorm = new Set(Array.from(selectedDuplicates).map((line) => line.toLowerCase().trim()));
    const filtered = parseText(textB).filter((line) => !selectedNorm.has(line.toLowerCase().trim()));
    const nextB = filtered.join('\n');
    setTextB(nextB);
    runCompare(textA, nextB);
  }

  function handleClear() {
    setTextA('');
    setTextB('');
    setResult(null);
    setSelectedDuplicates(new Set());
    setDuplicateFilter('');
  }

  function exportData(format) {
    if (!result) return;

    const rows = toExportRows(result);
    const payload = {
      meta: {
        detectedType,
        fuzzyThreshold,
        generatedAt: new Date().toISOString(),
      },
      result,
    };

    if (format === 'csv') {
      exportAsCsv(rows, 'comparison-report.csv');
      return;
    }

    if (format === 'json') {
      exportAsJson(payload, 'comparison-report.json');
      return;
    }

    const plain = rows.map((row) => `${row.section}\t${row.line}\t${row.similarityScore}`).join('\n');
    exportAsText(plain, 'comparison-report.txt');
  }

  return (
    <div className={darkMode ? 'app dark' : 'app light'}>
      <LoadingOverlay visible={loading} />

      <header className="hero card">
        <div>
          <p className="eyebrow">Text Comparator</p>
          <h1>Compare Lists & Paragraphs with Smart Similarity</h1>
          <p>
            Red means exact duplicate, yellow means near match, and neutral means unique content.
          </p>
        </div>
        <div className="hero-chip">Detected Input: {detectedType}</div>
      </header>

      <main className="main-grid">
        <InputPanel
          title="List A"
          subtitle="Reference input"
          value={textA}
          onChange={setTextA}
          onFileLoaded={setTextA}
          count={lineCountA}
        />
        <InputPanel
          title="List B"
          subtitle="Input to compare"
          value={textB}
          onChange={setTextB}
          onFileLoaded={setTextB}
          count={lineCountB}
        />
      </main>

      <ControlsBar
        mode={mode}
        setMode={setMode}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        fuzzyThreshold={fuzzyThreshold}
        setFuzzyThreshold={setFuzzyThreshold}
        mergeSimilar={mergeSimilar}
        setMergeSimilar={setMergeSimilar}
        onCompare={handleCompare}
        onClean={handleClean}
        onClear={handleClear}
        canClean={Boolean(result?.duplicates.length)}
      />

      <section className="exports card">
        <h2>Export</h2>
        <div className="btn-row">
          <button className="btn" onClick={() => exportData('csv')} disabled={!result}>डाउनलोड CSV</button>
          <button className="btn" onClick={() => exportData('json')} disabled={!result}>डाउनलोड JSON</button>
          <button className="btn" onClick={() => exportData('txt')} disabled={!result}>डाउनलोड Text</button>
        </div>
      </section>

      <ResultsPanel
        result={result}
        mode={mode}
        selectedDuplicates={selectedDuplicates}
        onToggleDuplicate={toggleDuplicate}
        onSelectAllDuplicates={selectAllDuplicates}
        onDeselectAllDuplicates={deselectAllDuplicates}
        onRemoveSelectedDuplicates={removeSelectedDuplicates}
        duplicateFilter={duplicateFilter}
        onDuplicateFilter={setDuplicateFilter}
      />
    </div>
  );
}
