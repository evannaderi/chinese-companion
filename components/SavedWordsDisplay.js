// SavedWordsDisplay.js
import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const SavedWordsDisplay = ({ savedWords, onDeleteWord, onUpdateWord }) => {
    // Function to handle update - you might want to create a modal or prompt for the new meaning
    const promptAndUpdateWord = (word) => {
        const newMeaning = prompt(`Update meaning for "${word}":`, "");
        if (newMeaning) {
            onUpdateWord(word, newMeaning);
        }
    };

    return (
        <List>
            {savedWords.map((item, index) => (
                <ListItem key={index} secondaryAction={
                    <>
                        <IconButton edge="end" onClick={() => promptAndUpdateWord(item.Word)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton edge="end" onClick={() => onDeleteWord(item.Word)}>
                            <DeleteIcon />
                        </IconButton>
                    </>
                }>
                    <ListItemText 
                        primary={`Word: ${item.Word}`} 
                        secondary={
                            `Meaning: ${item.Meaning}, ` +
                            `Interval: ${item.interval}, ` +
                            `Repetition: ${item.repetition}, ` +
                            `Ease Factor: ${item.easeFactor.toFixed(2)}, ` +
                            `Next Review Date: ${item.nextReviewDate}`
                        }  
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default SavedWordsDisplay;
