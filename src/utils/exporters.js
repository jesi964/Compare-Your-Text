function download(content, fileName, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function exportAsText(data, fileName = 'comparison.txt') {
  download(data, fileName, 'text/plain;charset=utf-8');
}

export function exportAsJson(data, fileName = 'comparison.json') {
  download(JSON.stringify(data, null, 2), fileName, 'application/json;charset=utf-8');
}

function toCsvRow(values) {
  return values
    .map((value) => {
      const str = String(value ?? '');
      return `"${str.replace(/"/g, '""')}"`;
    })
    .join(',');
}

export function exportAsCsv(rows, fileName = 'comparison.csv') {
  const headers = ['section', 'line', 'similarityScore'];
  const body = rows.map((row) => toCsvRow([row.section, row.line, row.similarityScore]));
  const csv = [toCsvRow(headers), ...body].join('\n');
  download(csv, fileName, 'text/csv;charset=utf-8');
}
