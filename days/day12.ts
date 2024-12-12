import {
  getInputForDay,
  pointToString,
  presentDayResults,
  stringToPoint,
  type Point,
} from "../utils";

const DAY = 12;
type ParsedInput = string[][];

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  return lines.map((line) => line.split(""));
}

type Region = {
  plant: string;
  coordinates: Point[];
};

function getRegions(input: ParsedInput): Region[] {
  const regions: Region[] = [];
  const visitedPoints = new Set<string>();

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (visitedPoints.has(pointToString({ x, y }))) continue;

      const plant = input[y][x];

      const pointsToVisit: Point[] = [{ x, y }];

      const region: Region = {
        plant,
        coordinates: [],
      };

      while (pointsToVisit.length > 0) {
        const point = pointsToVisit.pop()!;

        if (visitedPoints.has(pointToString(point))) continue;

        if (
          point.x < 0 ||
          point.x >= input[0].length ||
          point.y < 0 ||
          point.y >= input.length
        )
          continue;

        if (input[point.y][point.x] === plant) {
          region.coordinates.push(point);
          visitedPoints.add(pointToString(point));

          pointsToVisit.push({ x: point.x + 1, y: point.y });
          pointsToVisit.push({ x: point.x - 1, y: point.y });
          pointsToVisit.push({ x: point.x, y: point.y + 1 });
          pointsToVisit.push({ x: point.x, y: point.y - 1 });
        }
      }

      regions.push(region);
    }
  }

  return regions;
}

function part1(input: ParsedInput) {
  const regions = getRegions(input);

  return regions.reduce((sum, region) => {
    const area = region.coordinates.length;
    const perimeter = region.coordinates.reduce((perimeter, coordinate) => {
      const { x, y } = coordinate;

      const top = region.coordinates.some((c) => c.x === x && c.y === y - 1);
      const right = region.coordinates.some((c) => c.x === x + 1 && c.y === y);
      const bottom = region.coordinates.some((c) => c.x === x && c.y === y + 1);
      const left = region.coordinates.some((c) => c.x === x - 1 && c.y === y);

      return (
        perimeter +
        (top ? 0 : 1) +
        (right ? 0 : 1) +
        (bottom ? 0 : 1) +
        (left ? 0 : 1)
      );
    }, 0);

    return sum + area * perimeter;
  }, 0);
}

function getInnerCorners(
  input: ParsedInput,
  plant: string,
  diagonalNeighbours: Point[]
) {
  return diagonalNeighbours.reduce((acc, { x, y }) => {
    if (x < 0 || x >= input[0].length || y < 0 || y >= input.length) return acc;

    if (input[y][x] !== plant) return acc + 1;

    return acc;
  }, 0);
}

function part2(input: ParsedInput) {
  const regions = getRegions(input);

  return regions.reduce((sum, region) => {
    const area = region.coordinates.length;

    // Crucial observation: the number of sides is equal to the number of corners
    const noOfSides = region.coordinates.reduce((sides, { x, y }) => {
      const neighbors = region.coordinates.filter(
        (coordinate) =>
          Math.abs(coordinate.x - x) + Math.abs(coordinate.y - y) === 1
      );

      // If a cell has no neighbors, it has 4 corners
      if (neighbors.length === 0) return sides + 4;

      // If a cell has only one neighbor, it has 2 corners
      if (neighbors.length === 1) return sides + 2;

      // If a cell has two neighbors, it depends on where they are located.
      if (neighbors.length === 2) {
        const { x: x1, y: y1 } = neighbors[0];
        const { x: x2, y: y2 } = neighbors[1];

        // If the neighbors are in the same row or column, no additional corners are added.
        if (x1 === x2 || y1 === y2) return sides;

        // If the neighbors are diagonal, it depends on if it is an inside as well.
        const insidePoint: Point = {
          x: x1 === x ? x2 : x1,
          y: y1 === y ? y2 : y1,
        };

        if (input[insidePoint.y][insidePoint.x] !== region.plant)
          return sides + 2;

        return sides + 1;
      }

      if (neighbors.length === 3) {
        const diagonalNeighbors = new Set<string>();

        for (let i = 0; i < neighbors.length; i++) {
          for (let j = i + 1; j < neighbors.length; j++) {
            if (i === j) continue;

            const { x: x1, y: y1 } = neighbors[i];
            const { x: x2, y: y2 } = neighbors[j];

            const diagonalPoint = {
              x: x1 === x ? x2 : x1,
              y: y1 === y ? y2 : y1,
            };

            if (
              !neighbors.some(
                (neighbor) =>
                  neighbor.x === diagonalPoint.x &&
                  neighbor.y === diagonalPoint.y
              )
            )
              diagonalNeighbors.add(pointToString(diagonalPoint));
          }
        }

        const innerCorners = getInnerCorners(
          input,
          region.plant,
          Array.from(diagonalNeighbors).map((point) => stringToPoint(point))
        );

        return sides + innerCorners;
      }

      const innerCorners = getInnerCorners(input, region.plant, [
        { x: x + 1, y: y + 1 },
        { x: x - 1, y: y - 1 },
        { x: x + 1, y: y - 1 },
        { x: x - 1, y: y + 1 },
      ]);

      return sides + innerCorners;
    }, 0);

    return sum + area * noOfSides;
  }, 0);
}

presentDayResults(DAY, getInput, part1, part2);
