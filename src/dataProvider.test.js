import {
    addedKonsonant, addedVokal, getKompetenzWert,
    hasDoubledInsteadOfSingleKonsonant,
    hasDoubledInsteadOfSingleVokal,
    hasSingleInsteadOfDoubleKonsonant,
    hasSingleInsteadOfDoubleVokal, hasSwappedCharacters,
    hasUppercaseInTheMiddle, hasWrongKonsonant, hasWrongVokal,
    isGetrenntStattZusammen,
    isLowercaseInsteadOfUppercase, isTypo,
    isUppercaseInsteadOfLowercase,
    isZusammenStattGetrennt, missingKonsonant, missingVokal,
    mixedLetters, oneLetterDiff,
    replaceString
} from "./dataProvider";

function areSameInJSONFormat(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

describe("dataProvider tests", () => {
    test("isUpperCaseInsteadOfLowerCase", () => {
        expect(isUppercaseInsteadOfLowercase("Vogel", "vogel")).toBeTruthy();
        expect(isUppercaseInsteadOfLowercase("vogel", "vogel")).toBeFalsy();
        expect(isUppercaseInsteadOfLowercase("vogel", "Vogel")).toBeFalsy();
        expect(isUppercaseInsteadOfLowercase("Vogel", "Vogel")).toBeFalsy();
    })

    test("isLowerCaseInsteadOfUpperCase", () => {
        expect(isLowercaseInsteadOfUppercase("Vogel", "vogel")).toBeFalsy();
        expect(isLowercaseInsteadOfUppercase("vogel", "voGel")).toBeFalsy();
        expect(isLowercaseInsteadOfUppercase("vogel", "Vogel")).toBeTruthy();
        expect(isLowercaseInsteadOfUppercase("Vogel", "Vogel")).toBeFalsy();
    })

    test("mixedLetters", () => {
        expect(mixedLetters("f", "v", "fogel", "vogel")).toBeTruthy();
        expect(mixedLetters("f", "v", "Vogel", "vogel")).toBeFalsy();
        expect(mixedLetters("v", "f", "vallen", "fallen")).toBeTruthy();
        expect(mixedLetters("v", "f", "fallen", "fallen")).toBeFalsy();
        expect(mixedLetters("tt", "t", "ratten", "raten")).toBeTruthy();
        expect(mixedLetters("ch", "g", "rachen", "ragen")).toBeTruthy();
        expect(mixedLetters("g", "ch", "ragen", "rachen")).toBeTruthy();
    })

    test("getrenntStattZusammen", () => {
        expect(isGetrenntStattZusammen("an gucken", "angucken")).toBeTruthy();
        expect(isGetrenntStattZusammen("an zu gucken", "anzugucken")).toBeTruthy();
        expect(isGetrenntStattZusammen("angucken", "angucken")).toBeFalsy();
        expect(isGetrenntStattZusammen("angucken", "angucken")).toBeFalsy();
    })

    test("isZusammenStattGetrennt", () => {
        expect(isZusammenStattGetrennt("angucken", "an gucken")).toBeTruthy();
        expect(isZusammenStattGetrennt("anzugucken", "an zu gucken")).toBeTruthy();
        expect(isZusammenStattGetrennt("an gucken", "angucken")).toBeFalsy();
        expect(isZusammenStattGetrennt("angucken", "angucken")).toBeFalsy();
    })

    test("wordHasUppercaseInTheMiddle", () => {
        expect(hasUppercaseInTheMiddle("vogel")).toBeFalsy()
        expect(hasUppercaseInTheMiddle("Vogel")).toBeFalsy()
        expect(hasUppercaseInTheMiddle("VoGel")).toBeTruthy()
        expect(hasUppercaseInTheMiddle("voGel")).toBeTruthy()
    })

    test("replaceString", () => {
        expect(replaceString("ratten", "k", 2, 2)).toBe("raken")
        expect(replaceString("ratten", "kk", 2, 2)).toBe("rakken")
        expect(replaceString("rattent", "kk", 6, 2)).toBe("rattenkk")
    })

    test("hasDoubledInsteadOfSingleKonsonant", () => {
        expect(hasDoubledInsteadOfSingleKonsonant("ratten", "raten")).toBeTruthy()
        expect(hasDoubledInsteadOfSingleKonsonant("boohren", "bohren")).toBeFalsy()
        expect(hasDoubledInsteadOfSingleKonsonant("naggen", "nagen")).toBeTruthy()
        expect(hasDoubledInsteadOfSingleKonsonant("warttentt", "wartentt")).toBeTruthy()
    })

    test("hasSingleInsteadOfDoubleKonsonant", () => {
        expect(hasSingleInsteadOfDoubleKonsonant("raten", "ratten")).toBeTruthy()
        expect(hasSingleInsteadOfDoubleKonsonant("boohren", "bohren")).toBeFalsy()
        expect(hasSingleInsteadOfDoubleKonsonant("nagen", "naggen")).toBeTruthy()
        expect(hasSingleInsteadOfDoubleKonsonant("wartentt", "warttentt")).toBeTruthy()
    })

    test("hasDoubledInsteadOfSingleVokal", () => {
        expect(hasDoubledInsteadOfSingleVokal("ratten", "raten")).toBeFalsy()
        expect(hasDoubledInsteadOfSingleVokal("boohren", "bohren")).toBeTruthy()
        expect(hasDoubledInsteadOfSingleVokal("naaggen", "naggen")).toBeTruthy()
        expect(hasDoubledInsteadOfSingleVokal("wat", "waat")).toBeFalsy()
    })

    test("hasSingleInsteadOfDoubleVokal", () => {
        expect(hasSingleInsteadOfDoubleVokal("raten", "ratten")).toBeFalsy()
        expect(hasSingleInsteadOfDoubleVokal("bohren", "boohren")).toBeTruthy()
        expect(hasSingleInsteadOfDoubleVokal("nagen", "naggen")).toBeFalsy()
        expect(hasSingleInsteadOfDoubleVokal("waat", "watten")).toBeFalsy()
    })

    test("oneLetterDiff", () => {
        expect(JSON.stringify(oneLetterDiff("baden", "gaden"))).toBe(JSON.stringify(['b', 'g']))
        expect(JSON.stringify(oneLetterDiff("baaden", "gaden"))).toBe(JSON.stringify([]))
        expect(JSON.stringify(oneLetterDiff("baten", "baden"))).toBe(JSON.stringify(['t', 'd']))
    })

    test("wrongKonsonant", () => {
        expect(hasWrongKonsonant("beten", "geten")).toBeTruthy();
        expect(hasWrongKonsonant("baten", "geten")).toBeFalsy(); //wrong vokal not konsonant
        expect(hasWrongKonsonant("gghen", "gehen")).toBeFalsy(); //konsonant instead of vokal
        expect(hasWrongKonsonant("gehen", "gghen")).toBeFalsy();
        expect(hasWrongKonsonant("gehn", "genh")).toBeFalsy(); //swapped characters
    })

    test("wrongVokal", () => {
        expect(hasWrongVokal("gaten", "geten")).toBeTruthy();
        expect(hasWrongVokal("baden", "gaden")).toBeFalsy(); //only wrong konsonant, not vokal
        expect(hasWrongVokal("gghen", "gehen")).toBeFalsy();
        expect(hasWrongVokal("gehen", "gghen")).toBeFalsy();
        expect(hasWrongVokal("gheen", "gehen")).toBeFalsy(); //swapped characters
    })

    test("konsonantIsMissing", () => {
        expect(missingKonsonant("voel", "vogel")).toBeTruthy()
        expect(missingKonsonant("vogel", "vogel")).toBeFalsy()
        expect(missingKonsonant("vogel", "voel")).toBeFalsy()
        expect(missingKonsonant("voel", "voggel")).toBeFalsy()
    })

    test("vokalIsMissing", () => {
        expect(missingVokal("vgel", "vogel")).toBeTruthy()
        expect(missingVokal("vogl", "vogel")).toBeTruthy()
        expect(missingVokal("vogel", "vogel")).toBeFalsy()
        expect(missingVokal("vogel", "voel")).toBeFalsy()
        expect(missingVokal("voogel", "vogel")).toBeFalsy()
    })

    test("extraKonsonant", () => {
        expect(addedKonsonant("vogtel", "vogel")).toBeTruthy()
        expect(addedKonsonant("vogelt", "vogel")).toBeTruthy()
        expect(addedKonsonant("vogel", "vogel")).toBeFalsy()
        expect(addedKonsonant("voel", "vogel")).toBeFalsy()
        expect(addedKonsonant("vogtel", "vogttel")).toBeFalsy()
    })

    test("extraVokal", () => {
        expect(addedVokal("vougel", "vogel")).toBeTruthy()
        expect(addedVokal("vogeil", "vogel")).toBeTruthy()
        expect(addedVokal("vogel", "vogel")).toBeFalsy()
        expect(addedVokal("vogel", "voel")).toBeFalsy()
        expect(addedVokal("vgel", "vogel")).toBeFalsy()
    })

    test("swappedCharacters", () => {
        expect(hasSwappedCharacters("vogeltraufe", "traufevogel")).toBeTruthy();
        expect(hasSwappedCharacters("bein", "bein")).toBeFalsy();
        expect(hasSwappedCharacters("gradeso", "gradesooo")).toBeFalsy();
        expect(hasSwappedCharacters("ukraine", "ukriane")).toBeTruthy();
    })

    test("isTypo", () => {
        expect(isTypo("Vogel", "Cogel")).toBeTruthy(); // C is one letter away from V on germna keyboard
        expect(isTypo("Feier", "Deier")).toBeTruthy(); // F is one letter away from D on germna keyboard
        expect(isTypo("Feier", "Heier")).toBeFalsy(); // F is two letters away from H on germna keyboard
        expect(isTypo("qeier", "weier")).toBeTruthy();
    })

    // test("kompetenzwert", () => {
    //     expect(getKompetenzWert(4, 3, 2))
    // })

})
