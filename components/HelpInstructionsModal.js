// HelpInstructionsModal.js
import React from 'react';
import { Modal, Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomModalBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    maxWidth: '800px',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: theme.shadows[24],
    padding: theme.spacing(4),
    overflowY: 'auto',
    borderRadius: theme.shape.borderRadius,
    border: `2px solid ${theme.palette.primary.main}`,
    background: theme.palette.background.default, 
}));

const CustomTypography = styled(Typography)({
    margin: '5px 0',
    fontWeight: 'bold',
});

const CustomList = styled(List)({
    marginBottom: '20px',
});

const CustomListItem = styled(ListItem)({
    paddingLeft: '0',
});

const CustomListItemText = styled(ListItemText)({
    '& .MuiListItemText-primary': {
        fontWeight: 'bold',
    },
    '& .MuiListItemText-secondary': {
        paddingLeft: '20px',
    },
});

const HelpInstructionsModal = ({ isOpen, onClose }) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <CustomModalBox>
                <Typography id="modal-modal-title" variant="h4" component="h2" gutterBottom color="primary">
                    Welcome to LinguaFluent AI
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Embark on a captivating journey to master new languages with LinguaFluent AI. Discover the essence of immersive learning through interactive role-play, personalized feedback, and a treasure trove of features designed to enrich your language skills.
                </Typography>
                
                <CustomTypography variant="h6">Quick Start Guide</CustomTypography>
                <CustomList>
                    <CustomListItem>
                        <CustomListItemText
                            primary="Select a Scenario"
                            secondary="Engage with diverse role-play scenarios for an interactive learning session. Personalize your journey with custom or random scenarios."
                        />
                    </CustomListItem>
                    <CustomListItem>
                        <CustomListItemText
                            primary="Customize Your Experience"
                            secondary="Tailor the settings to your preferences for a truly personalized learning adventure."
                        />
                    </CustomListItem>
                    <CustomListItem>
                        <CustomListItemText
                            primary="Dive into Conversations"
                            secondary="Utilize state-of-the-art AI to practice your language skills in real-time conversations."
                        />
                    </CustomListItem>
                </CustomList>

                <CustomTypography variant="h6">Enhance Your Learning</CustomTypography>
                <CustomList>
                    <CustomListItem>
                        <CustomListItemText
                            primary="Interactive Features"
                            secondary="From speech recognition to text-to-speech, our app is equipped with cutting-edge technology to support your learning."
                        />
                    </CustomListItem>
                    <CustomListItem>
                        <CustomListItemText
                            primary="Track and Review"
                            secondary="Monitor your progress with our Vocabulary Manager and Review Words features, utilizing spaced repetition for maximum retention."
                        />
                    </CustomListItem>
                </CustomList>

                <Typography variant="body1" gutterBottom>
                    Embrace the joy of learning with LinguaFluent AI. Our mission is to make your language learning journey as engaging, effective, and enjoyable as possible. Ready to explore? Let’s get started.
                </Typography>

                <Button variant="outlined" color="primary" onClick={onClose} sx={{ mt: 3 }}>
                    Close Guide
                </Button>
            </CustomModalBox>
        </Modal>
    );
};

export default HelpInstructionsModal;
