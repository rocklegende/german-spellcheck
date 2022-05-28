import {getTextsWithOffsets} from "./helpers";

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
