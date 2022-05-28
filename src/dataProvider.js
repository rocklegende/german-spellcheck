import axios from "axios";
import qs from 'qs';
import {patienceDiff, patienceDiffPlus} from "./patienceDiff";

const konsonanten = ['b', 'c', 'd', 'f', 'g', 'h', 'j','k','l','m','n','p', 'q', 'r', 's', 't', 'v','w', 'x', 'y', 'z']
const vokale = ['a','e','i','o','u']

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

class SpellCheckError {
    constructor(id, categoryId, title, markColor, borderColor) {
        this.id = id;
        this.categoryId = categoryId;
        this.title = title;
        this.markColor = markColor;
        this.borderColor = borderColor;
    }
}

class DataProvider {

    getCategory(wrongWord, correctWord) {
        if (isUppercaseInsteadOfLowercase(wrongWord, correctWord)) {
            return new SpellCheckError(
                "Uppercase_insteadOf_Lowercase",
                2,
                "Groß- für Kleinschreibung",
                'rgba(255, 99, 132, 0.4)',
                'rgba(255, 99, 132, 1)',
            )

        } else if (isLowercaseInsteadOfUppercase(wrongWord, correctWord)) {
            return new SpellCheckError(
                "Lowercase_insteadOf_Uppercase",
                1,
                "Klein- für Großschreibung",
                'rgba(54, 162, 235, 0.4)',
                'rgba(54, 162, 235, 1)',
            )
        } else if (hasUppercaseInTheMiddle(wrongWord)) {
            return new SpellCheckError(
                "UppercaseInTheMiddle",
                3,
                "Großschreibung im Wort",
                'rgba(255, 206, 86, 0.4)',
                'rgba(255, 206, 86, 1)',
            );
        } else if (hasDoubledInsteadOfSingleKonsonant(wrongWord, correctWord)) {
            return new SpellCheckError(
                "hasDoubledInsteadOfSingleKonsonant",
                8,
                "Konsonantenverdopplung für Einfachschreibung",
                'rgba(75, 192, 192, 0.4)',
                'rgba(75, 192, 192, 1)',

            )
        } else if (hasSingleInsteadOfDoubleKonsonant(wrongWord, correctWord)) {
            return new SpellCheckError(
                "hasSingleInsteadOfDoubleKonsonant",
                7,
                "Einfachschreibung für Konsonantenverdopplung",
                'rgba(153, 102, 255, 0.4)',
                'rgba(153, 102, 255, 1)',
            )
        } else if (hasDoubledInsteadOfSingleVokal(wrongWord, correctWord)) {
            return new SpellCheckError(
                "hasDoubledInsteadOfSingleVokal",
                10,
                "Markierte Längen für Einfachschreibung nach Kurzvokal",
                'rgba(255, 159, 64, 0.4)',
                'rgba(255, 159, 64, 1)'
            )
        } else if (hasSingleInsteadOfDoubleVokal(wrongWord, correctWord)) {
            return new SpellCheckError(
                "hasSingleInsteadOfDoubleVokal",
                9,
                "Einfache Vokalschreibung für markierte Länge",
                'rgba(255, 99, 132, 0.4)',
                'rgba(255, 99, 132, 1)',

            )
        } else if (mixedLetters("ss", "ß", wrongWord, correctWord)) {
            return new SpellCheckError(
                "SS_insteadOf_SZ",
                15,
                "ss für ß",
                'rgba(54, 162, 235, 0.4)',
                'rgba(54, 162, 235, 1)',
            )
        } else if (mixedLetters("ß", "ss", wrongWord, correctWord)) {
            return new SpellCheckError(
                "SZ_insteadOf_SS",
                16,
                "ß für ss",
                'rgba(255, 206, 86, 0.4)',
                'rgba(255, 206, 86, 1)',

            )
        } else if (mixedLetters("w", "v", wrongWord, correctWord)) {
            return new SpellCheckError(
                "W_insteadOf_V",
                25,
                "w für v",
                'rgba(75, 192, 192, 0.4)',
                'rgba(75, 192, 192, 1)',
            )
        } else if (mixedLetters("v", "w", wrongWord, correctWord)) {
            return new SpellCheckError(
                "V_insteadOf_W",
                26,
                "v für w",
                'rgba(153, 102, 255, 0.4)',
                'rgba(153, 102, 255, 1)',
            )
        } else if (mixedLetters("v", "f", wrongWord, correctWord)) {
            return new SpellCheckError(
                "V_insteadOf_F",
                24,
                "v für f",
                'rgba(255, 159, 64, 0.4)',
            'rgba(255, 159, 64, 1)'
            )
        } else if (mixedLetters("f", "v", wrongWord, correctWord)) {
            return new SpellCheckError(
                "F_insteadOf_V",
                23,
                "f für v",
                'rgba(255, 99, 132, 0.4)',
                'rgba(255, 99, 132, 1)',

            )
        } else if (mixedLetters("s", "ß", wrongWord, correctWord)) {
            return new SpellCheckError(
                "S_insteadOf_SZ",
                13,
                "s für ß",
                'rgba(54, 162, 235, 0.4)',
                'rgba(54, 162, 235, 1)',
            )
        } else if (mixedLetters("ß", "s", wrongWord, correctWord)) {
            return new SpellCheckError(
                "SZ_insteadOf_S",
                14,
                "ß für s",
                'rgba(255, 206, 86, 0.4)',
                'rgba(255, 206, 86, 1)',
            )
        } else if (mixedLetters("ch", "g", wrongWord, correctWord)) {

            return new SpellCheckError(
                "CH_insteadOf_G",
                27,
                "ch für g",
                'rgba(75, 192, 192, 0.4)',
                'rgba(75, 192, 192, 1)',
            )
        } else if (mixedLetters("g", "ch", wrongWord, correctWord)) {
            return new SpellCheckError(
                "G_insteadOf_CH",
                28,
                "g für ch",
                'rgba(153, 102, 255, 0.4)',
                'rgba(153, 102, 255, 1)',
            )
        } else if (mixedLetters("ä", "e", wrongWord, correctWord)) {
            return new SpellCheckError(
                "ä_insteadOf_e",
                18,
                "ä für e",
                'rgba(255, 159, 64, 0.4)',
            'rgba(255, 159, 64, 1)'
            )
        } else if (mixedLetters("e", "ä", wrongWord, correctWord)) {
            return new SpellCheckError(
                "e_insteadOf_ä",
                17,
                "e für ä",
                'rgba(255, 99, 132, 0.4)',
                'rgba(255, 99, 132, 1)',
            )
        } else if (mixedLetters("äu", "eu", wrongWord, correctWord)) {
            return new SpellCheckError(
                "äu_insteadOf_eu",
                18,
                "äu für eu",
                'rgba(54, 162, 235, 0.4)',
                'rgba(54, 162, 235, 1)',
            )
        } else if (mixedLetters("eu", "äu", wrongWord, correctWord)) {
            return new SpellCheckError(
                "eu_insteadOf_äu",
                17,
                "eu für äu",
                'rgba(255, 206, 86, 0.4)',
                'rgba(255, 206, 86, 1)',
            )
        } else if (isGetrenntStattZusammen(wrongWord, correctWord)) {
            return new SpellCheckError(
                "GetrenntFuerZusammen",
                4,
                "Getrennt- für Zusammenschreibung",
                'rgba(75, 192, 192, 0.4)',
                'rgba(75, 192, 192, 1)',
            );
        } else if (isZusammenStattGetrennt(wrongWord, correctWord)) {
            return new SpellCheckError(
                "ZusammenFuerGetrennt",
                5,
                "Zusammen- für Getrenntschreibung",
                'rgba(153, 102, 255, 0.4)',
                'rgba(153, 102, 255, 1)',
            );
        } else if (hasWrongVokal(wrongWord, correctWord)) {
            return new SpellCheckError(
                "Falscher Vokal",
                34,
                "Falscher Vokal",
                'rgba(255, 159, 64, 0.4)',
                'rgba(255, 159, 64, 1)'
            )
        } else if (hasWrongKonsonant(wrongWord, correctWord)) {
            return new SpellCheckError(
                "FalscherKonsonant",
                33,
                "Falscher Konsonant",
                'rgba(255, 99, 132, 0.4)',
                'rgba(255, 99, 132, 1)',
            )
        } else if (missingVokal(wrongWord, correctWord)) {
            return new SpellCheckError(
                "VokalFehlt",
                31,
                "Vokalzeichen fehlt",
                'rgba(54, 162, 235, 0.4)',
                'rgba(54, 162, 235, 1)',
            )
        } else if (missingKonsonant(wrongWord, correctWord)) {
            return new SpellCheckError(
                "KonsonantFehlt",
                29,
                "Konsonantenzeichen fehlt",
                'rgba(255, 206, 86, 0.4)',
                'rgba(255, 206, 86, 1)',
            )
        } else if (addedVokal(wrongWord, correctWord)) {
            return new SpellCheckError(
                "ExtraVokal",
                32,
                "Vokalzeichen hinzugefügt",
                'rgba(75, 192, 192, 0.4)',
                'rgba(75, 192, 192, 1)',
            )
        } else if (addedKonsonant(wrongWord, correctWord)) {
            return new SpellCheckError(
                "ExtraKonsonant",
                30,
                "Konsonantenzeichen hinzugefügt",
                'rgba(153, 102, 255, 0.4)',
                'rgba(153, 102, 255, 1)',
            )
        } else if (hasSwappedCharacters(wrongWord, correctWord)) {
            return new SpellCheckError(
                "swappedChars",
                35,
                "Zeichenumstellung",
                'rgba(153, 102, 255, 0.4)',
                'rgba(153, 102, 255, 1)'
            )
        } else {
                return new SpellCheckError(
                    "Unknown",
                    0,
                    "Unbekannter Fehler",
                    'rgba(255, 159, 64, 0.4)',
                    'rgba(255, 159, 64, 1)'
                )
        }
    }


