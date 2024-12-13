import { getInputForDay, presentDayResults, type Point } from "../utils";
import { equalTo, greaterEq, solve, type Model } from "yalps";

const DAY = 13;

type Arcade = {
  buttonA: Point;
  buttonB: Point;
  prize: Point;
};

type ParsedInput = Arcade[];

const X_Y_REGEX = /X[+=]([\d]+),\s*Y[=+]([\d]+)/;

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  const input: ParsedInput = [];

  let currentInput: Partial<Arcade> = {};

  lines.forEach((line, lineIndex) => {
    const match = line.match(X_Y_REGEX);

    if (line === "" || !match) {
      input.push(currentInput as Arcade);
      currentInput = {};
      return;
    }

    const x = parseInt(match[1]);
    const y = parseInt(match[2]);

    if (lineIndex % 4 === 0) {
      currentInput.buttonA = { x, y };
      return;
    }

    if (lineIndex % 4 === 1) {
      currentInput.buttonB = { x, y };
      return;
    }

    if (lineIndex % 4 === 2) {
      currentInput.prize = { x, y };
      return;
    }
  });

  return input;
}

const BUTTON_A_COST = 3;
const BUTTON_B_COST = 1;

function getOptimalCost({ buttonA, buttonB, prize }: Arcade): number {
  const model: Model = {
    objective: "cost",
    direction: "minimize",
    constraints: {
      a: { min: 0 },
      b: { min: 0 },
      positionX: equalTo(prize.x),
      positionY: equalTo(prize.y),
    },
    variables: {
      a: { positionX: buttonA.x, positionY: buttonA.y, cost: BUTTON_A_COST },
      b: { positionX: buttonB.x, positionY: buttonB.y, cost: BUTTON_B_COST },
    },
    integers: true,
  };

  const { variables, status } = solve(model, {
    precision: 0.01,
  });

  if (status !== "optimal") return 0;

  const aSteps = variables[0][1];
  const bSteps = variables[1][1];

  const computedPrize = {
    x: aSteps * buttonA.x + bSteps * buttonB.x,
    y: aSteps * buttonA.y + bSteps * buttonB.y,
  };

  if (computedPrize.x !== prize.x || computedPrize.y !== prize.y) {
    return 0;
  }

  return aSteps * BUTTON_A_COST + bSteps * BUTTON_B_COST;
}

function part1(input: ParsedInput) {
  return input.reduce((acc, arcade) => {
    const cost = getOptimalCost(arcade);

    return acc + cost;
  }, 0);
}

const PRIZE_LOCATION_INCREMENT = 10000000000000;

function part2(input: ParsedInput) {
  return input.reduce((acc, { buttonA, buttonB, prize }) => {
    const cost = getOptimalCost({
      buttonA,
      buttonB,
      prize: {
        x: prize.x + PRIZE_LOCATION_INCREMENT,
        y: prize.y + PRIZE_LOCATION_INCREMENT,
      },
    });

    return acc + cost;
  }, 0);
}

presentDayResults(DAY, getInput, part1, part2);
