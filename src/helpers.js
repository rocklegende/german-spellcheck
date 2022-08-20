export const getTextsWithOffsets = (text) => {

    let splitted = text.split(/(\s+|\.|,)/);
    let offset = 0;
    let res = [];

    for (let str of splitted) {
        res.push([str, offset])
        offset += str.length
    }

    return res.filter(entry => entry[0] !== '');
}

export const germanLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'ß'],
    ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä'],
    ['y', 'x', 'c', 'v', 'b', 'n', 'm'],
]

export const getPositionOfLetter = (letter, layout = germanLayout) => {
    for (let row = 0; row < layout.length; row++) {
        for (let col = 0; col < layout[row].length; col++) {
            if (letter.toLowerCase() ===  layout[row][col]) {
                return {row, col};
            }
        }
    }
    return null;
}

export const areNeighborsOnKeyboard = (letterA, letterB) => {
    if (!letterA || !letterB) {
        return false;
    }
    if (letterA.length > 1 || letterB.length > 1) {
        return false;
    }
    if (letterA.toLowerCase() === letterB.toLowerCase()) {
        return false;
    }

    const posLetterA = getPositionOfLetter(letterA);
    const posLetterB = getPositionOfLetter(letterB);
    if (!posLetterA || !posLetterB) {
        return false;
    }
    return Math.abs(posLetterA.row - posLetterB.row) <= 1 && Math.abs(posLetterA.col - posLetterB.col) <= 1

}