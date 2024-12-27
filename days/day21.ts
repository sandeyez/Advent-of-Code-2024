import {
  addPoints,
  createGrid,
  findInGrid,
  getInputForDay,
  pointToString,
  type Grid,
  type Point,
} from "../utils";

import { presentDayResults } from "../utils";

const DAY = 21;
type ParsedInput = string[];

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  return lines;
}

let CACHE: Record<string, number> = {};

const numericalKeys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A"] as const;
type NumericalKey = (typeof numericalKeys)[number];

const numericalGrid = createGrid<NumericalKey | null>(
  ["789", "456", "123", "#0A"],
  (char) => (char === "#" ? null : (char as NumericalKey))
);

const directionalKeys = {
  "^": { x: 0, y: -1 },
  ">": { x: 1, y: 0 },
  v: { x: 0, y: 1 },
  "<": { x: -1, y: 0 },
} as const;

type DirectionalKey = keyof typeof directionalKeys | "A";

const directionalGrid = createGrid<DirectionalKey | null>(
  ["#^A", "<v>"],
  (char) => (char === "#" ? null : (char as DirectionalKey))
);

function getAllPossiblePaths<T extends NumericalKey | DirectionalKey>(
  grid: Grid<T | null>,
  start: T,
  end: T,
  type: "numerical" | "directional" = "numerical"
): DirectionalKey[][] {
  if (start === end) return [["A"]];

  const queue: [Point, DirectionalKey[]][] = [[findInGrid(grid, start)!, []]];
  const distances: Record<string, number> = {};

  const endPoint = findInGrid(grid, end)!;

  const possiblePaths: DirectionalKey[][] = [];

  while (queue.length > 0) {
    const [currentPoint, currentPath] = queue.shift()!;

    if (currentPoint.x === endPoint.x && currentPoint.y === endPoint.y) {
      const path: DirectionalKey[] = [...currentPath, "A"];

      possiblePaths.push(path);
      continue;
    }

    const currentKey = pointToString(currentPoint);

    if (currentKey in distances && distances[currentKey] < currentPath.length) {
      continue;
    }

    const grid = type === "directional" ? directionalGrid : numericalGrid;

    Object.entries(directionalKeys).forEach(([key, vector]) => {
      const position = addPoints(currentPoint, vector);

      if (
        position.x < 0 ||
        position.y < 0 ||
        position.y >= grid.length ||
        position.x >= grid[0].length
      )
        return;

      if (grid[position.y][position.x] === null) return;

      const newPath = [...currentPath, key as DirectionalKey];

      if (
        !(pointToString(position) in distances) ||
        distances[pointToString(position)] >= newPath.length
      ) {
        distances[pointToString(position)] = newPath.length;
        queue.push([position, newPath]);
      }
    });
  }

  return possiblePaths;
}

function getCodeCost<T extends NumericalKey | DirectionalKey>(
  grid: Grid<T | null>,
  code: T[],
  layer: number
): number {
  const cacheKey = `${code.join("")}-${layer}`;

  if (cacheKey in CACHE) {
    return CACHE[cacheKey];
  }

  // @ts-expect-error
  let current: T = "A";
  let cost = 0;

  for (const key of code) {
    const allPaths = getAllPossiblePaths(grid, current, key);

    if (layer === 0) cost += Math.min(...allPaths.map((path) => path.length));
    else
      cost += Math.min(
        ...allPaths.map((path) => getCodeCost(directionalGrid, path, layer - 1))
      );

    current = key;
  }

  CACHE[cacheKey] = cost;

  return cost;
}

function part1(input: ParsedInput) {
  return input.reduce((acc, code) => {
    const numeric = parseInt(code.slice(0, 3));
    const cost = getCodeCost(
      numericalGrid,
      code.split("") as NumericalKey[],
      2
    );

    return acc + numeric * cost;
  }, 0);
}

function part2(input: ParsedInput) {
  CACHE = {};

  return input.reduce((acc, code) => {
    const numeric = parseInt(code.slice(0, 3));
    const cost = getCodeCost(
      numericalGrid,
      code.split("") as NumericalKey[],
      25
    );

    return acc + numeric * cost;
  }, 0);
}

presentDayResults(DAY, getInput, part1, part2);
