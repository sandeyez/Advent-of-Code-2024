import { getInputForDay, presentDayResults } from "../utils";

const DAY = 24;

type Gate = {
  operand1: string;
  operand2: string;
  operator: "AND" | "OR" | "XOR";
  result: string;
};

type ParsedInput = {
  values: {
    [key: string]: number;
  };
  gates: Gate[];
};

const INPUT_REGEX = /([x-z]\d\d): (\d)/;
const GATE_REGEX = /(\w+) (AND|OR|XOR) (\w+) -> (\w+)/;

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  const values: ParsedInput["values"] = {};
  const gates: ParsedInput["gates"] = [];

  lines.forEach((line) => {
    const inputMatch = line.match(INPUT_REGEX);

    if (inputMatch) {
      values[inputMatch[1]] = parseInt(inputMatch[2]);
      return;
    }

    const gateMatch = line.match(GATE_REGEX);

    if (gateMatch) {
      gates.push({
        operand1: gateMatch[1],
        operator: gateMatch[2] as any,
        operand2: gateMatch[3],
        result: gateMatch[4],
      });
      return;
    }
  });

  return {
    values: values,
    gates,
  };
}

function evaluateGate(
  gate: Gate,
  values: ParsedInput["values"],
  gates: ParsedInput["gates"]
): number {
  const operand1 =
    gate.operand1 in values
      ? values[gate.operand1]
      : evaluateGate(
          gates.find((g) => g.result === gate.operand1)!,
          values,
          gates
        );
  const operand2 =
    gate.operand2 in values
      ? values[gate.operand2]
      : evaluateGate(
          gates.find((g) => g.result === gate.operand2)!,
          values,
          gates
        );

  switch (gate.operator) {
    case "AND":
      return operand1 & operand2;
    case "OR":
      return operand1 | operand2;
    case "XOR":
      return operand1 ^ operand2;
  }
}

function part1({ gates, values: valuesInput }: ParsedInput) {
  const zGates = gates
    .filter((gate) => gate.result.startsWith("z"))
    .sort((a, b) => b.result.localeCompare(a.result));

  return parseInt(
    zGates.map((gate) => evaluateGate(gate, valuesInput, gates)).join(""),
    2
  );
}

function part2({ gates, values }: ParsedInput) {
  const bitLength = Object.values(values).length / 2;

  const faultySumGates = gates.filter(
    ({ operator, result }) =>
      result.startsWith("z") &&
      operator !== "XOR" &&
      !result.endsWith(`${bitLength}`)
  );

  const faultyIntermediateGates = gates.filter(
    ({ operator, operand1, operand2, result }) =>
      !["x", "y"].includes(operand1[0]) &&
      !["x", "y"].includes(operand2[0]) &&
      operator === "XOR" &&
      !result.startsWith(`z`)
  );

  const disconnectedXORGates = gates.filter(
    ({ operator, operand1, operand2, result }) => {
      if (operator !== "XOR") return false;

      if (result === "z00") return false;

      if (
        !["x", "y"].includes(operand1[0]) &&
        !["x", "y"].includes(operand2[0])
      )
        return false;

      const XORGateWithResultAsInput = gates.find(
        (gate) =>
          gate.operator === "XOR" &&
          (gate.operand1 === result || gate.operand2 === result)
      );

      return !XORGateWithResultAsInput;
    }
  );

  const disconnectedANDGates = gates.filter(
    ({ operator, operand1, operand2, result }) => {
      if (operator !== "AND") return false;

      if (operand1 === "x00" || operand2 === "x00") return false;

      if (
        !["x", "y"].includes(operand1[0]) &&
        !["x", "y"].includes(operand2[0])
      )
        return false;

      const XORGateWithResultAsInput = gates.find(
        (gate) =>
          gate.operator === "OR" &&
          (gate.operand1 === result || gate.operand2 === result)
      );

      return !XORGateWithResultAsInput;
    }
  );

  return [
    ...new Set<string>([
      ...faultySumGates.map((g) => g.result),
      ...faultyIntermediateGates.map((g) => g.result),
      ...disconnectedXORGates.map((g) => g.result),
      ...disconnectedANDGates.map((g) => g.result),
    ]),
  ]
    .sort()
    .join(",");
}

presentDayResults(DAY, getInput, part1, part2);
