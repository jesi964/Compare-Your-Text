export function parseText(input) {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function normalizeText(line) {
  return line.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function uniqueByNormalized(lines) {
  const seen = new Set();
  const result = [];

  for (const line of lines) {
    const key = normalizeText(line);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(line);
    }
  }

  return result;
}

export function toLineMap(lines) {
  const map = new Map();
  for (const line of lines) {
    const key = normalizeText(line);
    if (!map.has(key)) {
      map.set(key, line);
    }
  }
  return map;
}

export function splitParagraphs(input) {
  return input
    .split(/\n\s*\n/g)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function detectInputType(input) {
  const paragraphs = splitParagraphs(input);
  if (paragraphs.length > 1) {
    return 'paragraph';
  }
  return 'list';
}
