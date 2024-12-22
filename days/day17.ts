import { getInputForDay, presentDayResults } from "../utils";

const DAY = 17;

type Registers = Record<"A" | "B" | "C", number>;

type ParsedInput = {
  registers: Registers;
  program: number[];
  programString: string;
};

const REGISTER_REGEX = /Register ([A-C]): (\d+)/;
const PROGRAM_REGEX = /Program: (.+)/;

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  let registers: Registers = {
    A: 0,
    B: 0,
    C: 0,
  };

  let program: number[] = [];
  let programString = "";

  for (const line of lines) {
    const registerMatch = line.match(REGISTER_REGEX);
    if (registerMatch) {
      registers[registerMatch[1] as "A" | "B" | "C"] = parseInt(
        registerMatch[2]
      );
    }

    const programMatch = line.match(PROGRAM_REGEX);
    if (programMatch) {
      program = programMatch[1].split(",").map((num) => parseInt(num));
      programString = line;
    }
  }

  return {
    registers,
    program,
    programString,
  };
}

function getComboOperandValue(value: number, registers: Registers): number {
  switch (value) {
    case 0:
    case 1:
    case 2:
    case 3:
      return value;
    case 4:
      return registers.A;
    case 5:
      return registers.B;
    case 6:
      return registers.C;
    default:
      throw new Error(`Invalid combo operand value: ${value}`);
  }
}

function executeDVInstruction(operand: number, registers: Registers) {
  const numerator = registers.A;
  const denominator = Math.pow(2, getComboOperandValue(operand, registers));

  const result = Math.floor(numerator / denominator);

  return result;
}

function executeProgram(program: number[], registersInput: Registers) {
  const registers = { ...registersInput };
  const output: number[] = [];

  for (let pointer = 0; pointer < program.length - 1; ) {
    const instruction = program[pointer];
    const operand = program[pointer + 1];

    let increasePointer = true;

    switch (instruction) {
      // adv instruction
      case 0: {
        const result = executeDVInstruction(operand, registers);

        registers.A = result;
        break;
      }
      // bxl instruction
      case 1: {
        const operand1 = registers.B;
        const operand2 = operand;

        // Calculate the bitwise XOR of the two operands
        const result = (operand1 ^ operand2) >>> 0;

        registers.B = result;
        break;
      }
      // bst instruction
      case 2: {
        const result = getComboOperandValue(operand, registers) & 7;

        registers.B = result;
        break;
      }
      // jnz instruction
      case 3: {
        if (registers.A === 0) break;

        pointer = operand;
        increasePointer = false;
        break;
      }
      // bxc instruction
      case 4: {
        const result = (registers.B ^ registers.C) >>> 0;

        registers.B = result;
        break;
      }
      // out instruction
      case 5: {
        const result = getComboOperandValue(operand, registers) & 7;

        output.push(result);
        break;
      }
      // bdv instruction
      case 6: {
        const result = executeDVInstruction(operand, registers);

        registers.B = result;
        break;
      }
      // cdv instruction
      case 7: {
        const result = executeDVInstruction(operand, registers);

        registers.C = result;
        break;
      }
    }

    if (increasePointer) {
      pointer += 2;
    }
  }

  return output.join("").split("").join(",");
}

function part1({ program, registers: registersInput }: ParsedInput) {
  return executeProgram(program, registersInput);
}

function part2({ programString, program }: ParsedInput) {
  let possibleAs = new Set<number>([0]);
  const length = programString.split(",").length;

  for (let i = 0; i < length; i++) {
    const newPossibleAs = new Set<number>();

    possibleAs.forEach((possibleA) => {
      possibleAs.delete(possibleA);

      for (let guess = 0; guess <= 7; guess++) {
        const guessValue = possibleA * 8 + guess;

        let registers = {
          A: guessValue,
          B: 0,
          C: 0,
        };

        const result = executeProgram(program, registers);

        if (programString.endsWith(result)) {
          newPossibleAs.add(guessValue);
        }
      }
    });

    possibleAs = newPossibleAs;
  }

  return [...possibleAs].reduce((min, n) => {
    if (n < min) return n;

    return min;
  }, Infinity);
}

presentDayResults(DAY, getInput, part1, part2);
