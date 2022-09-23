import './App.scss';
import {useEffect, useMemo, useState} from "react";
import DataProvider, {groupErrorsByOccurence} from "./dataProvider";
import {debounce} from "lodash";
import SpellCheckErrorTextElement from "./components/SpellCheckErrorTextElement";
import ErrorOccurencesBarChart from "./components/ErrorOccurencesBarChart";
import {getTextsWithOffsets} from "./helpers";
import ErrorsByGroupBarChart from "./components/ErrorsByGroupBarChart";
import { Checkbox } from '@mui/material';




function App() {

  const [spellCheckOutput, setSpellCheckOutput] = useState(null);
  const [spellCheckResults, setSpellCheckResults] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
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
      let spellCheckError = findSpellCheckErrorAtPosition(offset);
      if (!spellCheckError) {
        spellCheckError = {
            word,
            offset,
            categories: [],
            isNew: true
        }
      }
      return <SpellCheckErrorTextElement
          key={offset}
          spellCheckError={spellCheckError}
          onSpellCheckErrorCategoriesChange={newCategories => {
              const newBla = {...spellCheckResults};

              let blakeks;
              if (spellCheckError.hasOwnProperty("isNew")) {
                  blakeks = spellCheckError;
                  newBla.matches.push(blakeks);
              } else {
                  blakeks = newBla.matches.find(match => match.offset === offset);
              }
              blakeks.categories = newCategories;

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
  
  const handleShowAnalysisChange = (event) => {
      setShowAnalysis(event.target.checked);
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
          <h2 className={"heading"}>Analyse<Checkbox value={showAnalysis} onChange={handleShowAnalysisChange} /></h2>
          <div style={{"display": showAnalysis ? "block" : "none"}} style={{height: "1rem"}} className={"loading-icon-container"}>
            {loading && (<div className="dot-flashing"></div>)}
          </div>
          <div style={{"display": showAnalysis ? "block" : "none"}} className="textfield">{spellCheckOutput}</div>
        </div>
        <div className={"spacer-small"} />
        
        
        <div class="analysis-results" style={{"display": showAnalysis ? "block" : "none"}}>
          <div className={"bar-chart-container"}>
          {spellCheckResults && (
              <ErrorOccurencesBarChart spellCheckResults={spellCheckResults} />
          )}
          </div>
          <div className={"spacer-small"} />
          <div className={"bar-chart-container"}>
              {spellCheckResults && (
                  <ErrorsByGroupBarChart spellCheckResults={spellCheckResults} />
              )}
          </div>
        </div>

        <div className={"spacer"} />
      </main>

      <footer />
    </div>
  );
}

export default App;
