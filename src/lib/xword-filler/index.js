import _ from 'lodash';
import gaussian from 'gaussian';
import CandidateGrid, { convertToCandidateGrid, convertFromCandidateGrid } from './candidateGrid';
import beamSearch from './beamSearch';
import { getMatches } from './common';
// randomize our word list, to introduce non-determinism early in the process.
// non-determinism is important if we don't to generate the same puzzle every timeI

const normal = gaussian(0, 1)

const sample = (mean, stdev) => (
  mean + normal.ppf(Math.random()) * stdev
)

// scoredWords: an object of shape { word: { score, stdev }, ... }
// returns an object with same keys { word: sampledScore } 
const assignScores = (wordlist) => {
  const result = {};
  _.forEach(_.keys(wordlist), k => {
    result[k] = sample(wordlist[k].score, wordlist[k].stdev);
  });
  return result;
}


const generateDefaultWordlist = () => {
  const result = {};
  _.forEach(window.nyt_words, (k) => {
    if (k.length > 7) return;
    result[k] = {
      score: 0,
      stdev: 10,
    };
  });
  return result;
}

const DEFAULT_WORDLIST = generateDefaultWordlist()
// partialGrid: Array(Array(cell))
// cell: { value: '.' if black, '[a-z]' or '' otherwise, pencil: boolean/null }
export const fillGrid = (partialGrid, wordlist = DEFAULT_WORDLIST) => {
  const scoredWordlist = assignScores(wordlist)

  const initialState = convertToCandidateGrid(partialGrid);
  const bestCandidate = beamSearch(initialState, scoredWordlist);
  const grid = convertFromCandidateGrid(bestCandidate);
  const resultGrid = grid.map((row, r) => (
    row.map((cell, c) => ({
      ...cell,
      value: cell.value === ' ' ? '?' : cell.value,
      pencil: cell.value !== '.' && partialGrid[r][c].value !== cell.value,
    }))
  ));
  return resultGrid;
}
