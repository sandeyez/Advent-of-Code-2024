import { getInputForDay, presentDayResults } from "../utils";

const DAY = 5;
type ParsedInput = {
  orderingRules: Array<[number, number]>;
  numbers: Array<number[]>;
};

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  let orderingRules: ParsedInput["orderingRules"] = [];
  let numbers: ParsedInput["numbers"] = [];

  let haveSeenWhitespace = false;

  for (const line of lines) {
    if (line === "") {
      haveSeenWhitespace = true;
      continue;
    }

    if (!haveSeenWhitespace) {
      const [left, right] = line.split("|").map(Number);
      orderingRules.push([left, right]);
    } else {
      numbers.push(line.split(",").map(Number));
    }
  }

  return {
    numbers,
    orderingRules,
  };
}

function part1({ numbers, orderingRules }: ParsedInput) {
  const rulesMap = orderingRules.reduce((acc, [left, right]) => {
    if (acc.has(left)) {
      acc.get(left)!.push(right);
      return acc;
    }

    acc.set(left, [right]);

    return acc;
  }, new Map<number, number[]>());

  const middleNumberSum = numbers.reduce((acc, numberLine, i) => {
    for (let i = 1; i < numberLine.length; i++) {
      const number = numberLine[i];

      const numberRules = rulesMap.get(number);

      if (!numberRules) {
        continue;
      }

      const numbersBefore = numberLine.slice(0, i);

      if (numberRules.some((rule) => numbersBefore.includes(rule))) {
        return acc;
      }
    }

    const middleNumber = numberLine.at(Math.floor(numberLine.length / 2)) ?? 0;

    return acc + middleNumber;
  }, 0);

  return middleNumberSum;
}

function part2({ numbers, orderingRules }: ParsedInput) {
  const rulesMap = orderingRules.reduce((acc, [left, right]) => {
    if (acc.has(left)) {
      acc.get(left)!.push(right);
      return acc;
    }

    acc.set(left, [right]);

    return acc;
  }, new Map<number, number[]>());

  const unsortedLines = numbers.filter((numberLine) => {
    for (let i = 1; i < numberLine.length; i++) {
      const number = numberLine[i];

      const numberRules = rulesMap.get(number);

      if (!numberRules) {
        continue;
      }

      const numbersBefore = numberLine.slice(0, i);

      if (numberRules.some((rule) => numbersBefore.includes(rule))) {
        return true;
      }
    }

    return false;
  });

  const sortedLines = unsortedLines.map((numberLine) => {
    numberLine.sort((a, b) => {
      const aRules = rulesMap.get(a) ?? [];
      const bRules = rulesMap.get(b) ?? [];

      if (aRules.includes(b)) {
        return -1;
      }

      if (bRules.includes(a)) {
        return 1;
      }

      return 0;
    });

    return numberLine;
  });

  const middleNumberSum = sortedLines.reduce((acc, numberLine) => {
    const middleNumber = numberLine.at(Math.floor(numberLine.length / 2)) ?? 0;

    return acc + middleNumber;
  }, 0);

  return middleNumberSum;
}

presentDayResults(DAY, getInput, part1, part2);
