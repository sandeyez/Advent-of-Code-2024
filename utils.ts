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

export function pointToString(point: Point): `${number},${number}` {
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
  mapper: (char: string, x: number, y: number) => T
): Grid<T> {
  return lines.map((line, y) =>
    line.split("").map((char, x) => mapper(char, x, y))
  );
}

// Pathfinding Utils
export type KeyedMatrix<T> = Record<string, Record<string, T>>;

export type KeyedPoint = Point & { key: string };

function getNodeKey(node: KeyedPoint): string {
  return node.key ?? pointToString(node);
}

// Algorithm to find shortest paths between all pairs of nodes
export function FloydWarshall(
  nodes: KeyedPoint[],
  getNeighbours: (node: KeyedPoint) => KeyedPoint[],
  getEdgeWeight: (from: KeyedPoint, to: KeyedPoint) => number
): {
  distances: KeyedMatrix<number>;
  next: KeyedMatrix<string>;
} {
  const dist: KeyedMatrix<number> = {};
  const next: KeyedMatrix<string> = {};

  for (const node of nodes) {
    dist[getNodeKey(node)] = {};
    next[getNodeKey(node)] = {};

    for (const node1 of nodes) {
      dist[getNodeKey(node)][getNodeKey(node1)] = node === node1 ? 0 : Infinity;
    }
    for (const neighbour of getNeighbours(node)) {
      dist[getNodeKey(node)][getNodeKey(neighbour)] = getEdgeWeight(
        node,
        neighbour
      );
      next[getNodeKey(node)][getNodeKey(neighbour)] = getNodeKey(neighbour);
    }
  }

  const stringifiedNodes = nodes.map(getNodeKey);

  for (const k of stringifiedNodes) {
    for (const i of stringifiedNodes) {
      for (const j of stringifiedNodes) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }

  return { distances: dist, next };
}

export function reconstructPath(
  start: KeyedPoint,
  end: KeyedPoint,
  next: KeyedMatrix<string>
): string[] {
  const path: string[] = [getNodeKey(start)];

  let current = getNodeKey(start);
  const endKey = getNodeKey(end);

  while (current !== endKey || current !== endKey) {
    current = next[current][getNodeKey(end)];
    path.push(current);
  }

  return path;
}
