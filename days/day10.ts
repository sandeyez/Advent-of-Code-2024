import {
  addPoints,
  getInputForDay,
  pointToString,
  presentDayResults,
  type Point,
} from "../utils";

const DAY = 10;
type ParsedInput = number[][];

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  return lines.map((line) => line.split("").map((char) => parseInt(char, 10)));
}

const possibleSteps: Point[] = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

function getReachableTrailHeads(
  point: Point,
  trail: number[][],
  visitedPoints: Array<string> = [],
  previousHeight: number = -1
): Set<string> {
  const maxX = trail[0].length - 1;
  const maxY = trail.length - 1;

  if (point.x < 0 || point.x > maxX || point.y < 0 || point.y > maxY) {
    return new Set();
  }

  if (visitedPoints.includes(pointToString(point))) {
    return new Set();
  }

  if (trail[point.y][point.x] - previousHeight !== 1) {
    return new Set();
  }

  if (trail[point.y][point.x] === 9) {
    return new Set([pointToString(point)]);
  }

  return possibleSteps.reduce((acc, step) => {
    const nextPoint = addPoints(point, step);

    return acc.union(
      getReachableTrailHeads(
        nextPoint,
        trail,
        [...visitedPoints, pointToString(point)],
        trail[point.y][point.x]
      )
    );
  }, new Set<string>());
}

function part1(input: ParsedInput) {
  const trailStarts: Point[] = input.reduce<Point[]>((acc, row, y) => {
    return [
      ...acc,
      ...row.reduce<Point[]>((acc, cell, x) => {
        if (cell === 0) {
          acc.push({ x, y });
        }

        return acc;
      }, []),
    ];
  }, []);

  return trailStarts.reduce((acc, start) => {
    const reachableTrailHeads = getReachableTrailHeads(start, input);

    return acc + reachableTrailHeads.size;
  }, 0);
}

function getTrailheadRating(
  point: Point,
  trail: number[][],
  visitedPoints: Array<string> = [],
  previousHeight: number = -1
): number {
  const maxX = trail[0].length - 1;
  const maxY = trail.length - 1;

  if (point.x < 0 || point.x > maxX || point.y < 0 || point.y > maxY) {
    return 0;
  }

  if (visitedPoints.includes(pointToString(point))) {
    return 0;
  }

  if (trail[point.y][point.x] - previousHeight !== 1) {
    return 0;
  }

  if (trail[point.y][point.x] === 9) {
    return 1;
  }

  return possibleSteps.reduce((acc, step) => {
    const nextPoint = addPoints(point, step);

    return (
      acc +
      getTrailheadRating(
        nextPoint,
        trail,
        [...visitedPoints, pointToString(point)],
        trail[point.y][point.x]
      )
    );
  }, 0);
}

function part2(input: ParsedInput) {
  const trailStarts: Point[] = input.reduce<Point[]>((acc, row, y) => {
    return [
      ...acc,
      ...row.reduce<Point[]>((acc, cell, x) => {
        if (cell === 0) {
          acc.push({ x, y });
        }

        return acc;
      }, []),
    ];
  }, []);

  return trailStarts.reduce((acc, start) => {
    const rating = getTrailheadRating(start, input);

    return acc + rating;
  }, 0);
}

presentDayResults(DAY, getInput, part1, part2);
