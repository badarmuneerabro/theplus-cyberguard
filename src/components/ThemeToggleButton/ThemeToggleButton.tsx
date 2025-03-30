import IconButton from "@mui/material/IconButton";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import React, { useContext, createContext } from "react";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useMediaQuery } from "@mui/material";

// Provide a default context if not passed
const DefaultColorModeContext = createContext({
  toggleColorMode: () => {
    console.warn('Color mode toggle not implemented');
  }
});

export type ThemeToggleButtonProps = {
    ColorModeContext?: React.Context<{ toggleColorMode: () => void }>;
}

const ThemeToggleButton = ({ 
  ColorModeContext = DefaultColorModeContext 
}: ThemeToggleButtonProps) => {
    const mobileCheck = useMediaQuery('(min-width: 500px)');
    const theme = useTheme();
    
    // Use the provided context or fall back to default
    const colorMode = useContext(ColorModeContext);

    const handleToggleMode = () => {
        colorMode.toggleColorMode();
    };

    return (
        <>
            {mobileCheck && (
                <Typography variant="body2" sx={{ mr: 1 }}>
                    {theme.palette.mode} mode
                </Typography>
            )}
            <IconButton 
                sx={{ 
                    mr: 1, 
                    color: 'inherit',
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                }} 
                title={`Switch to ${theme.palette.mode === 'dark' ? 'light' : 'dark'} mode`}
                aria-label={`${theme.palette.mode} mode toggle`} 
                onClick={handleToggleMode}
            >
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </>
    );
};

export default ThemeToggleButton;