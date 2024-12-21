import {
  getInputForDay,
  getPointNeighbours,
  pointToString,
  presentDayResults,
  stringToPoint,
  type Grid,
  type Point,
} from "../utils";

const DAY = 18;
type ParsedInput = Point[];

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  return lines.map((line) => stringToPoint(line));
}

function calculateHeuristic(point: Point, endPoint: Point) {
  return Math.abs(point.x - endPoint.x) + Math.abs(point.y - endPoint.y);
}

const GRID_SIZE = 71;
const BYTES_AMOUNT = 1024;

const STARTING_POINT: Point = { x: 0, y: 0 };
const END_POINT: Point = { x: GRID_SIZE - 1, y: GRID_SIZE - 1 };

function part1(byteLocations: ParsedInput) {
  const grid = new Array(GRID_SIZE)
    .fill(null)
    .map(() => new Array(GRID_SIZE).fill(true));

  byteLocations.slice(0, BYTES_AMOUNT).forEach(({ x, y }) => {
    grid[y][x] = false;
  });

  const startingState: string = `${pointToString(STARTING_POINT)}`;

  const openSet = new Set<string>([startingState]);
  const cameFrom = new Map<string, string>();

  const gScore = new Map<string, number>([[startingState, 0]]);
  const fScore = new Map<string, number>([
    [startingState, calculateHeuristic(STARTING_POINT, END_POINT)],
  ]);

  while (openSet.size > 0) {
    const openSetArray = Array.from(openSet);
    // Get the state in the open set with the lowest fScore
    const current = openSetArray.reduce((minState, state) => {
      if (fScore.get(state)! < fScore.get(minState)!) {
        return state;
      }

      return minState;
    }, openSetArray[0]);

    const currentPoint = stringToPoint(current);

    if (currentPoint.x === END_POINT.x && currentPoint.y === END_POINT.y) {
      return gScore.get(current);
    }

    openSet.delete(current);

    const neighbours = getPointNeighbours(currentPoint).filter(
      ({ x, y }) =>
        x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE && grid[y][x]
    );

    neighbours.forEach((neighbour) => {
      const neighbourState = pointToString(neighbour);
      const tentativeGScore = gScore.get(current)! + 1;

      if (tentativeGScore < (gScore.get(neighbourState) ?? Infinity)) {
        cameFrom.set(neighbourState, current);
        gScore.set(neighbourState, tentativeGScore);
        fScore.set(
          neighbourState,
          tentativeGScore + calculateHeuristic(neighbour, END_POINT)
        );

        openSet.add(neighbourState);
      }
    });
  }
}

function part2(input: ParsedInput) {
  const grid = new Array(GRID_SIZE)
    .fill(null)
    .map(() => new Array(GRID_SIZE).fill(true));

  // Populate the grid with the first points
  input.slice(0, GRID_SIZE).forEach(({ x, y }) => {
    grid[y][x] = false;
  });

  for (
    let byteNumber = GRID_SIZE;
    byteNumber < GRID_SIZE * GRID_SIZE;
    byteNumber++
  ) {
    const currentByte = input[byteNumber];
    grid[currentByte.y][currentByte.x] = false;

    let frontier = new Set<string>([pointToString(STARTING_POINT)]);
    const visited = new Set<string>([pointToString(STARTING_POINT)]);

    let isReachable = false;

    while (frontier.size > 0 && !isReachable) {
      const newFrontier = new Set<string>();

      frontier.forEach((pointString) => {
        const point = stringToPoint(pointString);

        if (point.x === END_POINT.x && point.y === END_POINT.y) {
          isReachable = true;
          return;
        }

        getPointNeighbours(point).forEach((neighbour) => {
          const neighbourString = pointToString(neighbour);

          if (
            visited.has(neighbourString) ||
            neighbour.x < 0 ||
            neighbour.y < 0 ||
            neighbour.x >= GRID_SIZE ||
            neighbour.y >= GRID_SIZE ||
            !grid[neighbour.y][neighbour.x]
          ) {
            return;
          }

          visited.add(neighbourString);
          newFrontier.add(neighbourString);
        });

        frontier = newFrontier;
      });
    }

    if (!isReachable) {
      return pointToString(input[byteNumber]);
    }
  }
}

presentDayResults(DAY, getInput, part1, part2);
