import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
          main: '#004777', // Indigo Dye
        },
        secondary: {
          main: '#00afb5', // Verdigris
        },
        error: {
          main: '#a30000', // Turkey Red
        },
        warning: {
          main: '#ff7700', // Safety Orange
        },
        info: {
          main: '#efd28d', // Peach Yellow
        },
      },
});

export default theme;
