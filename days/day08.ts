import {
  getInputForDay,
  pointToString,
  presentDayResults,
  stringToPoint,
  type Point,
} from "../utils";

const DAY = 8;

type Antenna = {
  frequency: string;
  location: Point;
};

type ParsedInput = { antennas: Antenna[]; sizeX: number; sizeY: number };

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  const antennas: Antenna[] = [];

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      const char = lines[y][x];

      if (char !== ".") {
        antennas.push({
          frequency: char,
          location: { x, y },
        });
      }
    }
  }

  return {
    antennas,
    sizeX: lines[0].length,
    sizeY: lines.length,
  };
}

function printMap(
  antennas: Antenna[],
  antiNodes: Iterable<string>,
  sizeX: number,
  sizeY: number
) {
  const map = Array.from({ length: sizeY }, () =>
    Array.from({ length: sizeX }, () => ".")
  );

  for (const { frequency, location } of antennas) {
    map[location.y][location.x] = frequency;
  }

  for (const antiNode of antiNodes) {
    const { x, y } = stringToPoint(antiNode);
    map[y][x] = "#";
  }

  console.log(map.map((line) => line.join("")).join("\n"));
}

function part1({ antennas, sizeX, sizeY }: ParsedInput) {
  const antennaFrequencies = antennas.reduce((acc, { frequency, location }) => {
    if (!acc.has(frequency)) {
      acc.set(frequency, []);
    }

    acc.get(frequency)!.push(location);

    return acc;
  }, new Map<string, Point[]>());

  const antinodeLocations = new Set<string>();

  antennaFrequencies.entries().forEach(([, locations]) => {
    for (let i = 0; i < locations.length; i++) {
      for (let j = 0; j < locations.length; j++) {
        if (i === j) continue;

        const location1 = locations[i];
        const location2 = locations[j];

        const deltaY = location2.y - location1.y;
        const deltaX = location2.x - location1.x;

        const antiNodeLocation: Point = {
          x: location1.x + deltaX * 2,
          y: location1.y + deltaY * 2,
        };

        if (antiNodeLocation.x < 0 || antiNodeLocation.x >= sizeX) continue;
        if (antiNodeLocation.y < 0 || antiNodeLocation.y >= sizeY) continue;

        antinodeLocations.add(pointToString(antiNodeLocation));
      }
    }
  });

  return antinodeLocations.size;
}

function part2({ antennas, sizeX, sizeY }: ParsedInput) {
  const antennaFrequencies = antennas.reduce((acc, { frequency, location }) => {
    if (!acc.has(frequency)) {
      acc.set(frequency, []);
    }

    acc.get(frequency)!.push(location);

    return acc;
  }, new Map<string, Point[]>());

  const antinodeLocations = new Set<string>();

  antennaFrequencies.entries().forEach(([, locations]) => {
    for (let i = 0; i < locations.length; i++) {
      for (let j = 0; j < locations.length; j++) {
        if (i === j) continue;

        const location1 = locations[i];
        const location2 = locations[j];

        antinodeLocations.add(pointToString(location1));

        const deltaY = location2.y - location1.y;
        const deltaX = location2.x - location1.x;

        const antiNodeLocation: Point = {
          x: location1.x + deltaX * 2,
          y: location1.y + deltaY * 2,
        };

        while (
          antiNodeLocation.x >= 0 &&
          antiNodeLocation.x < sizeX &&
          antiNodeLocation.y >= 0 &&
          antiNodeLocation.y < sizeY
        ) {
          antinodeLocations.add(pointToString(antiNodeLocation));

          antiNodeLocation.x += deltaX;
          antiNodeLocation.y += deltaY;
        }
      }
    }
  });

  return antinodeLocations.size;
}

presentDayResults(DAY, getInput, part1, part2);
