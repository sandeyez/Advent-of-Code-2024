import { getInputForDay, presentDayResults, type Point } from "../utils";

const DAY = 14;

type Robot = {
  position: Point;
  velocity: Point;
};
type ParsedInput = Robot[];

const INPUT_REGEX = /p=([-]?\d+),([-]?\d+) v=([-]?\d+),([-]?\d+)/;

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  return lines.map((line) => {
    const match = INPUT_REGEX.exec(line);

    if (!match) {
      throw new Error(`Invalid input: ${line}`);
    }

    return {
      position: {
        x: parseInt(match[1], 10),
        y: parseInt(match[2], 10),
      },
      velocity: {
        x: parseInt(match[3], 10),
        y: parseInt(match[4], 10),
      },
    };
  });
}

const GRID_WIDTH = 101;
const GRID_HEIGHT = 103;

const ITERATIONS_COUNT = 100;

function printGrid(robots: Point[]) {
  const grid = Array.from({ length: GRID_HEIGHT }, () =>
    Array.from({ length: GRID_WIDTH }, () => ".")
  );

  robots.forEach((robot) => {
    grid[robot.y][robot.x] =
      grid[robot.y][robot.x] === "."
        ? "1"
        : (parseInt(grid[robot.y][robot.x], 10) + 1).toString();
  });

  console.log(grid.map((row) => row.join("")).join("\n"));
}

function moveRobot(robot: Robot, iterations = 1): Point {
  const computedX = robot.position.x + robot.velocity.x * iterations;
  const computedY = robot.position.y + robot.velocity.y * iterations;

  const correctedX = ((computedX % GRID_WIDTH) + GRID_WIDTH) % GRID_WIDTH;
  const correctedY = ((computedY % GRID_HEIGHT) + GRID_HEIGHT) % GRID_HEIGHT;

  return { x: correctedX, y: correctedY };
}

type Quadrant = {
  start: Point;
  end: Point;
};

function part1(input: ParsedInput) {
  const gridAfterIterations = input.reduce(
    (grid, robot) => {
      const { x, y } = moveRobot(robot, ITERATIONS_COUNT);
      grid[y][x]++;

      return grid;
    },
    Array.from({ length: GRID_HEIGHT }, () =>
      Array.from({ length: GRID_WIDTH }, () => 0)
    )
  );

  const quadrants: Quadrant[] = [
    // Top-left quadrant
    {
      start: { x: 0, y: 0 },
      end: {
        x: Math.floor(GRID_WIDTH / 2) - 1,
        y: Math.floor(GRID_HEIGHT / 2) - 1,
      },
    },
    // Top-right quadrant
    {
      start: { x: Math.floor(GRID_WIDTH / 2) + 1, y: 0 },
      end: {
        x: GRID_WIDTH - 1,
        y: Math.floor(GRID_HEIGHT / 2) - 1,
      },
    },
    // Bottom-left quadrant
    {
      start: { x: 0, y: Math.floor(GRID_HEIGHT / 2) + 1 },
      end: {
        x: Math.floor(GRID_WIDTH / 2) - 1,
        y: GRID_HEIGHT - 1,
      },
    },
    // Bottom-right quadrant
    {
      start: {
        x: Math.floor(GRID_WIDTH / 2) + 1,
        y: Math.floor(GRID_HEIGHT / 2) + 1,
      },
      end: {
        x: GRID_WIDTH - 1,
        y: GRID_HEIGHT - 1,
      },
    },
  ];

  return quadrants.reduce((acc, { start, end }) => {
    let quadrantSum = 0;

    for (let y = start.y; y <= end.y; y++) {
      for (let x = start.x; x <= end.x; x++) {
        quadrantSum += gridAfterIterations[y][x];
      }
    }

    return acc * quadrantSum;
  }, 1);
}

function part2(input: ParsedInput) {
  let robots = input;
  for (let i = 0; true; i++) {
    // Move robots
    robots = robots.map((robot) => ({
      position: moveRobot(robot),
      velocity: robot.velocity,
    }));

    // Check if there is a 3x3 square filled with robots somewhere
    const hasSquare = robots.find((robot) => {
      for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
          if (
            !robots.some(
              (r) =>
                r.position.x === robot.position.x + x &&
                r.position.y === robot.position.y + y
            )
          ) {
            return false;
          }
        }
      }

      return true;
    });

    if (hasSquare) {
      printGrid(robots.map((r) => r.position));
      return i + 1;
    }
  }
}

presentDayResults(DAY, getInput, part1, part2);
