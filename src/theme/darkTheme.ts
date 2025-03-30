import { ThemeOptions } from "@mui/material";

const darkTheme: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#bb86fc',  // A soft purple, which is often pleasant in dark mode
        },
        secondary: {
            main: '#03dac6',  // A teal color that contrasts nicely with the purple
        },
        background: {
            default: '#121212',  // A deep gray that reduces light emission on screens
            paper: '#1e1e1e'     // Slightly lighter gray for elements like cards and dialogs
        },
        text: {
            primary: '#ffffff',  // White for primary text to ensure readability
            secondary: '#b3b3b3' // Light gray for secondary text, less prominent
        }
    }
}

export default darkTheme;
