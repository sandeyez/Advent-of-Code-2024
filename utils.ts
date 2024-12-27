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

export type StringifiedPoint = `${number},${number}`;

export function pointToString(point: Point): StringifiedPoint {
  return `${point.x},${point.y}`;
}

export function stringToPoint(pointString: string): Point {
  const [x, y] = pointString.split(",").map(Number);

  return { x, y };
}

export function addPoints(a: Point, b: Point, repeat = 1): Point {
  return { x: a.x + b.x * repeat, y: a.y + b.y * repeat };
}

export function manhattanDistance(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Direction Utils
export type Direction = "N" | "E" | "S" | "W";

export const directionToVectorMap: Record<Direction, Point> = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 },
};

export const directions: Direction[] = ["N", "E", "S", "W"];

export function getNextDirection(
  direction: Direction,
  turn: "L" | "R"
): Direction {
  const currentIndex = directions.indexOf(direction);

  if (turn === "L") {
    return directions[(currentIndex + 3) % 4];
  }

  return directions[(currentIndex + 1) % 4];
}

export function getPointNeighbours(point: Point): Point[] {
  return Object.values(directionToVectorMap).map((vector) =>
    addPoints(point, vector)
  );
}

// Grid Utils
export type Grid<T> = T[][];

export function createGrid<T>(
  lines: string[],
  mapper: (char: string, x: number, y: number) => T = (char) => char as T
): Grid<T> {
  return lines.map((line, y) =>
    line.split("").map((char, x) => mapper(char, x, y))
  );
}

export function findInGrid<T>(grid: Grid<T>, value: T): Point | null {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === value) {
        return { x, y };
      }
    }
  }

  return null;
}
