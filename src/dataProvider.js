import axios from "axios";
import qs from 'qs';
import {patienceDiff, patienceDiffPlus} from "./patienceDiff";
import {areNeighborsOnKeyboard} from "./helpers";

class SpellCheckError {
    constructor(id, categoryId, title, markColor, borderColor, group) {
        this.id = id;
        this.categoryId = categoryId;
        this.title = title;
        this.markColor = markColor;
        this.borderColor = borderColor;
        this.group = group;
    }
}

const konsonanten = ['b', 'c', 'd', 'f', 'g', 'h', 'j','k','l','m','n','p', 'q', 'r', 's', 't', 'v','w', 'x', 'y', 'z']
const vokale = ['a','e','i','o','u']

export const spellCheckErrors = {
    "GetrenntFuerZusammen": new SpellCheckError(
        "GetrenntFuerZusammen",
        4,
        "Getrennt- für Zusammenschreibung",
        'rgba(75, 192, 192, 0.4)',
        'rgba(75, 192, 192, 1)',
        2
    ),
    "Uppercase_insteadOf_Lowercase": new SpellCheckError(
        "Uppercase_insteadOf_Lowercase",
        2,
        "Groß- für Kleinschreibung",
        'rgba(255, 99, 132, 0.4)',
        'rgba(255, 99, 132, 1)',
        3
    ),
    "Lowercase_insteadOf_Uppercase": new SpellCheckError(
        "Lowercase_insteadOf_Uppercase",
        1,
        "Klein- für Großschreibung",
        'rgba(54, 162, 235, 0.4)',
        'rgba(54, 162, 235, 1)',
        2
    ),
    "UppercaseInTheMiddle": new SpellCheckError(
        "UppercaseInTheMiddle",
        3,
        "Großschreibung im Wort",
        'rgba(255, 206, 86, 0.4)',
        'rgba(255, 206, 86, 1)',
        1
    ),
    "hasDoubledInsteadOfSingleKonsonant": new SpellCheckError(
        "hasDoubledInsteadOfSingleKonsonant",
        8,
        "Konsonantenverdopplung für Einfachschreibung",
        'rgba(75, 192, 192, 0.4)',
        'rgba(75, 192, 192, 1)',
        3
    ),
    "hasSingleInsteadOfDoubleKonsonant": new SpellCheckError(
        "hasSingleInsteadOfDoubleKonsonant",
        7,
        "Einfachschreibung für Konsonantenverdopplung",
        'rgba(153, 102, 255, 0.4)',
        'rgba(153, 102, 255, 1)',
        2
    ),
    "hasDoubledInsteadOfSingleVokal": new SpellCheckError(
        "hasDoubledInsteadOfSingleVokal",
        10,
        "Markierte Längen für Einfachschreibung nach Langvokal",
        'rgba(255, 159, 64, 0.4)',
        'rgba(255, 159, 64, 1)',
        3
    ),
    "markierteVokalLaengeKurzvokal": new SpellCheckError(
        "markierteVokalLaengeKurzvokal",
        12,
        "Markierte Vokallänge bei Kurzvokal, auch ie für kurze i",
        'rgba(255, 159, 64, 0.4)',
        'rgba(255, 159, 64, 1)',
        1
    ),
    "hasSingleInsteadOfDoubleVokal": new SpellCheckError(
        "hasSingleInsteadOfDoubleVokal",
        9,
        "Einfache Vokalschreibung für markierte Länge",
        'rgba(255, 99, 132, 0.4)',
        'rgba(255, 99, 132, 1)',
    2
    ),
    "SS_insteadOf_SZ": new SpellCheckError(
        "SS_insteadOf_SZ",
        15,
        "ss für ß",
        'rgba(54, 162, 235, 0.4)',
        'rgba(54, 162, 235, 1)',
    3
    ),
    "SZ_insteadOf_SS": new SpellCheckError(
        "SZ_insteadOf_SS",
        16,
        "ß für ss",
        'rgba(255, 206, 86, 0.4)',
        'rgba(255, 206, 86, 1)',
    3
    ),
    "W_insteadOf_V": new SpellCheckError(
        "W_insteadOf_V",
        25,
        "w für v",
        'rgba(75, 192, 192, 0.4)',
        'rgba(75, 192, 192, 1)',
    2
    ),
    "V_insteadOf_W": new SpellCheckError(
        "V_insteadOf_W",
        26,
        "v für w",
        'rgba(153, 102, 255, 0.4)',
        'rgba(153, 102, 255, 1)',
    3
    ),
    "V_insteadOf_F": new SpellCheckError(
        "V_insteadOf_F",
        24,
        "v für f",
        'rgba(255, 159, 64, 0.4)',
        'rgba(255, 159, 64, 1)',
    3
    ),
    "F_insteadOf_V": new SpellCheckError(
        "F_insteadOf_V",
        23,
        "f für v",
        'rgba(255, 99, 132, 0.4)',
        'rgba(255, 99, 132, 1)',
    2
    ),
    "S_insteadOf_SZ": new SpellCheckError(
        "S_insteadOf_SZ",
        13,
        "s für ß",
        'rgba(54, 162, 235, 0.4)',
        'rgba(54, 162, 235, 1)',
    2
    ),
    "SZ_insteadOf_S": new SpellCheckError(
        "SZ_insteadOf_S",
        14,
        "ß für s",
        'rgba(255, 206, 86, 0.4)',
        'rgba(255, 206, 86, 1)',
        3
    ),
    "CH_insteadOf_G": new SpellCheckError(
        "CH_insteadOf_G",
        27,
        "ch für g",
        'rgba(75, 192, 192, 0.4)',
        'rgba(75, 192, 192, 1)',
        2
    ),
    "G_insteadOf_CH": new SpellCheckError(
        "G_insteadOf_CH",
        28,
        "g für ch",
        'rgba(153, 102, 255, 0.4)',
        'rgba(153, 102, 255, 1)',
    3
    ),
    "ae_insteadOf_e": new SpellCheckError(
        "ae_insteadOf_e",
        18,
        "ä für e",
        'rgba(255, 159, 64, 0.4)',
        'rgba(255, 159, 64, 1)',
    3
    ),
    "e_insteadOf_ae": new SpellCheckError(
        "e_insteadOf_ae",
        17,
        "e für ä",
        'rgba(255, 99, 132, 0.4)',
        'rgba(255, 99, 132, 1)',
    2
    ),
    "aeu_insteadOf_eu": new SpellCheckError(
        "aeu_insteadOf_eu",
        18,
        "äu für eu",
        'rgba(54, 162, 235, 0.4)',
        'rgba(54, 162, 235, 1)',
    3
    ),
    "eu_insteadOf_aeu": new SpellCheckError(
        "eu_insteadOf_aeu",
        17,
        "eu für äu",
        'rgba(255, 206, 86, 0.4)',
        'rgba(255, 206, 86, 1)',
    2
    ),
    "ZusammenFuerGetrennt": new SpellCheckError(
        "ZusammenFuerGetrennt",
        5,
        "Zusammen- für Getrenntschreibung",
        'rgba(153, 102, 255, 0.4)',
        'rgba(153, 102, 255, 1)',
    3
    ),
    "Falscher Vokal": new SpellCheckError(
        "Falscher Vokal",
        34,
        "Falscher Vokal",
        'rgba(255, 159, 64, 0.4)',
        'rgba(255, 159, 64, 1)',
    1
    ),
    "FalscherKonsonant": new SpellCheckError(
        "FalscherKonsonant",
        33,
        "Falscher Konsonant",
        'rgba(255, 99, 132, 0.4)',
        'rgba(255, 99, 132, 1)',
    1
    ),
    "VokalFehlt": new SpellCheckError(
        "VokalFehlt",
        31,
        "Vokalzeichen fehlt",
        'rgba(54, 162, 235, 0.4)',
        'rgba(54, 162, 235, 1)',
    1
    ),
    "KonsonantFehlt": new SpellCheckError(
        "KonsonantFehlt",
        29,
        "Konsonantenzeichen fehlt",
        'rgba(255, 206, 86, 0.4)',
        'rgba(255, 206, 86, 1)',
    1
    ),
    "ExtraVokal": new SpellCheckError(
        "ExtraVokal",
        32,
        "Vokalzeichen hinzugefügt",
        'rgba(75, 192, 192, 0.4)',
        'rgba(75, 192, 192, 1)',
    1
    ),
    "ExtraKonsonant": new SpellCheckError(
        "ExtraKonsonant",
        30,
        "Konsonantenzeichen hinzugefügt",
        'rgba(153, 102, 255, 0.4)',
        'rgba(153, 102, 255, 1)',
    1
    ),
    "swappedChars": new SpellCheckError(
        "swappedChars",
        35,
        "Zeichenumstellung",
        'rgba(153, 102, 255, 0.4)',
        'rgba(153, 102, 255, 1)',
    1
    ),
    "Unknown": new SpellCheckError(
        "Unknown",
        0,
        "Unbekannter Fehler",
        'rgba(255, 159, 64, 0.4)',
        'rgba(255, 159, 64, 1)',
    null
    ),
    "Tippfehler": new SpellCheckError(
        "Tippfehler",
        50,
        "Tippfehler",
        'rgba(255, 99, 132, 0.4)',
        'rgba(255, 99, 132, 1)',
    null
    ),
    "Zeichensetzungsfehler": new SpellCheckError(
        "Zeichensetzungsfehler",
        60,
        "Zeichensetzungsfehler",
        'rgba(255, 159, 64, 0.4)',
        'rgba(255, 159, 64, 1)',
    null),
    "Grammar": new SpellCheckError(
        "Grammar",
        40,
        "Grammatikfehler",
        'rgba(255, 159, 64, 0.4)',
        'rgba(255, 159, 64, 1)',
    null
    )
}

