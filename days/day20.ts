import {
  addPoints,
  createGrid,
  directions,
  directionToVectorMap,
  getInputForDay,
  getPointNeighbours,
  manhattanDistance,
  pointToString,
  presentDayResults,
  stringToPoint,
  type Grid,
  type Point,
} from "../utils";

const DAY = 20;
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

function printGrid(grid: Grid<number>) {
  for (const row of grid) {
    console.log(
      row
        .map((cell) => {
          if (cell === null) {
            return "XX";
          }

          return cell.toString().padStart(2, "0");
        })
        .join("")
    );
  }
}

const PICOSECONDS_TO_SAVE = 100;
const PICOSECONDS_TO_CHEAT_PART_1 = 2;

function part1({ maze, startPoint, endPoint }: ParsedInput) {
  const stepsMap: Map<string, number> = new Map();

  stepsMap.set(pointToString(startPoint), 0);

  let point: Point = startPoint;
  let previousPoint: Point = { x: -1, y: -1 };

  while (point.x !== endPoint.x || point.y !== endPoint.y) {
    const pointNeighbours = getPointNeighbours(point);

    const nextNeighbour = pointNeighbours.find((neighbour) => {
      if (neighbour.x === previousPoint.x && neighbour.y === previousPoint.y) {
        return false;
      }

      return maze[neighbour.y][neighbour.x];
    });

    if (!nextNeighbour) {
      throw new Error("No next neighbour found");
    }

    stepsMap.set(
      pointToString(nextNeighbour),
      stepsMap.get(pointToString(point))! + 1
    );

    previousPoint = point;
    point = nextNeighbour;
  }

  return [...stepsMap.entries()].reduce((sum, [point, steps]) => {
    const currentPoint = stringToPoint(point);

    const cheatsFromThisPoint = Object.values(directionToVectorMap).reduce(
      (acc, vector) => {
        const neighbour = addPoints(
          currentPoint,
          vector,
          PICOSECONDS_TO_CHEAT_PART_1
        );

        if (
          neighbour.x < 0 ||
          neighbour.x >= maze[0].length ||
          neighbour.y < 0 ||
          neighbour.y >= maze.length
        ) {
          return acc;
        }

        if (!maze[neighbour.y][neighbour.x]) {
          return acc;
        }

        const neighbourSteps = stepsMap.get(pointToString(neighbour));

        if (neighbourSteps === undefined) {
          throw new Error(
            `No neighbour steps found ${pointToString(neighbour)} ${
              maze[neighbour.y][neighbour.x]
            }`
          );
        }

        const savedSeconds =
          neighbourSteps - steps - PICOSECONDS_TO_CHEAT_PART_1;

        if (savedSeconds >= PICOSECONDS_TO_SAVE) {
          return acc + 1;
        }

        return acc;
      },
      0
    );

    return sum + cheatsFromThisPoint;
  }, 0);
}

const PICOSECONDS_TO_CHEAT_PART_2 = 20;

function part2({ maze, startPoint, endPoint }: ParsedInput) {
  const stepsMap: Map<string, number> = new Map();

  stepsMap.set(pointToString(startPoint), 0);

  let point: Point = startPoint;
  let previousPoint: Point = { x: -1, y: -1 };

  while (point.x !== endPoint.x || point.y !== endPoint.y) {
    const pointNeighbours = getPointNeighbours(point);

    const nextNeighbour = pointNeighbours.find((neighbour) => {
      if (neighbour.x === previousPoint.x && neighbour.y === previousPoint.y) {
        return false;
      }

      return maze[neighbour.y][neighbour.x];
    });

    if (!nextNeighbour) {
      throw new Error("No next neighbour found");
    }

    stepsMap.set(
      pointToString(nextNeighbour),
      stepsMap.get(pointToString(point))! + 1
    );

    previousPoint = point;
    point = nextNeighbour;
  }

  return [...stepsMap.entries()].reduce((cheatsSet, [point, steps]) => {
    // Find all the points that are within STEPS_TO_CHEAT_PART_2 steps from the current point, using manhattan distance
    const cheatStartPoint = stringToPoint(point);

    for (
      let deltaY = -PICOSECONDS_TO_CHEAT_PART_2;
      deltaY <= PICOSECONDS_TO_CHEAT_PART_2;
      deltaY++
    ) {
      const remainingSteps = PICOSECONDS_TO_CHEAT_PART_2 - Math.abs(deltaY);

      for (let deltaX = -remainingSteps; deltaX <= remainingSteps; deltaX++) {
        const cheatEndPoint = addPoints(cheatStartPoint, {
          x: deltaX,
          y: deltaY,
        });

        if (!stepsMap.has(pointToString(cheatEndPoint))) continue;

        const neighbourSteps = stepsMap.get(pointToString(cheatEndPoint))!;

        if (
          neighbourSteps -
            steps -
            manhattanDistance(cheatStartPoint, cheatEndPoint) >=
          PICOSECONDS_TO_SAVE
        ) {
          cheatsSet.add([point, pointToString(cheatEndPoint)].join("->"));
        }
      }
    }

    return cheatsSet;
  }, new Set<string>()).size;
}

presentDayResults(DAY, getInput, part1, part2);
