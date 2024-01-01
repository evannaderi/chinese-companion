// SavedWordsDisplay.js
import React from 'react';
import { useState } from 'react';
import { List, ListItem, ListItemText, TextField, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography,  Select, MenuItem} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const SavedWordsDisplay = ({ savedWords, onDeleteWord, onUpdateWord, onAddWord, language }) => {
    const [newWord, setNewWord] = useState('');
    const [newMeaning, setNewMeaning] = useState('');
    const [showAddWordFields, setShowAddWordFields] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [wordToEdit, setWordToEdit] = useState({ word: '', meaning: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese'];
    

    
    
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

    const filteredWords = savedWords.filter(item =>
        (item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedLanguage === '' || item.language === selectedLanguage)
    );    

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
            <TextField
                label="Search Words"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                style={{ marginBottom: '10px' }}
            />
            <Select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                displayEmpty
                style={{ marginBottom: '10px' }}
            >
                <MenuItem value="">All Languages</MenuItem>
                {languages.map((language, index) => (
                    <MenuItem key={index} value={language}>{language}</MenuItem>
                ))}
            </Select>
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
                {filteredWords.length > 0 ? (
                    filteredWords.map((item, index) => (
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
                    ))
                ) : (
                    <Typography>No words found matching the search criteria.</Typography>
                )}
            </List>
        </>  
    );
};

export default SavedWordsDisplay;
