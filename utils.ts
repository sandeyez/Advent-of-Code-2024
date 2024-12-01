import { existsSync, readFileSync } from "fs";

export function readFile(path: string): string[] {
  if (!existsSync(path)) {
    throw new Error(`File not found: ${path}`);
  }

  return readFileSync(path, "utf-8").split("\n");
}

export function getInputForDay(day: number): string[] {
  return readFile(`./input/day${day}.txt`);
}

export function presentDayResults<InputType>(
  day: number,
  inputFunction: () => InputType,
  part1: (input: InputType) => any,
  part2: (input: InputType) => any
) {
  const dayNumber = day.toString().padStart(2, "0");

  console.log(`-- The Advent of Code 2024 - Day ${dayNumber} --\n`);
  const input = inputFunction();
  console.log("-------------");
  console.log("|| Part 01 ||");
  console.log("-------------");

  let startTime = performance.now();
  const part1Result = part1(input);
  let endTime = performance.now();

  console.log("Result: " + part1Result);
  console.log(
    "Execution time: " + (endTime - startTime).toPrecision(2) + "ms\n"
  );

  console.log("-------------");
  console.log("|| Part 02 ||");
  console.log("-------------");

  startTime = performance.now();
  const part2Result = part2(input);
  endTime = performance.now();

  console.log("Result: " + part2Result);
  console.log("Execution time: " + (endTime - startTime).toPrecision(2) + "ms");
  console.log("--------------------------------------");
}
