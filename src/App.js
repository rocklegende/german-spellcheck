import './App.scss';
import {useEffect, useMemo, useState} from "react";
import DataProvider, {groupErrorsByOccurence} from "./dataProvider";
import {debounce} from "lodash";
import SpellCheckErrorTextElement from "./components/SpellCheckErrorTextElement";
import BarChart from "./components/BarChart";
import {getTextsWithOffsets} from "./helpers";




function App() {

  const [spellCheckOutput, setSpellCheckOutput] = useState(null);
  const [spellCheckResults, setSpellCheckResults] = useState(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false)

  const getElements = (text, spellCheckResults) => {
    const textWithOffsets = getTextsWithOffsets(text);
    const findSpellCheckErrorAtPosition = (textOffset) => {
      return spellCheckResults.matches.find(match => match.offset === textOffset);
    }

    return textWithOffsets.map(textWithOffset => {
      const word = textWithOffset[0];
      const offset = textWithOffset[1];
      const spellCheckError = findSpellCheckErrorAtPosition(offset);
      if (!spellCheckError) {
        // can be whitespace character, therefore choose pre-line here
        return (<span style={{whiteSpace: "pre-line"}}>{word}</span>)
      }
      return <SpellCheckErrorTextElement
          key={offset}
          spellCheckError={spellCheckError}
          onSpellCheckErrorCategoriesChange={newCategories => {
              const newBla = {...spellCheckResults};
              console.log(newBla);
              console.log(spellCheckError);
              console.log(newCategories);
              const blakeks = newBla.matches.find(match => match.offset === offset);
              blakeks.categories = newCategories;
              newBla.statistics = groupErrorsByOccurence(newBla.matches);
              console.log(newBla);
              setSpellCheckResults(newBla);
              setSpellCheckOutput(getElements(inputText, newBla))
            }
          }
          text={word}
      />
    })
  }

  const dataProvider = new DataProvider();

  const getSpellCheckResults = async () => {
      if (!inputText) {
        setSpellCheckOutput(null)
        setSpellCheckResults(null)
        return;
      }

      setLoading(true);
      try {
        const results = await dataProvider.getSpellCheckResults(inputText);
        setSpellCheckOutput(getElements(inputText, results));
        setSpellCheckResults(results);
        setLoading(false);
        return results;
      } catch(e) {
        setLoading(false);
        console.error(e)
      }

  }

  const handleChange = (event) => {
      setInputText(event.target.value);
  }

  useEffect(() => {
      getSpellCheckResults()
  }, [inputText])

  const debouncedChangeHandler = useMemo(
      () => debounce(handleChange, 500)
  , []);

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    }
  }, []);

  return (
    <div className="App">
      <main>
        <div className={"input-fields"}>
          <div className={"spacer"} />
          <textarea placeholder={"Hier Text eingeben.."} className="input-textfield textfield box-shadow" onChange={debouncedChangeHandler} />
          <div className={"spacer"}/>
          <h2 className={"heading"}>Analyse</h2>
          <div style={{height: "1rem"}} className={"loading-icon-container"}>
            {loading && (<div className="dot-flashing"></div>)}
          </div>
          <div className="textfield">{spellCheckOutput}</div>
        </div>
        <div className={"spacer-small"} />
        <div className={"bar-chart-container"}>
          {spellCheckResults && (
              <BarChart spellCheckResults={spellCheckResults} />
          )}
        </div>
        <div className={"spacer"} />
      </main>

      <footer />
    </div>
  );
}

export default App;
