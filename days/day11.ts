import { getInputForDay, presentDayResults } from "../utils";

const DAY = 11;
type ParsedInput = number[];

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  return lines[0].split(" ").map(Number);
}

const NUMBER_OF_ITERATIONS_PART_1 = 25;

function part1(input: ParsedInput) {
  let stones = [...input];

  for (let i = 0; i < NUMBER_OF_ITERATIONS_PART_1; i++) {
    stones = stones.flatMap((stone) => {
      if (stone === 0) return 1;

      if ((Math.floor(Math.log10(stone)) + 1) % 2 === 0) {
        const stoneAsString = stone.toString();

        const leftHalf = Number(
          stoneAsString.slice(0, stoneAsString.length / 2)
        );
        const rightHalf = Number(stoneAsString.slice(stoneAsString.length / 2));

        return [leftHalf, rightHalf];
      }

      return stone * 2024;
    });
  }

  return stones.length;
}

const NUMBER_OF_ITERATIONS_PART_2 = 75;

function part2(stones: ParsedInput) {
  const stoneCounts = new Map<number, number>(
    stones.map((stone) => [stone, 1])
  );

  for (let i = 0; i < NUMBER_OF_ITERATIONS_PART_2; i++) {
    const newStoneCounts = new Map<number, number>();

    for (const [stone, count] of stoneCounts.entries()) {
      if (stone === 0) {
        newStoneCounts.set(1, (newStoneCounts.get(1) || 0) + count);
        continue;
      }

      if ((Math.floor(Math.log10(stone)) + 1) % 2 === 0) {
        const stoneAsString = stone.toString();

        const leftHalf = Number(
          stoneAsString.slice(0, stoneAsString.length / 2)
        );
        const rightHalf = Number(stoneAsString.slice(stoneAsString.length / 2));

        newStoneCounts.set(
          leftHalf,
          (newStoneCounts.get(leftHalf) || 0) + count
        );
        newStoneCounts.set(
          rightHalf,
          (newStoneCounts.get(rightHalf) || 0) + count
        );
      } else {
        newStoneCounts.set(
          stone * 2024,
          (newStoneCounts.get(stone * 2024) || 0) + count
        );
      }
    }

    stoneCounts.clear();
    for (const [stone, count] of newStoneCounts.entries()) {
      stoneCounts.set(stone, count);
    }
  }

  return Array.from(stoneCounts.values()).reduce(
    (acc, count) => acc + count,
    0
  );
}

presentDayResults(DAY, getInput, part1, part2);
