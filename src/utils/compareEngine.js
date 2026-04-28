import { diffLines } from 'diff';
import { findBestSimilarLines, similarityScore } from './similarity.js';
import { normalizeText, parseText, toLineMap, uniqueByNormalized } from './text.js';

function summarizeDifferences(stats) {
  const { exactCount, partialCount, onlyACount, onlyBCount } = stats;

  if (!exactCount && !partialCount && !onlyACount && !onlyBCount) {
    return 'No content detected in either input.';
  }

  return `Found ${exactCount} exact matches, ${partialCount} similar lines, ${onlyACount} lines only in A, and ${onlyBCount} lines only in B.`;
}

function buildLineResult(line, type, score = 0, pair = '') {
  return {
    line,
    type,
    score,
    pair,
  };
}

export function compareTexts(inputA, inputB, fuzzyThreshold = 72) {
  const rawA = parseText(inputA);
  const rawB = parseText(inputB);

  const mapA = toLineMap(rawA);
  const mapB = toLineMap(rawB);

  const duplicates = [];
  const onlyA = [];
  const onlyB = [];

  mapA.forEach((line, key) => {
    if (mapB.has(key)) {
      duplicates.push(line);
    } else {
      onlyA.push(line);
    }
  });

  mapB.forEach((line, key) => {
    if (!mapA.has(key)) {
      onlyB.push(line);
    }
  });

  const partials = findBestSimilarLines(onlyA, onlyB, fuzzyThreshold);

  const consumedA = new Set(partials.map((item) => normalizeText(item.sourceLine)));
  const consumedB = new Set(partials.map((item) => normalizeText(item.targetLine)));

  const strictOnlyA = onlyA.filter((line) => !consumedA.has(normalizeText(line)));
  const strictOnlyB = onlyB.filter((line) => !consumedB.has(normalizeText(line)));

  const cleanedA = uniqueByNormalized(rawA);
  const cleanedB = uniqueByNormalized(rawB);

  const mergedCleaned = uniqueByNormalized([
    ...cleanedA,
    ...cleanedB,
    ...partials.map((item) => item.sourceLine.length >= item.targetLine.length ? item.sourceLine : item.targetLine),
  ]);

  const sideBySideRows = [
    ...duplicates.map((line) => ({
      left: line,
      right: line,
      type: 'exact',
      score: 100,
    })),
    ...partials.map((item) => ({
      left: item.sourceLine,
      right: item.targetLine,
      type: 'partial',
      score: item.score,
    })),
    ...strictOnlyA.map((line) => ({
      left: line,
      right: '',
      type: 'onlyA',
      score: 0,
    })),
    ...strictOnlyB.map((line) => ({
      left: '',
      right: line,
      type: 'onlyB',
      score: 0,
    })),
  ];

  const unifiedDiffRaw = diffLines(inputA || '', inputB || '', {
    newlineIsToken: true,
    ignoreWhitespace: false,
  });

  const unifiedRows = unifiedDiffRaw.map((part) => {
    let type = 'unchanged';
    if (part.added) type = 'added';
    if (part.removed) type = 'removed';

    return {
      type,
      text: part.value,
    };
  });

  const allRows = [];

  duplicates.forEach((line) => {
    allRows.push(buildLineResult(line, 'exact', 100, line));
  });

  partials.forEach((item) => {
    allRows.push(buildLineResult(item.sourceLine, 'partial', item.score, item.targetLine));
  });

  strictOnlyA.forEach((line) => {
    allRows.push(buildLineResult(line, 'onlyA', 0));
  });

  strictOnlyB.forEach((line) => {
    allRows.push(buildLineResult(line, 'onlyB', 0));
  });

  const explainSummary = summarizeDifferences({
    exactCount: duplicates.length,
    partialCount: partials.length,
    onlyACount: strictOnlyA.length,
    onlyBCount: strictOnlyB.length,
  });

  const bestSimilarityAcrossAll = similarityScore(inputA, inputB);

  return {
    rawA,
    rawB,
    duplicates,
    partials,
    onlyA: strictOnlyA,
    onlyB: strictOnlyB,
    cleanedA,
    cleanedB,
    mergedCleaned,
    sideBySideRows,
    unifiedRows,
    allRows,
    explainSummary,
    bestSimilarityAcrossAll,
  };
}
