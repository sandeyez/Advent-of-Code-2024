import { getInputForDay, presentDayResults } from "../utils";

const DAY = 23;
type ParsedInput = Map<string, Map<string, string>>;

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  const map = new Map<string, Map<string, string>>();

  lines.forEach((line) => {
    const parts = line.split("-");
    const from = parts[0];
    const to = parts[1];

    if (!map.has(from)) {
      map.set(from, new Map());
    }

    map.get(from)!.set(to, parts[2]);

    if (!map.has(to)) {
      map.set(to, new Map());
    }
    map.get(to)!.set(from, parts[2]);
  });

  return map;
}

function part1(input: ParsedInput) {
  return [...input.keys().filter((key) => key.startsWith("t"))].reduce(
    (acc, key) => {
      const connectedNodes = [...input.get(key)!.keys()];

      // Check if there is a connection between any of the nodes
      for (const node1 of connectedNodes) {
        for (const node2 of connectedNodes) {
          if (node1 === node2) {
            continue;
          }

          if (input.get(node1)?.has(node2)) {
            acc.add([node1, node2, key].sort().join("-"));
          }
        }
      }

      return acc;
    },
    new Set<string>()
  ).size;
}

function part2(input: ParsedInput) {
  let possibleCliques: Set<string> = new Set(
    [...input.keys()].map((key) => JSON.stringify([key]))
  );

  // Find the largest clique in the graph
  while (true) {
    const nextPossibleCliques: Set<string> = new Set();

    for (const possibleCliqueString of possibleCliques) {
      const possibleClique: Set<string> = new Set(
        JSON.parse(possibleCliqueString)
      );

      const node = [...possibleClique].at(
        Math.floor(Math.random() * possibleClique.size)
      )!;

      const neighbours = input.get(node);

      if (!neighbours) {
        continue;
      }

      const connectedKeys = [...neighbours.keys()];

      for (const connectedKey of connectedKeys) {
        if (possibleClique.has(connectedKey)) {
          continue;
        }

        if (
          possibleClique
            .values()
            .every((value) => input.get(value)?.has(connectedKey))
        ) {
          const newClique = new Set(possibleClique);
          newClique.add(connectedKey);

          nextPossibleCliques.add(JSON.stringify([...newClique].sort()));
        }
      }
    }

    if (nextPossibleCliques.size === 0) {
      break;
    }

    possibleCliques = nextPossibleCliques;
  }

  return JSON.parse([...possibleCliques][0])
    .sort()
    .join(",");
}

presentDayResults(DAY, getInput, part1, part2);
