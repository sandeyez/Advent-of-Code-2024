import { getInputForDay, presentDayResults } from "../utils";

const DAY = 4;
type ParsedInput = string[][];

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  return lines.map((line) => line.split(""));
}

const PART1_WORD = "XMAS";

function hasWordRemainder(
  x: number,
  y: number,
  lines: string[][],
  direction: [number, number],
  wordIndex: number = 1
) {
  if (wordIndex === PART1_WORD.length) return true;

  if (lines[y][x] !== PART1_WORD.at(wordIndex)) return false;

  const xDirection = direction[0];
  const yDirection = direction[1];

  return hasWordRemainder(
    x + xDirection,
    y + yDirection,
    lines,
    direction,
    wordIndex + 1
  );
}

function part1(input: ParsedInput) {
  const lines = input;

  let sum = 0;

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      if (lines[y][x] !== PART1_WORD[0]) continue;

      for (let xDirection = -1; xDirection <= 1; xDirection++) {
        for (let yDirection = -1; yDirection <= 1; yDirection++) {
          if (xDirection === 0 && yDirection === 0) continue;

          if (
            y + yDirection * (PART1_WORD.length - 1) < 0 ||
            y + yDirection * (PART1_WORD.length - 1) >= lines.length
          ) {
            continue;
          }

          if (
            x + xDirection * (PART1_WORD.length - 1) < 0 ||
            x + xDirection * (PART1_WORD.length - 1) >= lines[0].length
          ) {
            continue;
          }

          if (
            hasWordRemainder(x + xDirection, y + yDirection, lines, [
              xDirection,
              yDirection,
            ])
          ) {
            sum++;
          }
        }
      }
    }
  }

  return sum;
}

const PART2_WORD = "MAS";

function part2(input: ParsedInput) {
  const lines = input;

  let sum = 0;

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      if (lines[y][x] !== PART2_WORD[1]) continue;

      if (x < 1 || x >= lines[0].length - 1) continue;
      if (y < 1 || y >= lines.length - 1) continue;

      const diagonalOne = [lines[y - 1][x - 1], lines[y + 1][x + 1]];
      const diagonalTwo = [lines[y - 1][x + 1], lines[y + 1][x - 1]];

      if (
        diagonalOne.includes(PART2_WORD[0]) &&
        diagonalOne.includes(PART2_WORD[2]) &&
        diagonalTwo.includes(PART2_WORD[0]) &&
        diagonalTwo.includes(PART2_WORD[2])
      ) {
        sum++;
      }
    }
  }

  return sum;
}

presentDayResults(DAY, getInput, part1, part2);
