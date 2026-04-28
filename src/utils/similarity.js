import { normalizeText } from './text.js';

export function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);

  for (let j = 0; j <= b.length; j += 1) {
    prev[j] = j;
  }

  for (let i = 1; i <= a.length; i += 1) {
    curr[0] = i;
    const charA = a[i - 1];

    for (let j = 1; j <= b.length; j += 1) {
      const cost = charA === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + cost
      );
    }

    for (let j = 0; j <= b.length; j += 1) {
      prev[j] = curr[j];
    }
  }

  return prev[b.length];
}

export function similarityScore(a, b) {
  const left = normalizeText(a);
  const right = normalizeText(b);

  if (!left && !right) return 100;
  const maxLen = Math.max(left.length, right.length);
  if (!maxLen) return 100;

  const dist = levenshteinDistance(left, right);
  const score = ((maxLen - dist) / maxLen) * 100;
  return Math.max(0, Math.min(100, Number(score.toFixed(2))));
}

export function findBestSimilarLines(source, target, threshold = 70) {
  const result = [];

  for (let i = 0; i < source.length; i += 1) {
    const sourceLine = source[i];
    let bestIndex = -1;
    let bestScore = -1;

    for (let j = 0; j < target.length; j += 1) {
      const score = similarityScore(sourceLine, target[j]);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = j;
      }
    }

    if (bestScore >= threshold && bestIndex !== -1) {
      result.push({
        sourceIndex: i,
        targetIndex: bestIndex,
        sourceLine,
        targetLine: target[bestIndex],
        score: bestScore,
      });
    }
  }

  return result;
}