const patienceDiffHelper = (wrongWord, correctWord, isPlusVariant = false) => {
    if (isPlusVariant) {
        return patienceDiffPlus(wrongWord.split(''), correctWord.split(''))
    }
    return patienceDiff(wrongWord.split(''), correctWord.split(''))
}

export const replaceString = (targetStr, insertStr, position, numCharsToReplace = 1) => {
    return targetStr.slice(0, position) + insertStr + targetStr.slice(position + numCharsToReplace);
}

export const startsWithUpperCase = (word) => {
    if (word.length === 0) {
        return false;
    }
    const firstLetter = word.slice(0,1)
    return firstLetter.toUpperCase() === firstLetter
}

export const startsWithLowerCase = (word) => {
    if (word.length === 0) {
        return false
    }
    const firstLetter = word.slice(0,1)
    return firstLetter.toLowerCase() === firstLetter
}

export function isLowercaseInsteadOfUppercase(wrongWord, correctWord) {
    return startsWithLowerCase(wrongWord) && startsWithUpperCase(correctWord)
}

export function isUppercaseInsteadOfLowercase(wrongWord, correctWord) {
    return startsWithUpperCase(wrongWord) && startsWithLowerCase(correctWord)
}


export const mixedLetters = (wrongLetter, correctLetter, wrongWord, correctWord) => {
    //idea: try every occurence of wrongLetter in the wrong word and replace it
    // with the correctLetter and see if the outcome is our correctWord
    for (let i = 0; i < wrongWord.length; i++) {
        // only try to replace occurences of wrongLetter in the wrong word, skip any other letter
        if (wrongWord.slice(i, i + wrongLetter.length) !== wrongLetter) {
            continue;
        }

        if (replaceString(wrongWord, correctLetter, i, wrongLetter.length) === correctWord) {
            return true
        }
    }
    return false;
}

