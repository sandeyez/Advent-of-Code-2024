import {
  addPoints,
  createGrid,
  directionToVectorMap,
  getInputForDay,
  getNextDirection,
  getPointNeighbours,
  pointToString,
  presentDayResults,
  stringToPoint,
  type Direction,
  type Grid,
  type Point,
} from "../utils";

const DAY = 16;
type ParsedInput = {
  maze: Grid<boolean>;
  startPoint: Point;
  endPoint: Point;
};

const STARTING_POINT_CHAR = "S";
const END_POINT_CHAR = "E";

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  let startPoint: Point | null = null;
  let endPoint: Point | null = null;

  const maze = createGrid(lines, (char, x, y) => {
    if (char === STARTING_POINT_CHAR) {
      startPoint = { x, y };
    }

    if (char === END_POINT_CHAR) {
      endPoint = { x, y };
    }

    return char !== "#";
  });

  if (!startPoint || !endPoint) {
    throw new Error("Invalid input");
  }

  return {
    maze,
    startPoint,
    endPoint,
  };
}

type MazeState = `${number},${number}_${Direction}`;

function getPointAndDirection(state: MazeState): [Point, Direction] {
  const [pointString, direction] = state.split("_");

  return [stringToPoint(pointString), direction as Direction];
}

function calculateHeuristic(state: MazeState, endPoint: Point) {
  const [{ x, y }] = getPointAndDirection(state);
  const { x: endX, y: endY } = endPoint;

  return Math.abs(x - endX) + Math.abs(y - endY);
}

const STEP_COST = 1;
const ROTATION_COST = 1000;

function part1({ endPoint, maze, startPoint }: ParsedInput) {
  const startingState: MazeState = `${pointToString(startPoint)}_E`;

  const openSet = new Set<MazeState>([startingState]);
  const cameFrom = new Map<MazeState, MazeState>();

  const gScore = new Map<MazeState, number>([[startingState, 0]]);
  const fScore = new Map<MazeState, number>([
    [startingState, calculateHeuristic(startingState, endPoint)],
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

    const [currentPoint, currentDirection] = getPointAndDirection(current);

    if (currentPoint.x === endPoint.x && currentPoint.y === endPoint.y) {
      return gScore.get(current);
    }

    openSet.delete(current);

    // There are 3 possible neighbour states: moving in the current direction, or rotating left or right.
    // The first is only possible if the next cell is not a wall.
    const neighbours: MazeState[] = [
      `${pointToString(currentPoint)}_${getNextDirection(
        currentDirection,
        "L"
      )}`,
      `${pointToString(currentPoint)}_${getNextDirection(
        currentDirection,
        "R"
      )}`,
    ];

    const nextPointInCurrentDirection = addPoints(
      currentPoint,
      directionToVectorMap[currentDirection]
    );

    if (maze[nextPointInCurrentDirection.y][nextPointInCurrentDirection.x]) {
      neighbours.push(
        `${pointToString(nextPointInCurrentDirection)}_${currentDirection}`
      );
    }

    neighbours.forEach((neighbour) => {
      const tentativeGScore =
        gScore.get(current)! +
        (() => {
          const [, neighbourDirection] = getPointAndDirection(neighbour);

          if (neighbourDirection === currentDirection) {
            return STEP_COST;
          }

          return ROTATION_COST;
        })();

      if (!gScore.has(neighbour) || tentativeGScore < gScore.get(neighbour)!) {
        cameFrom.set(neighbour, current);
        gScore.set(neighbour, tentativeGScore);
        fScore.set(
          neighbour,
          tentativeGScore + calculateHeuristic(neighbour, endPoint)
        );
        openSet.add(neighbour);
      }
    });
  }
}

function part2({ endPoint, maze, startPoint }: ParsedInput) {
  const startingState: MazeState = `${pointToString(startPoint)}_E`;

  const openSet = new Set<MazeState>([startingState]);
  const cameFrom = new Map<MazeState, MazeState[]>();

  const gScore = new Map<MazeState, number>([[startingState, 0]]);
  const fScore = new Map<MazeState, number>([
    [startingState, calculateHeuristic(startingState, endPoint)],
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

    const [currentPoint, currentDirection] = getPointAndDirection(current);

    if (currentPoint.x === endPoint.x && currentPoint.y === endPoint.y) {
      const uniquePoints = new Set<string>();

      let currentLocations: MazeState[] = [current];

      //   Merge together all the unique points that are passed through in any of the paths.
      while (currentLocations.length > 0) {
        const nextLocations: MazeState[] = [];

        currentLocations.forEach((location) => {
          const [point] = getPointAndDirection(location);

          uniquePoints.add(pointToString(point));

          const cameFromStates = cameFrom.get(location);

          if (cameFromStates) {
            cameFromStates.forEach((fromState) => {
              nextLocations.push(fromState);
            });
          }
        });

        currentLocations = nextLocations;
      }

      return uniquePoints.size;
    }

    openSet.delete(current);

    // There are 3 possible neighbour states: moving in the current direction, or rotating left or right.
    // The first is only possible if the next cell is not a wall.
    const neighbours: MazeState[] = [
      `${pointToString(currentPoint)}_${getNextDirection(
        currentDirection,
        "L"
      )}`,
      `${pointToString(currentPoint)}_${getNextDirection(
        currentDirection,
        "R"
      )}`,
    ];

    const nextPointInCurrentDirection = addPoints(
      currentPoint,
      directionToVectorMap[currentDirection]
    );

    if (maze[nextPointInCurrentDirection.y][nextPointInCurrentDirection.x]) {
      neighbours.push(
        `${pointToString(nextPointInCurrentDirection)}_${currentDirection}`
      );
    }

    neighbours.forEach((neighbour) => {
      const tentativeGScore =
        gScore.get(current)! +
        (() => {
          const [, neighbourDirection] = getPointAndDirection(neighbour);

          if (neighbourDirection === currentDirection) {
            return STEP_COST;
          }

          return ROTATION_COST;
        })();

      if (!gScore.has(neighbour) || tentativeGScore < gScore.get(neighbour)!) {
        cameFrom.set(neighbour, [current]);
        gScore.set(neighbour, tentativeGScore);
        fScore.set(
          neighbour,
          tentativeGScore + calculateHeuristic(neighbour, endPoint)
        );
        openSet.add(neighbour);
      } else if (tentativeGScore === gScore.get(neighbour)) {
        cameFrom.get(neighbour)!.push(current);
      }
    });
  }
}

presentDayResults(DAY, getInput, part1, part2);
