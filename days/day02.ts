import { getInputForDay, presentDayResults } from "../utils";

const DAY = 2;
type ParsedInput = Array<number[]>;

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  return lines.map((line) => {
    return line.trim().split(" ").map(Number);
  });
}

function isValidStep(prev: number, next: number, direction: "asc" | "desc") {
  const diff = next - prev;

  if (Math.abs(diff) > 3 || diff === 0) {
    return false;
  }

  if (direction === "asc" && diff < 0) {
    return false;
  }

  if (direction === "desc" && diff > 0) {
    return false;
  }

  return true;
}

function part1(input: ParsedInput) {
  const result = input.reduce<number>((acc, line, index) => {
    let direction: "asc" | "desc" = line[0] < line[1] ? "asc" : "desc";

    for (let i = 0; i < line.length - 1; i++) {
      if (!isValidStep(line[i], line[i + 1], direction)) {
        return acc;
      }
    }

    return acc + 1;
  }, 0);

  return result;
}

function part2(input: ParsedInput) {
  const result = input.reduce<number>((acc, line, index) => {
    const directions = line.map((val, i) => {
      const next = line[i + 1];

      if (next === undefined) {
        return undefined;
      }

      const diff = next - val;

      if (Math.abs(diff) > 3 || diff === 0) {
        return undefined;
      }

      return diff > 0 ? "asc" : "desc";
    });

    const directionCounts = directions.reduce<{ asc: number; desc: number }>(
      (acc, direction) => {
        if (direction === "asc") {
          acc.asc += 1;
        } else if (direction === "desc") {
          acc.desc += 1;
        }

        return acc;
      },
      { asc: 0, desc: 0 }
    );

    const direction =
      directionCounts.asc > directionCounts.desc ? "asc" : "desc";

    let skippedIndex = -1;

    for (let i = 0; i < line.length - 1; i++) {
      if (isValidStep(line[i], line[i + 1], direction)) {
        continue;
      }

      if (skippedIndex !== -1) {
        return acc;
      }

      if (i === 0 && isValidStep(line[i + 1], line[i + 2], direction)) {
        skippedIndex = i;
        i += 1;
        continue;
      }

      if (isValidStep(line[i], line[i + 2], direction)) {
        skippedIndex = i;
        i += 1;
        continue;
      }

      return acc;
    }

    return acc + 1;
  }, 0);

  return result;
}

presentDayResults(DAY, getInput, part1, part2);