export function hasUppercaseInTheMiddle(wrongWord) {
    if (wrongWord.length < 2) {
        return false;
    }

    for (let i = 1; i < wrongWord.length; i++) {
        const currChar = wrongWord.charAt(i);
        if (currChar.toUpperCase() === currChar) {
            return true
        }
    }
    return false;
}



export function isZusammenStattGetrennt(wrongWord, correctWord) {
    return correctWord.split(" ").length > 1 && wrongWord.split(" ").length === 1
}

export function isGetrenntStattZusammen(wrongWord, correctWord) {
    //spellCheckError.rule.description === "auf halten (aufhalten)"
    return correctWord.split(" ").length === 1 && wrongWord.split(" ").length > 1
}

export function hasDoubledInsteadOfSingleKonsonant(wrongWord, correctWord) {
    return konsonanten.some((k) => mixedLetters(k + k, k, wrongWord, correctWord))
}

export function hasSingleInsteadOfDoubleKonsonant(wrongWord, correctWord) {
    return konsonanten.some((k) => mixedLetters(k, k + k, wrongWord, correctWord))
}

export function hasDoubledInsteadOfSingleVokal(wrongWord, correctWord) {
    return vokale.some((v) => mixedLetters(v + v, v, wrongWord, correctWord))
}

export function hasSingleInsteadOfDoubleVokal(wrongWord, correctWord) {
    return vokale.some((v) => mixedLetters(v, v + v, wrongWord, correctWord))
}

