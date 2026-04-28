function scoreTone(score) {
  if (score >= 100) return 'tone-exact';
  if (score >= 70) return 'tone-partial';
  return 'tone-none';
}

export function SideBySideTable({ rows }) {
  if (!rows.length) {
    return <div className="empty">No rows to show.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>List A</th>
            <th>List B</th>
            <th>Similarity</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.left}-${row.right}-${index}`}>
              <td className={row.type === 'exact' ? 'exact' : row.type === 'partial' ? 'partial' : ''}>{row.left}</td>
              <td className={row.type === 'exact' ? 'exact' : row.type === 'partial' ? 'partial' : ''}>{row.right}</td>
              <td>
                <span className={`score-pill ${scoreTone(row.score)}`}>{row.score ? `${row.score.toFixed(1)}%` : '-'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InlineDiff({ rows }) {
  if (!rows.length) {
    return <div className="empty">No inline diff to show.</div>;
  }

  return (
    <pre className="inline-diff">
      {rows.map((row, index) => (
        <span
          key={`${row.type}-${index}`}
          className={row.type === 'added' ? 'added' : row.type === 'removed' ? 'removed' : 'same'}
        >
          {row.type === 'added' ? '+ ' : row.type === 'removed' ? '- ' : '  '}
          {row.text}
        </span>
      ))}
    </pre>
  );
}
