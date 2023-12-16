import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const SavedWordsDisplay = ({ savedWords }) => {
    return (
        <List>
            {savedWords.map((item, index) => (
                <ListItem key={index}>
                    <ListItemText 
                        primary={`Word: ${item.Word}`} 
                        secondary={`Meaning: ${item.Meaning}`} 
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default SavedWordsDisplay;
