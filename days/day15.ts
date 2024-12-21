import {
  addPoints,
  directionToVectorMap,
  getInputForDay,
  pointToString,
  presentDayResults,
  stringToPoint,
  type Direction,
  type Point,
} from "../utils";

const DAY = 15;

type Grid = ("wall" | "obstacle" | null)[][];
type ParsedInput = {
  robot: Point;
  grid: Grid;
  movements: Direction[];
};

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  let parsingGrid = true;

  const grid: ParsedInput["grid"] = [];
  let robot: Point;

  const movements: Direction[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (parsingGrid) {
      if (line === "") {
        parsingGrid = false;
        continue;
      }

      if (line.split("").every((char) => char === "#")) {
        continue;
      }

      grid.push(
        line
          .substring(1, line.length - 1)
          .split("")
          .map((char, i) => {
            if (char === "@") {
              robot = { x: i, y: grid.length };
              return null;
            }

            if (char === ".") {
              return null;
            }

            if (char === "#") {
              return "wall";
            }

            return "obstacle";
          })
      );

      continue;
    }

    movements.push(
      ...line.split("").map((char) => {
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

        throw new Error(`Invalid character: ${char}`);
      })
    );
  }
  return {
    movements,
    robot: robot!,
    grid,
  };
}

function printGrid(grid: Grid, robot: Point) {
  console.log(
    new Array(grid[0].length + 2).fill("#").join("") +
      "\n" +
      grid
        .map(
          (row, y) =>
            `#${row
              .map((cell, x) => {
                if (x === robot.x && y === robot.y) {
                  return "@";
                }

                return cell === "wall" ? "#" : cell === "obstacle" ? "O" : ".";
              })
              .join("")}#`
        )
        .join("\n") +
      "\n" +
      new Array(grid[0].length + 2).fill("#").join("")
  );
}

function part1({ grid, movements, robot }: ParsedInput) {
  let robotPosition = robot;

  const gridAfterMovements = movements.reduce(
    (acc, direction) => {
      const { x, y } = robotPosition;
      const directionVector = directionToVectorMap[direction];

      let obstaclesToMove: Point[] = [];
      let metAWall = false;

      for (let step = 1; ; step++) {
        const position: Point = {
          x: x + directionVector.x * step,
          y: y + directionVector.y * step,
        };

        if (
          position.x < 0 ||
          position.x >= grid[0].length ||
          position.y < 0 ||
          position.y >= grid.length ||
          acc[position.y][position.x] === "wall"
        ) {
          metAWall = true;
          break;
        }

        if (!acc[position.y][position.x]) {
          break;
        }

        obstaclesToMove.push(position);
      }

      if (metAWall) {
        return acc;
      }

      robotPosition = { x: x + directionVector.x, y: y + directionVector.y };

      if (obstaclesToMove.length === 0) {
        return acc;
      }

      const firstObstacle = obstaclesToMove[0];
      acc[firstObstacle.y][firstObstacle.x] = null;

      const lastObstacle = obstaclesToMove.at(-1)!;
      acc[lastObstacle.y + directionVector.y][
        lastObstacle.x + directionVector.x
      ] = "obstacle";

      return acc;
    },
    [...grid.map((row) => [...row])]
  );

  return gridAfterMovements.reduce(
    (acc, row, y) =>
      acc +
      row.reduce((acc, cell, x) => {
        if (cell === "obstacle") {
          return acc + (x + 1) + 100 * (y + 1);
        }

        return acc;
      }, 0),
    0
  );
}

type NewGrid = ("wall" | "left" | "right" | null)[][];

function printPart2Grid(grid: NewGrid, robot: Point) {
  console.log(
    new Array(grid[0].length + 4).fill("#").join("") +
      "\n" +
      grid
        .map((row, y) => {
          return `##${row
            .map((cell, x) => {
              if (x === robot.x && y === robot.y) {
                return "@";
              }

              if (cell === "wall") {
                return "#";
              }

              if (cell === null) return ".";

              if (cell === "left") {
                return "[";
              }

              if (cell === "right") {
                return "]";
              }
            })
            .join("")}##`;
        })
        .join("\n") +
      "\n" +
      new Array(grid[0].length + 4).fill("#").join("")
  );
}