export function oneLetterDiff(wrongWord, correctWord) {
    const diff = patienceDiffHelper(wrongWord, correctWord);
    if (!(diff.lineCountDeleted === 1 && diff.lineCountInserted === 1) ) {
        return [];
    }

    if (hasSwappedCharacters(wrongWord, correctWord)) {
        return [];
    }

    let missingCharInWord2ButInWord1 = diff.lines.find(line => line.aIndex === -1).line;
    let missingCharInWord1ButInWord2 = diff.lines.find(line => line.bIndex === -1).line;
    return [missingCharInWord1ButInWord2, missingCharInWord2ButInWord1]
}

export function isTypo(wrongWord, correctWord) {
    const diff = oneLetterDiff(wrongWord, correctWord);
    return areNeighborsOnKeyboard(diff[0], diff[1]);
}

export function hasWrongKonsonant(wrongWord, correctWord) {
    const diff = oneLetterDiff(wrongWord, correctWord)
    if (diff.length < 2) {
        return false;
    }
    return konsonanten.includes(diff[0]) && konsonanten.includes(diff[1])
}

export function hasWrongVokal(wrongWord, correctWord) {
    const diff = oneLetterDiff(wrongWord, correctWord)
    if (diff.length < 2) {
        return false;
    }
    return vokale.includes(diff[0]) && vokale.includes(diff[1])
}

export function hasSwappedCharacters(wrongWord, correctWord) {
    if (wrongWord.length !== correctWord.length) {
        return false;
    }
    let diff = patienceDiffHelper(wrongWord, correctWord, true)
    return diff.lineCountDeleted === 0 && diff.lineCountInserted === 0 && diff.lineCountMoved > 0;
}

export function missingKonsonant(wrongWord, correctWord) {
    const diff = patienceDiffHelper(wrongWord, correctWord);
    if (!(diff.lineCountDeleted === 0 && diff.lineCountInserted === 1)) {
        return false
    }
    let missingChar = diff.lines.find(line => line.aIndex === -1).line;
    return konsonanten.includes(missingChar);
}

export function missingVokal(wrongWord, correctWord) {
    const diff = patienceDiffHelper(wrongWord, correctWord);
    if (!(diff.lineCountDeleted === 0 && diff.lineCountInserted === 1)) {
        return false
    }
    let missingChar = diff.lines.find(line => line.aIndex === -1).line;
    return vokale.includes(missingChar);
}

export function addedKonsonant(wrongWord, correctWord) {
    const diff = patienceDiffHelper(wrongWord, correctWord);
    if (!(diff.lineCountDeleted === 1 && diff.lineCountInserted === 0)) {
        return false
    }
    let addedChar = diff.lines.find(line => line.bIndex === -1).line;
    return konsonanten.includes(addedChar);
}

export function addedVokal(wrongWord, correctWord) {
    const diff = patienceDiffHelper(wrongWord, correctWord);
    if (!(diff.lineCountDeleted === 1 && diff.lineCountInserted === 0)) {
        return false
    }
    let addedChar = diff.lines.find(line => line.bIndex === -1).line;
    return vokale.includes(addedChar);
}

export function groupErrorsByOccurence (errors) {
    let dict = {};
    for (let error of errors) {
        console.log(error.categories);
        for (let c of error.categories) {
            const currCategory = c;
            if (dict.hasOwnProperty(currCategory)) {
                dict[currCategory].occurences += 1;
            } else {
                dict[currCategory] = {category: currCategory, occurences: 1}
            }
        }
    }
    const entries = Object.keys(dict).map(key => dict[key])
    entries.sort((a, b) => b.occurences - a.occurences)
    return entries;
}

