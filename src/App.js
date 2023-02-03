import './App.scss';
import {useEffect, useMemo, useState} from "react";
import DataProvider, {countWords, getLeistungswert, getRelativerFehler, groupErrorsByOccurence} from "./dataProvider";
import {debounce} from "lodash";
import SpellCheckErrorTextElement from "./components/SpellCheckErrorTextElement";
import ErrorOccurencesBarChart from "./components/ErrorOccurencesBarChart";
import {getTextsWithOffsets} from "./helpers";
import ErrorsByGroupBarChart from "./components/ErrorsByGroupBarChart";
import {Checkbox, InputLabel, Select} from '@mui/material';
import {SaveText} from "./SaveText";
import {getKompetenzWert, getTotalNumErrors} from "./dataProvider";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";



function App() {

  const [spellCheckOutput, setSpellCheckOutput] = useState(null);
  const [spellCheckResults, setSpellCheckResults] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [klassenstufe, setKlassenstufe] = useState(21.5);
  const handleKlassenstufeChange = (event) => {
      setKlassenstufe(event.target.value);
  };
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
            {inputText && <SaveText text={inputText} />}
          <div className={"spacer"}/>
          <h2 className={"heading"}>Analyse zeigen<Checkbox value={showAnalysis} onChange={handleShowAnalysisChange} /></h2>
          <div style={{"display": showAnalysis ? "block" : "none"}} style={{height: "1rem"}} className={"loading-icon-container"}>
            {loading && (<div style={{"display": showAnalysis ? "block" : "none"}} className="dot-flashing"></div>)}
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
            <div className={"bar-chart-container"}>
                {spellCheckResults && (<>

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Klassenstufe</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={klassenstufe}
                            label="Age"
                            onChange={handleKlassenstufeChange}
                        >
                            <MenuItem value={21.5}>3. Klassenstufe (Mitte)</MenuItem>
                            <MenuItem value={16.4}>Ende der 3., Anfang der 4. Klassenstufe</MenuItem>
                            <MenuItem value={13.3}>4. Klassenstufe (Mitte)</MenuItem>
                            <MenuItem value={11.1}>Ende der 4., Anfang der 5. Klassenstufe</MenuItem>
                            <MenuItem value={12.2}>5. Klassenstufe (Mitte)</MenuItem>
                            <MenuItem value={11.5}>Ende der 5., Anfang der 6. Klassenstufe</MenuItem>
                            <MenuItem value={11.0}>6. Klassenstufe (Mitte)</MenuItem>
                            <MenuItem value={10.8}>Ende der 6., Anfang der 7. Klassenstufe</MenuItem>
                            <MenuItem value={10.7}>7. Klassenstufe (Mitte)</MenuItem>
                            <MenuItem value={10.7}>Ende der 7., Anfang der 8. Klassenstufe</MenuItem>
                            <MenuItem value={10.8}>8. Klassenstufe (Mitte)</MenuItem>
                            <MenuItem value={11}>Ende der 8., Anfang der 9. Klassenstufe</MenuItem>
                            <MenuItem value={11.2}>9. Klassenstufe (Mitte)</MenuItem>
                        </Select>
                        </FormControl>
                    <ul>
                        <li>Anzahl Wörter: {countWords(inputText)}</li>
                        <li>Anzahl Fehler in allen Gruppen (+ unbekannte Fehler): {getTotalNumErrors(spellCheckResults)}</li>
                        <li>Kompetenzwert: {getKompetenzWert(spellCheckResults)}</li>
                        <li>Tolerierte Fehlerzahl: {klassenstufe}</li>
                        <li>Relativer Fehler: {getRelativerFehler(spellCheckResults, countWords(inputText), klassenstufe)}</li>
                        <li>Leistungswert: {getLeistungswert(spellCheckResults, getRelativerFehler(spellCheckResults, countWords(inputText), klassenstufe))}</li>
                    </ul>
                    </>
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
