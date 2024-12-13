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
  console.log("Reading input...");

  let startTime = performance.now();
  const input = inputFunction();
  let endTime = performance.now();

  console.log("Input read in " + (endTime - startTime).toPrecision(2) + "ms\n");

  console.log("-------------");
  console.log("|| Part 01 ||");
  console.log("-------------");

  startTime = performance.now();
  const part1Result = part1(input);
  endTime = performance.now();

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

// Point Utils
export type Point = {
  x: number;
  y: number;
};

export function pointToString(point: Point) {
  return `${point.x},${point.y}`;
}

export function stringToPoint(pointString: string): Point {
  const [x, y] = pointString.split(",").map(Number);

  return { x, y };
}

export function addPoints(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}
