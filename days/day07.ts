import { getInputForDay, presentDayResults } from "../utils";

const DAY = 7;

type Equation = {
  result: number;
  input: number[];
};

type ParsedInput = Equation[];

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  return lines.map((line) => {
    const splitLine = line.split(": ");
    const result = parseInt(splitLine[0]);
    const input = splitLine[1].split(" ").map((num) => parseInt(num));

    return {
      input,
      result,
    };
  });
}

function isComputable(
  target: number,
  currentNum: number,
  otherNumbers: number[],
  includeConcat: boolean = false
): boolean {
  if (otherNumbers.length === 0) {
    return currentNum === target;
  }

  const nextNum = otherNumbers[0];
  const remainingNumbers = otherNumbers.slice(1);

  return (
    isComputable(
      target,
      currentNum + nextNum,
      remainingNumbers,
      includeConcat
    ) ||
    isComputable(
      target,
      currentNum * nextNum,
      remainingNumbers,
      includeConcat
    ) ||
    (includeConcat &&
      isComputable(
        target,
        currentNum * 10 ** Math.floor(Math.log10(nextNum) + 1) + nextNum,
        remainingNumbers,
        includeConcat
      ))
  );
}

function part1(input: ParsedInput) {
  const possibleEquations = input.filter(({ input, result }) => {
    return isComputable(result, input[0], input.slice(1));
  });

  return possibleEquations.reduce((acc, curr) => acc + curr.result, 0);
}

function part2(input: ParsedInput) {
  const possibleEquations = input.filter(({ input, result }) => {
    return isComputable(result, input[0], input.slice(1), true);
  });

  return possibleEquations.reduce((acc, curr) => acc + curr.result, 0);
}

presentDayResults(DAY, getInput, part1, part2);
