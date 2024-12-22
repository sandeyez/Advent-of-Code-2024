import { getInputForDay, presentDayResults } from "../utils";

const DAY = 22;
type ParsedInput = number[];

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  return lines.map(Number);
}

function mix(n: number, secret: number) {
  return n ^ secret;
}

const PRUNE_VALUE = 16777216;

function prune(n: number) {
  return ((n % PRUNE_VALUE) + PRUNE_VALUE) % PRUNE_VALUE;
}

const SECRET_NUMBER_ITERATIONS = 2000;

function getSecretNumbers(n: number) {
  let secret = n;

  let numbers: number[] = [];

  for (let i = 0; i < SECRET_NUMBER_ITERATIONS; i++) {
    secret = prune(mix(secret * 64, secret));

    secret = prune(mix(Math.floor(secret / 32), secret));

    secret = prune(mix(secret * 2048, secret));

    numbers.push(secret);
  }

  return numbers;
}

function part1(input: ParsedInput) {
  return input.reduce((acc, n) => {
    const secret = getSecretNumbers(n).at(-1);

    return acc + secret!;
  }, 0);
}

function part2(input: ParsedInput) {
  const prices = input.map((n) => {
    const secrets: number[] = [n, ...getSecretNumbers(n)];

    return secrets.map((secret) => secret % 10);
  });

  const sequences = prices.map((pricesArray) => {
    let res: number[] = [];

    for (let i = 1; i < pricesArray.length; i++) {
      const val = pricesArray[i];
      const prev = pricesArray[i - 1];

      res.push(val - prev);
    }

    return res;
  });

  const yieldPerSequenceMap = new Map<string, number>();

  sequences.forEach((sequence, index) => {
    const seenSequences = new Set<string>();

    for (let i = 3; i < sequence.length - 1; i++) {
      const sequenceId = [
        sequence[i - 3],
        sequence[i - 2],
        sequence[i - 1],
        sequence[i],
      ].join(",");

      if (seenSequences.has(sequenceId)) continue;

      seenSequences.add(sequenceId);
      yieldPerSequenceMap.set(
        sequenceId,
        (yieldPerSequenceMap.get(sequenceId) ?? 0) + prices[index][i + 1]
      );
    }
  });

  return yieldPerSequenceMap.values().reduce((max, n) => {
    if (n > max) return n;

    return max;
  }, 0);
}

presentDayResults(DAY, getInput, part1, part2);
