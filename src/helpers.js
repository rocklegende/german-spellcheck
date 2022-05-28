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