function part2({ grid, movements, robot }: ParsedInput) {
  const newGrid: NewGrid = grid.map((row, y) =>
    row
      .map((cell, x) => {
        if (cell === "obstacle") {
          const obstacle = { x, y };

          return ["left", "right"] as const;
        }

        if (cell === "wall") {
          return ["wall", "wall"] as const;
        }

        return [null, null];
      })
      .flat()
  );

  let robotPosition: Point = {
    x: robot.x * 2,
    y: robot.y,
  };

  const gridAfterMovements = movements.reduce((acc, direction) => {
    const { x, y } = robotPosition;
    const directionVector = directionToVectorMap[direction];

    let obstaclePositionsToMove: Point[] = [];
    let metAWall = false;

    if (direction === "E" || direction === "W") {
      for (let step = 1; ; step++) {
        const position: Point = {
          x: x + directionVector.x * step,
          y: y + directionVector.y * step,
        };

        if (
          position.x < 0 ||
          position.x >= newGrid[0].length ||
          position.y < 0 ||
          position.y >= newGrid.length ||
          acc[position.y][position.x] === "wall"
        ) {
          metAWall = true;
          break;
        }

        if (acc[position.y][position.x] === null) {
          break;
        }

        obstaclePositionsToMove.push(position);
      }

      if (metAWall) {
        return acc;
      }

      robotPosition = { x: x + directionVector.x, y: y + directionVector.y };

      if (obstaclePositionsToMove.length === 0) {
        return acc;
      }

      const newAcc = [...acc.map((row) => [...row])];

      obstaclePositionsToMove.forEach((position) => {
        newAcc[position.y][position.x] = null;
      });

      obstaclePositionsToMove.forEach((position) => {
        const obstacle = acc[position.y][position.x] as "left" | "right";

        const newPosition = addPoints(position, directionVector);

        newAcc[newPosition.y][newPosition.x] = obstacle;
      });

      return newAcc;
    }

    let pushingPositions: Point[] = [robotPosition];

    for (let step = 1; ; step++) {
      // If one of the pushing positions hits a wall, stop.
      if (
        pushingPositions.some((position) => {
          const nextPosition = addPoints(position, directionVector);

          return (
            nextPosition.x < 0 ||
            nextPosition.x >= newGrid[0].length ||
            nextPosition.y < 0 ||
            nextPosition.y >= newGrid.length ||
            acc[nextPosition.y][nextPosition.x] === "wall"
          );
        })
      ) {
        metAWall = true;
        break;
      }

      // If all pushing positions are empty, stop.
      if (
        pushingPositions.every((position) => {
          const nextPosition = addPoints(position, directionVector);

          acc[nextPosition.y][nextPosition.x] === null;
        })
      ) {
        break;
      }

      // Get all the boxes that will be pushed in the next step.
      const nextLayerPushingPositions = pushingPositions
        .flatMap((position) => {
          const nextPosition = addPoints(position, directionVector);

          const objectAtNextPosition = acc[nextPosition.y][nextPosition.x];

          if (!objectAtNextPosition || objectAtNextPosition === "wall") {
            return null;
          }

          if (objectAtNextPosition === "left") {
            return [nextPosition, { x: nextPosition.x + 1, y: nextPosition.y }];
          }

          if (objectAtNextPosition === "right") {
            return [nextPosition, { x: nextPosition.x - 1, y: nextPosition.y }];
          }

          return null;
        })
        .filter(Boolean) as Point[];

      obstaclePositionsToMove.push(...pushingPositions);

      pushingPositions = nextLayerPushingPositions;
    }

    if (metAWall) {
      return acc;
    }

    robotPosition = { x: x + directionVector.x, y: y + directionVector.y };

    // If the only pushing position is the robot, stop.
    if (obstaclePositionsToMove.length === 0) {
      return acc;
    }

    const newAcc = [...acc.map((row) => [...row])];

    obstaclePositionsToMove.forEach((position) => {
      newAcc[position.y][position.x] = null;
    });

    obstaclePositionsToMove.forEach((position) => {
      const object = acc[position.y][position.x] as "left" | "right";

      const newPosition = addPoints(position, directionVector);

      newAcc[newPosition.y][newPosition.x] = object;
    });

    return newAcc;
  }, newGrid);

  return gridAfterMovements.reduce(
    (rowAcc, row, y) =>
      rowAcc +
      row.reduce((cellAcc, cell, x) => {
        if (cell === "left") {
          return cellAcc + (x + 2) + 100 * (y + 1);
        }

        return cellAcc;
      }, 0),
    0
  );
}

presentDayResults(DAY, getInput, part1, part2);
