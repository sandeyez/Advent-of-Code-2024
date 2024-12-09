import { getInputForDay, presentDayResults } from "../utils";

const DAY = 9;

type Space = {
  length: number;
} & (
  | {
      type: "empty";
    }
  | {
      type: "file";
      id: number;
    }
);
type ParsedInput = Space[];

function getInput(): ParsedInput {
  const line = getInputForDay(DAY)[0];

  return line.split("").map((n, i) => {
    const length = parseInt(n, 10);

    if (i % 2 === 0) {
      return {
        type: "file",
        length,
        id: i / 2,
      };
    }

    return {
      type: "empty",
      length,
    };
  });
}

function calculateChecksum(files: Space[]) {
  let checksum = 0;
  let index = 0;

  files.forEach((file) => {
    if (file.type === "file") {
      const { id, length } = file;

      for (let i = 0; i < length; i++) {
        checksum += id * (index + i);
      }
    }

    index += file.length;
  });

  return checksum;
}

function part1(input: ParsedInput) {
  let files = [...input];

  let emptySpaces = input
    .filter((space) => space.type === "empty")
    .reduce((acc, { length }) => acc + length, 0);

  while (emptySpaces > 0) {
    const lastElement = files.pop();

    if (!lastElement) {
      throw new Error("No last element");
    }

    if (lastElement.type === "empty") {
      emptySpaces -= lastElement.length;
      continue;
    }

    let spaceToMove = lastElement.length;

    while (spaceToMove > 0) {
      const firstEmptyElementIndex = files.findIndex(
        (space) => space.type === "empty"
      );

      if (firstEmptyElementIndex === -1) {
        files.push({
          type: "file",
          length: spaceToMove,
          id: lastElement.id,
        });

        break;
      }
      const firstEmptyElement = files[firstEmptyElementIndex];

      // If the empty space is exactly the same size as the file, we can just replace it
      if (firstEmptyElement.length === spaceToMove) {
        files[firstEmptyElementIndex] = {
          type: "file",
          length: firstEmptyElement.length,
          id: lastElement.id,
        };

        emptySpaces -= firstEmptyElement.length;
        spaceToMove = 0;
      }
      // If the empty space is bigger than the file, we can fill the current one and add a new empty space
      // for the unused space
      else if (firstEmptyElement.length > spaceToMove) {
        files[firstEmptyElementIndex] = {
          type: "file",
          length: spaceToMove,
          id: lastElement.id,
        };

        files.splice(firstEmptyElementIndex + 1, 0, {
          type: "empty",
          length: firstEmptyElement.length - spaceToMove,
        });

        emptySpaces -= spaceToMove;
        spaceToMove = 0;
      }
      // Finally, if the empty space is smaller than the file, we can fill it and keep looking for more empty spaces
      else {
        files[firstEmptyElementIndex] = {
          type: "file",
          length: firstEmptyElement.length,
          id: lastElement.id,
        };

        emptySpaces -= firstEmptyElement.length;
        spaceToMove -= firstEmptyElement.length;
      }
    }
  }

  return calculateChecksum(files);
}

function part2(input: ParsedInput) {
  const highestFileId = input.reduce<number>((acc, space) => {
    if (space.type === "file") {
      return Math.max(acc, space.id);
    }

    return acc;
  }, 0);

  let files = [...input];

  for (let id = highestFileId; id >= 0; id--) {
    const fileWithIdIndex = files.findIndex(
      (space) => space.type === "file" && space.id === id
    );

    const fileWithId = files[fileWithIdIndex];

    if (!fileWithId) {
      continue;
    }

    const emptySpaceToFitFileIndex = files.findIndex(
      (space) => space.type === "empty" && space.length >= fileWithId.length
    );

    if (
      emptySpaceToFitFileIndex < 0 ||
      emptySpaceToFitFileIndex > fileWithIdIndex
    )
      continue;

    const emptySpaceToFitFile = files[emptySpaceToFitFileIndex];

    files[fileWithIdIndex] = {
      type: "empty",
      length: fileWithId.length,
    };

    if (emptySpaceToFitFile.length === fileWithId.length) {
      files[emptySpaceToFitFileIndex] = {
        type: "file",
        length: fileWithId.length,
        id,
      };
    } else {
      const remainingSpace = emptySpaceToFitFile.length - fileWithId.length;

      files[emptySpaceToFitFileIndex] = {
        type: "file",
        length: fileWithId.length,
        id,
      };

      files.splice(emptySpaceToFitFileIndex + 1, 0, {
        type: "empty",
        length: remainingSpace,
      });
    }
  }

  return calculateChecksum(files);
}

presentDayResults(DAY, getInput, part1, part2);
