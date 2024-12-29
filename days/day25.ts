import { getInputForDay, presentDayResults } from "../utils";

const DAY = 25;
type ParsedInput = {
  keys: number[][];
  locks: number[][];
};

const LENGTH = 5;

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  let current: number[] = new Array(LENGTH).fill(0);
  let isKey = true;

  const keys: number[][] = [];
  const locks: number[][] = [];

  lines.forEach((line, i) => {
    if (line === "") {
      if (isKey) {
        keys.push(current);
      } else {
        locks.push(current);
      }

      current = new Array(LENGTH).fill(0);
      return;
    }

    if (i % 8 === 0 && line.split("").every((char) => char === "#")) {
      isKey = true;
    } else if (i % 8 === 0 && line.split("").every((char) => char === ".")) {
      isKey = false;
    }

    line.split("").forEach((char, i) => {
      if (char === "#") {
        current[i] += 1;
      }
    });
  });

  if (isKey) {
    keys.push(current);
  } else {
    locks.push(current);
  }

  return {
    keys: keys.map((key) => key.map((val) => val - 1)),
    locks: locks.map((lock) => lock.map((val) => val - 1)),
  };
}

function part1({ keys, locks }: ParsedInput) {
  let count = 0;

  for (const key of keys) {
    for (const lock of locks) {
      if (key.some((val, i) => val + lock[i] > 5)) continue;

      count++;
    }
  }

  return count;
}

function part2(input: ParsedInput) {
  const lines = input;

  return "Not implemented";
}

presentDayResults(DAY, getInput, part1, part2);
