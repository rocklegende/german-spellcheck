import {useState} from "react";

import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import {spellCheckErrors} from "../dataProvider";
import {Button} from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

const spellCheckErrorIds = Object.keys(spellCheckErrors);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            minWidth: 250,
        },
    },
};

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const SpellCheckErrorTextElement = ({spellCheckError, text, onSpellCheckErrorCategoriesChange}) => {

    const theme = useTheme();
    let selectedCategories;
    if (!spellCheckError) {
        selectedCategories = []
    } else {
        selectedCategories = spellCheckError.categories;
    }

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        onSpellCheckErrorCategoriesChange(typeof value === 'string' ? value.split(',') : value)
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    let markColor = "";
    console.log(spellCheckError.categories);
    if (spellCheckError.categories.length > 0) {
        markColor = spellCheckErrors[spellCheckError.categories[0]].markColor
    }

    return (
        <div
            style={{display: "inline", position: "relative", overflowX: "visible"}}>
            <span
                tabIndex={0}
                style={{backgroundColor: markColor ? markColor: "transparent", whiteSpace: "pre-line"}}
                className={"mark"}
                onClick={(event) => setAnchorEl(event.target)}
            >
                {text}
            </span>
            <Popover
                id={id}
                sx={{minWidth: 250, maxWidth: 400}}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2 }}>
                    {spellCheckError.replacements &&
                        <>
                            {spellCheckError.message}
                            <br/>
                            <b>{spellCheckError.replacements.length > 0 ? "-> " + spellCheckError.replacements[0].value : ""}
                            </b>
                        </>
                    }
                    {spellCheckError.hasOwnProperty("isNew") && <b>{spellCheckError.word}</b>}
                    <FormControl sx={{ mt: 2, width: "250px" }}>
                        <InputLabel id="demo-multiple-chip-label">Oldenburg Fehler</InputLabel>
                        <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={selectedCategories}
                            onChange={handleChange}
                            label="Oldenburg Fehler"
                            MenuProps={MenuProps}
                            input={<OutlinedInput id="select-multiple-chip" label="Oldenburg Fehler" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={spellCheckErrors[value].title} />
                                    ))}
                                </Box>
                            )}
                        >
                            {spellCheckErrorIds.map((id) => (
                                <MenuItem
                                    key={id}
                                    value={id}
                                    style={getStyles(id, selectedCategories, theme)}
                                >
                                    <Checkbox checked={selectedCategories.indexOf(id) > -1} />
                                    <ListItemText primary={spellCheckErrors[id].title} />
                                </MenuItem>

                            ))}
                        </Select>
                    </FormControl>
                </Typography>
            </Popover>
        </div>

    )
}

export default SpellCheckErrorTextElement;