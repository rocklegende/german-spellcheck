import {useState} from "react";

const SpellCheckErrorTextElement = ({spellCheckError, text}) => {

    const [showErrorPopup, setShowErrorPopup] = useState(false)
    const markColor = spellCheckError.category.markColor ? spellCheckError.category.markColor : "yellow";
    return (
        <div
            style={{display: "inline", position: "relative", overflowX: "visible"}}>
            <mark
                tabIndex={0}
                style={{backgroundColor: markColor}}
                className={"mark"}
                onMouseEnter={() => setShowErrorPopup(true)}
                onMouseLeave={() => setShowErrorPopup(false)}
                onFocus={() => setShowErrorPopup(true)}
                onBlur={() => setShowErrorPopup(false)}
            >
                {text}
            </mark>
            {showErrorPopup && (
                <div className={"spell-check-inline-info"}>
                    <span>{spellCheckError.message} </span>
                    <br/>
                    <b>{spellCheckError.replacements.length > 0 ? "-> " + spellCheckError.replacements[0].value : ""}</b>
                    <p style={{color: "gray", fontSize: "0.9rem"}}><em>Kategorie: {spellCheckError.category.title}</em></p>
                </div>
            )}
        </div>

    )
}

export default SpellCheckErrorTextElement;