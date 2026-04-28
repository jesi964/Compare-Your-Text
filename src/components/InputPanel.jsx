import FileDropZone from './FileDropZone.jsx';

export default function InputPanel({
  title,
  subtitle,
  value,
  onChange,
  onFileLoaded,
  count,
}) {
  return (
    <section className="input-panel card">
      <div className="input-head">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <span className="count-pill">{count} lines</span>
      </div>

      <FileDropZone label={`Upload for ${title}`} onLoaded={onFileLoaded} />

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste lines, paragraphs, or mixed text here..."
      />
    </section>
  );
}
