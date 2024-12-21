import { getInputForDay, presentDayResults } from "../utils";

const DAY = 19;
type ParsedInput = {
  patterns: string[];
  towels: string[];
};

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  const patterns = lines[0].split(", ");
  const towels = lines.slice(2);

  return {
    patterns,
    towels,
  };
}

const PART_1_CACHE = new Map<string, boolean>();

function isReachableDesign(patterns: string[], towel: string): boolean {
  const possiblePatterns = patterns.filter((pattern) =>
    towel.startsWith(pattern)
  );

  if (possiblePatterns.length === 0) {
    return false;
  }

  if (patterns.includes(towel)) {
    return true;
  }

  return possiblePatterns.some((pattern) => {
    const remainingTowel = towel.slice(pattern.length);

    if (PART_1_CACHE.has(remainingTowel)) {
      return PART_1_CACHE.get(remainingTowel);
    }

    const isReachable = isReachableDesign(patterns, remainingTowel);

    PART_1_CACHE.set(remainingTowel, isReachable);

    return isReachable;
  });
}

function part1({ patterns, towels }: ParsedInput) {
  return towels.filter((towel) => isReachableDesign(patterns, towel)).length;
}

const PART_2_CACHE = new Map<string, number>();

function getAmountOfDifferentDesigns(
  patterns: string[],
  towel: string
): number {
  if (PART_2_CACHE.has(towel)) {
    return PART_2_CACHE.get(towel)!;
  }

  const possiblePatterns = patterns.filter((pattern) =>
    towel.startsWith(pattern)
  );

  if (possiblePatterns.length === 0) {
    PART_2_CACHE.set(towel, 0);
    return 0;
  }

  const amountOfDesigns = patterns.includes(towel)
    ? 1 +
      getAmountOfDifferentDesigns(
        patterns.filter((pat) => pat !== towel),
        towel
      )
    : possiblePatterns.reduce((acc, pattern) => {
        const remainingTowel = towel.slice(pattern.length);

        const amountOfDesigns = getAmountOfDifferentDesigns(
          patterns,
          remainingTowel
        );

        return acc + amountOfDesigns;
      }, 0);

  PART_2_CACHE.set(towel, amountOfDesigns);

  return amountOfDesigns;
}

function part2({ patterns, towels }: ParsedInput) {
  const result = towels.reduce((acc, towel) => {
    const amountOfDesigns = getAmountOfDifferentDesigns(patterns, towel);

    return acc + amountOfDesigns;
  }, 0);

  return result;
}

presentDayResults(DAY, getInput, part1, part2);