    groupErrorsByOccurence (errors) {
        let dict = {};
        for (let error of errors) {
            const currCategory = error.category;
            if (dict.hasOwnProperty(currCategory.id)) {
                dict[currCategory.id].occurences += 1;
            } else {
                dict[currCategory.id] = {category: currCategory, occurences: 1}
            }
        }
        const entries = Object.keys(dict).map(key => dict[key])
        entries.sort((a, b) => b.occurences - a.occurences)
        return entries;
    }

    errorToCategory (spellCheckError) {
        const replacements = spellCheckError.replacements;
        if (replacements.length === 0 ) {
            return new SpellCheckError(
                "Unknown",
                0,
                "Unbekannter Fehler",
                'rgba(255, 159, 64, 0.4)',
                'rgba(255, 159, 64, 1)'
            )
        }
        const grammarErrorCategories = ["MISC", "GRAMMAR", 'CORRESPONDENCE', 'PUNCTUATION'];
        if (grammarErrorCategories.includes(spellCheckError.rule.category.id)) {
            return new SpellCheckError(
                "Grammar",
                40,
                "Grammatikfehler",
                'rgba(255, 159, 64, 0.4)',
                'rgba(255, 159, 64, 1)'
            )
        }

        const wrongWord = spellCheckError.wrongWord;
        const correctWord = replacements[0].value;

        return this.getCategory(wrongWord, correctWord);
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
                category: this.errorToCategory(match)
            }
        });
        response.data.statistics = this.groupErrorsByOccurence(response.data.matches);
        console.log(response.data);
        return response.data;
    }
}

export default DataProvider;