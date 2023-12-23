// SavedWordsDisplay.js
import React from 'react';
import { useState } from 'react';
import { List, ListItem, ListItemText, TextField, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const SavedWordsDisplay = ({ savedWords, onDeleteWord, onUpdateWord, onAddWord, language }) => {
    const [newWord, setNewWord] = useState('');
    const [newMeaning, setNewMeaning] = useState('');
    const [showAddWordFields, setShowAddWordFields] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [wordToEdit, setWordToEdit] = useState({ word: '', meaning: '' });
    
    const handleAddWord = () => {
        if (newWord && newMeaning) {
            onAddWord(
                newWord,
                newMeaning, 
                language,
                [],
                1,
                0,
                2.5,
                new Date()
            );
            setNewWord('');
            setNewMeaning('');
            setShowAddWordFields(false);
        }
    };

    const promptAndUpdateWord = (originalWord) => {
        const newWord = prompt(`Update word for "${originalWord}":`, originalWord);
        const newMeaning = prompt('Update meaning:', "");

        if (newWord && newMeaning) {
            onUpdateWord(originalWord, newWord, newMeaning);
        }
    };

    const handleEditWord = () => {
        onUpdateWord(wordToEdit.originalWord, wordToEdit.word, wordToEdit.meaning);
        setEditDialogOpen(false);
    };

    const openEditDialog = (word, meaning) => {
        setWordToEdit({ originalWord: word, word: word, meaning: meaning });
        setEditDialogOpen(true);
    };

    return (
        <>
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Word</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Word"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={wordToEdit.word}
                        onChange={(e) => setWordToEdit({ ...wordToEdit, word: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Meaning"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={wordToEdit.meaning}
                        onChange={(e) => setWordToEdit({ ...wordToEdit, meaning: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleEditWord}>Save</Button>
                </DialogActions>
            </Dialog>
            {!showAddWordFields && (
                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setShowAddWordFields(true)}>
                    Add New Word
                </Button>
            )}
            
            {showAddWordFields && (
                <div style={{ marginBottom: '10px' }}>
                    <TextField
                        label="New Word"
                        value={newWord}
                        onChange={(e) => setNewWord(e.target.value)}
                        size="small"
                        style={{ marginRight: '10px' }}
                    />
                    <TextField
                        label="Meaning"
                        value={newMeaning}
                        onChange={(e) => setNewMeaning(e.target.value)}
                        size="small"
                        style={{ marginRight: '10px' }}
                    />
                    <Button variant="outlined" onClick={handleAddWord}>
                        <AddIcon />
                    </Button>
                </div>
            )}
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {savedWords.map((item, index) => (
                    <ListItem key={index} secondaryAction={
                        <>
                            <IconButton edge="end" onClick={() => openEditDialog(item.word, item.meaning)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" onClick={() => onDeleteWord(item.word)}>
                                <DeleteIcon />
                            </IconButton>
                        </>
                    }>
                        <ListItemText 
                            primary={`Word: ${item.word}`} 
                            secondary={
                                `Meaning: ${item.meaning}, ` +
                                `Interval: ${item.interval}, ` +
                                `Repetition: ${item.repetition}, ` +
                                `Ease Factor: ${item.easeFactor.toFixed(2)}, ` +
                                `Next Review Date: ${item.nextReviewDate}` +
                                `Language: ${item.language}, ` +
                                `Tags: ${item.tags}`
                            }  
                        />
                    </ListItem>
                ))}
            </List>
        </>  
    );
};

export default SavedWordsDisplay;
