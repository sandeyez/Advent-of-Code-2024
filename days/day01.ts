import { getInputForDay, presentDayResults, readFile } from "../utils";

function getInput(): [number[], number[]] {
  const lines = getInputForDay(1);

  const [lines1, lines2] = lines.reduce<[number[], number[]]>(
    (acc, line) => {
      const [line1, line2] = line.split("   ");

      const [accLines1, accLines2] = acc;

      return [
        [...accLines1, Number(line1)],
        [...accLines2, Number(line2)],
      ];
    },
    [[], []]
  );

  return [lines1, lines2];
}

function part1(input: [number[], number[]]) {
  const [lines1, lines2] = input;

  lines1.sort();
  lines2.sort();

  let sum = 0;

  for (let i = 0; i < lines1.length; i++) {
    sum += Math.abs(lines1[i] - lines2[i]);
  }

  return sum;
}

function part2(input: [number[], number[]]) {
  const [lines1, lines2] = input;

  const occurrences = new Map<number, number>();

  for (const line of lines2) {
    occurrences.set(line, (occurrences.get(line) ?? 0) + 1);
  }

  const result = lines1.reduce<number>((acc, line) => {
    const count = occurrences.get(line) ?? 0;

    return acc + line * count;
  }, 0);

  return result;
}

presentDayResults(1, getInput, part1, part2);
