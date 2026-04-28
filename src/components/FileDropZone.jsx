import { useRef } from 'react';

const ACCEPTED = ['text/plain', 'text/csv', 'application/vnd.ms-excel'];

export default function FileDropZone({ label, onLoaded }) {
  const inputRef = useRef(null);

  async function readFile(file) {
    if (!file) return;

    if (!ACCEPTED.includes(file.type) && !/\.(txt|csv)$/i.test(file.name)) {
      alert('Please upload only TXT or CSV files.');
      return;
    }

    const text = await file.text();
    onLoaded(text);
  }

  function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    readFile(file);
  }

  function handleInput(event) {
    const file = event.target.files?.[0];
    readFile(file);
    event.target.value = '';
  }

  return (
    <div
      className="drop-zone"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <div className="drop-zone-label">{label}</div>
      <div className="drop-zone-help">Drag & drop TXT/CSV or click to upload</div>
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.csv,text/plain,text/csv"
        className="hidden-input"
        onChange={handleInput}
      />
    </div>
  );
}