export const getTotalNumErrors = (spellCheckResults) => {
    if (spellCheckResults.matches.length === 0) {
        return 0;
    }
    const groups = groupErrorsByGroup(spellCheckResults.matches);
    return groups[0].occurences + groups[1].occurences + groups[2].occurences + spellCheckResults.numUnknownErrors;
}

export const getKompetenzWert = (spellCheckResults) => {
    const totalNumErrors = getTotalNumErrors(spellCheckResults);
    if (totalNumErrors === 0) {
        return 0;
    }
    const statistics = groupErrorsByGroup(spellCheckResults.matches);
    return (statistics[1].occurences + statistics[2].occurences - statistics[0].occurences) / totalNumErrors * 100;
}

export const countWords = (str) => {
    return str.trim().split(/\s+/).length;
}

export const getRelativerFehler = (spellCheckResults, numWords, klassenstufeAbzug) => {
    return (getTotalNumErrors(spellCheckResults) * 100 / numWords ) / klassenstufeAbzug;
}

export const getLeistungswert = (spellCheckResults, relativerWert) => {
    const totalNumErrors = getTotalNumErrors(spellCheckResults);
    if (totalNumErrors === 0) {
        return 0;
    }
    const statistics = groupErrorsByGroup(spellCheckResults.matches);
    return ((statistics[1].occurences + statistics[2].occurences) / totalNumErrors * 100) - ((statistics[0].occurences / totalNumErrors * 100) * relativerWert);
}

export function groupErrorsByGroup (errors) {
    let dict = {
        1: {group: 1, occurences: 0},
        2: {group: 2, occurences: 0},
        3: {group: 3, occurences: 0}
    };
    for (let error of errors) {
        for (let category of error.categories) {
            error = spellCheckErrors[category];
            if (!error.hasOwnProperty("group") || !error.group) {
                continue;
            }
            if (dict.hasOwnProperty(error.group)) {
                dict[error.group].occurences += 1;
            } else {
                dict[error.group] = {group: error.group, occurences: 1}
            }
        }
    }
    const entries = Object.keys(dict).map(key => dict[key])
    entries.sort((a, b) => a.group - b.group)
    return entries;
}



class DataProvider {

