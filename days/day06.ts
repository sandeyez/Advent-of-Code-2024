import { getInputForDay, presentDayResults, type Point } from "../utils";

const DAY = 6;

type Direction = "N" | "E" | "S" | "W";

type ParsedInput = {
  guard: {
    position: Point;
    direction: Direction;
  };
  obstacles: Array<Point>;
  gridSize: [number, number];
};

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  const chars = lines.map((line) => line.split(""));

  let obstacles = new Array<Point>();
  let guard: ParsedInput["guard"];

  for (let i = 0; i < chars.length; i++) {
    for (let j = 0; j < chars[i].length; j++) {
      const char = chars[i][j];

      if (char === "^" || char === ">" || char === "v" || char === "<") {
        guard = {
          position: {
            x: j,
            y: i,
          },
          direction: (() => {
            switch (char) {
              case "^":
                return "N";
              case ">":
                return "E";
              case "v":
                return "S";
              case "<":
                return "W";
            }
          })(),
        };
      }

      if (char === "#") {
        obstacles.push({
          x: j,
          y: i,
        });
      }
    }
  }

  return {
    guard: guard!,
    obstacles,
    gridSize: [chars.length - 1, chars[0].length - 1],
  };
}

const directionToVectorMap: Record<Direction, Point> = {
  N: {
    x: 0,
    y: -1,
  },
  E: {
    x: 1,
    y: 0,
  },
  S: {
    x: 0,
    y: 1,
  },
  W: {
    x: -1,
    y: 0,
  },
};

function getNextDirection(currentDirection: Direction): Direction {
  switch (currentDirection) {
    case "N":
      return "E";
    case "E":
      return "S";
    case "S":
      return "W";
    case "W":
      return "N";
  }
}

function generateStepsBetweenPoints(
  pointA: Point,
  pointB: Point,
  direction: Direction
): Point[] {
  const { x: directionX, y: directionY } = directionToVectorMap[direction];

  let steps: Point[] = [];

  if (directionX === 0) {
    for (let i = pointA.y; i !== pointB.y; i += directionY) {
      steps.push({ x: pointA.x, y: i });
    }
  } else {
    for (let i = pointA.x; i !== pointB.x; i += directionX) {
      steps.push({ x: i, y: pointA.y });
    }
  }

  return steps;
}

function getMaxPointInDirection(
  point: Point,
  direction: Direction,
  gridSize: [number, number]
): Point {
  const { x: directionX, y: directionY } = directionToVectorMap[direction];
  const [maxX, maxY] = gridSize;

  let maxPoint: Point = { ...point };

  if (directionX === 0) {
    maxPoint.y = directionY < 0 ? 0 : maxY;
  } else {
    maxPoint.x = directionX < 0 ? 0 : maxX;
  }

  return maxPoint;
}

function printVisitedPoints(
  visitedPoints: Set<string>,
  obstacles: Point[],
  gridSize: [number, number]
) {
  const [maxX, maxY] = gridSize;

  for (let i = 0; i <= maxY; i++) {
    let line = "";

    for (let j = 0; j <= maxX; j++) {
      if (obstacles.some(({ x, y }) => x === j && y === i)) {
        line += "#";
      } else if (visitedPoints.has(pointToString({ x: j, y: i }))) {
        line += "X";
      } else {
        line += ".";
      }
    }

    console.log(line);
  }
}

function pointToString(point: Point) {
  return `${point.x},${point.y}`;
}

function stringToPoint(pointString: string): Point {
  const [x, y] = pointString.split(",").map(Number);

  return { x, y };
}

function traverseGrid(
  guard: GuardState,
  obstacles: Point[],
  gridSize: [number, number]
) {
  let { position, direction } = guard;

  // Store all visited positions in a set of strings.
  const visitedPositions = new Set<string>();

  const [maxX, maxY] = gridSize;

  while (
    position.x > 0 &&
    position.x <= maxX &&
    position.y > 0 &&
    position.y <= maxY
  ) {
    visitedPositions.add(pointToString(position));
    const { x: directionX, y: directionY } = directionToVectorMap[direction];

    const nextPosition: Point = {
      x: position.x + directionX,
      y: position.y + directionY,
    };

    if (
      obstacles.some(({ x, y }) => x === nextPosition.x && y === nextPosition.y)
    ) {
      direction = getNextDirection(direction);
      continue;
    }

    position = nextPosition;
  }

  return visitedPositions;
}

function part1(input: ParsedInput) {
  const {
    guard,
    obstacles,
    gridSize: [maxX, maxY],
  } = input;

  const visitedPositions = traverseGrid(guard, obstacles, [maxX, maxY]);

  return visitedPositions.size;
}

type GuardState = {
  position: Point;
  direction: Direction;
};

function part2(input: ParsedInput) {
  const { gridSize, guard, obstacles } = input;
  const [maxX, maxY] = gridSize;

  const visitedPositions = [...traverseGrid(guard, obstacles, gridSize)].map(
    stringToPoint
  );

  // For each of the positions the guard visited, check if a cycle can be created
  // when an obstacle is placed at that position.
  const foundLoops = visitedPositions.reduce((acc, newObstaclePosition) => {
    const newObstacles = [...obstacles, newObstaclePosition];
    const visitedStates: {
      position: string;
      direction: Direction;
    }[] = [];

    let { direction, position } = guard;

    while (
      position.x > 0 &&
      position.x <= maxX &&
      position.y > 0 &&
      position.y <= maxY
    ) {
      const { x: directionX, y: directionY } = directionToVectorMap[direction];

      const nextPosition: Point = {
        x: position.x + directionX,
        y: position.y + directionY,
      };

      if (
        newObstacles.some(
          ({ x, y }) => x === nextPosition.x && y === nextPosition.y
        )
      ) {
        direction = getNextDirection(direction);
      } else position = nextPosition;

      if (
        visitedStates.some(
          (state) =>
            state.position === pointToString(position) &&
            state.direction === direction
        )
      ) {
        return acc + 1;
      }

      visitedStates.push({ position: pointToString(position), direction });
    }

    return acc;
  }, 0);

  return foundLoops;
}

presentDayResults(DAY, getInput, part1, part2);
