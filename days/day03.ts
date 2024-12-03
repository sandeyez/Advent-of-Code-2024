import { getInputForDay, presentDayResults } from "../utils";

const DAY = 3;

type ParsedInput = string;

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  return lines.join();
}

const MUL_REGEX = /mul\([0-9]+,[0-9]+\)/g;

const NUMBER_REGEX = /[0-9]+/g;

function calculateResultFromLine(line: string) {
  const multiplications = [...line.matchAll(MUL_REGEX)].map(
    (match) => match[0]
  );

  const results = multiplications.map((mul) => {
    const numbers = [...mul.matchAll(NUMBER_REGEX)].map((match) =>
      Number(match[0])
    );

    return numbers[0] * numbers[1];
  });

  return results.reduce((acc, curr) => acc + curr, 0);
}

function part1(input: ParsedInput) {
  const lines = input;

  return calculateResultFromLine(lines);
}

function part2(input: ParsedInput) {
  const lines = input;

  const splitLines = lines
    .split("don't()")
    .map((line, index) => `${index !== 0 ? "don't()" : ""}${line}`)
    .flatMap((line) => line.split("do()"))
    .map(
      (line, index) =>
        `${index !== 0 && !line.startsWith("don't") ? "do()" : ""}${line}`
    );

  return splitLines.reduce((acc, curr) => {
    if (curr.startsWith("don't")) return acc;

    return acc + calculateResultFromLine(curr);
  }, 0);
}

presentDayResults(DAY, getInput, part1, part2);