    getCategory(wrongWord, correctWord, spellCheckError) {

        if (spellCheckError.rule.category.id === "COMPOUNDING") {
            return spellCheckErrors["GetrenntFuerZusammen"]
        }
        if (isUppercaseInsteadOfLowercase(wrongWord, correctWord)) {
            return spellCheckErrors["Uppercase_insteadOf_Lowercase"]
        } else if (isLowercaseInsteadOfUppercase(wrongWord, correctWord)) {
            return spellCheckErrors["Lowercase_insteadOf_Uppercase"]
        } else if (hasUppercaseInTheMiddle(wrongWord)) {
            return spellCheckErrors["UppercaseInTheMiddle"]
        } else if (hasDoubledInsteadOfSingleKonsonant(wrongWord, correctWord)) {
            return spellCheckErrors["hasDoubledInsteadOfSingleKonsonant"]
        } else if (hasSingleInsteadOfDoubleKonsonant(wrongWord, correctWord)) {
            return spellCheckErrors["hasSingleInsteadOfDoubleKonsonant"]
        } else if (hasDoubledInsteadOfSingleVokal(wrongWord, correctWord)) {
            return spellCheckErrors["hasDoubledInsteadOfSingleVokal"]
        } else if (hasSingleInsteadOfDoubleVokal(wrongWord, correctWord)) {
            return spellCheckErrors["hasSingleInsteadOfDoubleVokal"]
        } else if (mixedLetters("ss", "ß", wrongWord, correctWord)) {
            return spellCheckErrors["SS_insteadOf_SZ"]
        } else if (mixedLetters("ß", "ss", wrongWord, correctWord)) {
            return spellCheckErrors["SZ_insteadOf_SS"]
        } else if (mixedLetters("w", "v", wrongWord, correctWord)) {
            return spellCheckErrors["W_insteadOf_V"]
        } else if (mixedLetters("v", "w", wrongWord, correctWord)) {
            return spellCheckErrors["V_insteadOf_W"]
        } else if (mixedLetters("v", "f", wrongWord, correctWord)) {
            return spellCheckErrors["V_insteadOf_F"]
        } else if (mixedLetters("f", "v", wrongWord, correctWord)) {
            return spellCheckErrors["F_insteadOf_V"]
        } else if (mixedLetters("s", "ß", wrongWord, correctWord)) {
            return spellCheckErrors["S_insteadOf_SZ"]
        } else if (mixedLetters("ß", "s", wrongWord, correctWord)) {
            return spellCheckErrors["SZ_insteadOf_S"]
        } else if (mixedLetters("ch", "g", wrongWord, correctWord)) {
            return spellCheckErrors["CH_insteadOf_G"]
        } else if (mixedLetters("g", "ch", wrongWord, correctWord)) {
            return spellCheckErrors["G_insteadOf_CH"]
        } else if (mixedLetters("ä", "e", wrongWord, correctWord)) {
            return spellCheckErrors["ae_insteadOf_e"]
        } else if (mixedLetters("e", "ä", wrongWord, correctWord)) {
            return spellCheckErrors["e_insteadOf_ae"]
        } else if (mixedLetters("äu", "eu", wrongWord, correctWord)) {
            return spellCheckErrors["aeu_insteadOf_eu"]
        } else if (mixedLetters("eu", "äu", wrongWord, correctWord)) {
            return spellCheckErrors["eu_insteadOf_aeu"]
        } else if (isZusammenStattGetrennt(wrongWord, correctWord)) {
            return spellCheckErrors["ZusammenFuerGetrennt"]
        } else if (hasWrongVokal(wrongWord, correctWord)) {
            return spellCheckErrors["Falscher Vokal"]
        } else if (hasWrongKonsonant(wrongWord, correctWord)) {
            return spellCheckErrors["FalscherKonsonant"]
        } else if (missingVokal(wrongWord, correctWord)) {
            return spellCheckErrors["VokalFehlt"]
        } else if (missingKonsonant(wrongWord, correctWord)) {
            return spellCheckErrors["KonsonantFehlt"]
        } else if (addedVokal(wrongWord, correctWord)) {
            return spellCheckErrors["ExtraVokal"]
        } else if (addedKonsonant(wrongWord, correctWord)) {
            return spellCheckErrors["ExtraKonsonant"]
        } else if (hasSwappedCharacters(wrongWord, correctWord)) {
            return spellCheckErrors["swappedChars"]
        } else if (isTypo(wrongWord, correctWord)) {
            return spellCheckErrors["Tippfehler"]
        } else {
            return spellCheckErrors["Unknown"]
        }
    }




    errorToCategory (spellCheckError) {
        const replacements = spellCheckError.replacements;
        if (replacements.length === 0 ) {
            return spellCheckErrors["Unknown"]
        }

        const grammarErrorCategories = ["MISC", "GRAMMAR", 'CORRESPONDENCE', 'PUNCTUATION'];
        if (grammarErrorCategories.includes(spellCheckError.rule.category.id)) {
            return spellCheckErrors["Grammar"]
        }

        const wrongWord = spellCheckError.wrongWord;
        const correctWord = replacements[0].value;

        return this.getCategory(wrongWord, correctWord, spellCheckError);
    }

    async getSpellCheckResults(text) {
        const params = {
            text,
            language: "de-DE",
            enabledOnly: false
        };
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(params),
            url: "https://api.languagetoolplus.com/v2/check",
        };
        const response = await axios(options);
        response.data.matches = response.data.matches.map(match => {
            return {
                ...match,
                wrongWord: text.slice(match.offset, match.offset + match.length),
            }
        });
        response.data.matches = response.data.matches.map(match => {
            return {
                ...match,
                categories: [this.errorToCategory(match).id]
            }
        });
        response.data.numUnknownErrors = response.data.matches.filter(match => match.categories.length > 0).filter(match => match.categories[0] === 'Unknown').length
        console.log(response.data);
        return response.data;
    }
}

export default DataProvider;
