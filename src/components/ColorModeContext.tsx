import React, { createContext, useContext, useState, useMemo } from "react";

// Define the context and its types
interface ColorModeContextType {
  toggleColorMode: () => void;
}

// Create the context with a default value (the function will be empty initially)
const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
});

// Custom provider to manage color mode state
export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  // Function to toggle between light and dark mode
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      {children}
    </ColorModeContext.Provider>
  );
};

// Custom hook to use the context
export const useColorMode = () => useContext(ColorModeContext);

export default ColorModeContext;