import { ThemeOptions } from "@mui/material";

const lightTheme: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d8',  // A nice shade of blue
        },
        secondary: {
            main: '#dc004e',  // A vibrant shade of pink/red
        },
        background: {
            default: '#ffffff',  // Pure white background
            paper: '#f4f4f4'     // Light grey for elements like cards and dialogs
        },
        text: {
            primary: '#212129',  // Very dark grey, better for reading
            secondary: '#757575' // Medium grey for less emphasis
        }
    }
}

export default lightTheme;
