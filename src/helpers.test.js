import {getTextsWithOffsets, areNeighborsOnKeyboard, getPositionOfLetter} from "./helpers";

test("getTextWithOffsets", () => {
    expect(JSON.stringify(getTextsWithOffsets("hallo ich bin  cool"))).toBe(
        JSON.stringify([
            ["hallo", 0],
            [" ", 5],
            ["ich", 6],
            [" ", 9],
            ["bin", 10],
            ["  ", 13],
            ["cool", 15]
        ])
    );
    expect(JSON.stringify(getTextsWithOffsets("hallo ich bin  cool."))).toBe(
        JSON.stringify([
            ["hallo", 0],
            [" ", 5],
            ["ich", 6],
            [" ", 9],
            ["bin", 10],
            ["  ", 13],
            ["cool", 15],
            [".", 19],
        ])
    );
    expect(JSON.stringify(getTextsWithOffsets("hallo ich bin,  cool."))).toBe(
        JSON.stringify([
            ["hallo", 0],
            [" ", 5],
            ["ich", 6],
            [" ", 9],
            ["bin", 10],
            [",", 13],
            ["  ", 14],
            ["cool", 16],
            [".", 20],
        ])
    )
})

test("areNeighborsOnKeyboard", () => {
    expect(areNeighborsOnKeyboard('1', 'w')).toBeTruthy();
    expect(areNeighborsOnKeyboard('q', '2')).toBeTruthy();
    expect(areNeighborsOnKeyboard('q', 'w')).toBeTruthy();
    expect(areNeighborsOnKeyboard('Q', 'W')).toBeTruthy();
    expect(areNeighborsOnKeyboard('Q', 'E')).toBeFalsy();
    expect(areNeighborsOnKeyboard('Q', 'EA')).toBeFalsy();
    expect(areNeighborsOnKeyboard('Q', '')).toBeFalsy();
    expect(areNeighborsOnKeyboard('', 'E')).toBeFalsy();
})

test("getPosition", () => {
    const position = getPositionOfLetter('q');
    expect(position.row).toBe(1);
    expect(position.col).toBe(0);
})
