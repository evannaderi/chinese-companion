import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const CustomButton = styled(Button)(({ theme, selected }) => ({
    // Regular button styles
    backgroundColor: 'white',
    color: '#ff7700',
    margin: '5px',
    border: '1px solid #ff7700',

    // Styles for the selected state
    ...(selected && {
        backgroundColor: '#efd28d',
        color: 'black',
    }),

    // Hover styles
    '&:hover': {
        backgroundColor: '#ffd1a9',
        color: 'black',
    },
}));

export default CustomButton;
