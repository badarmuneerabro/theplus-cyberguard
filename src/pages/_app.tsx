import dynamic from 'next/dynamic';
import { AppProps } from "next/app";
import React, { useMemo, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, useMediaQuery } from "@mui/material";
import darkTheme from "@/theme/darkTheme";
import lightTheme from "@/theme/lightTheme";
import { setupAxiosInterceptors } from '@/config/axiosConfig';

// Import Layout after interceptor setup
import Layout from "@/components/Layout";

// Context for managing the color mode (dark/light theme)
export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

// Use dynamic imports with loading components to prevent hydration issues
const Header = dynamic(() => import('@/components/common/Header'), { 
  loading: () => null,
  ssr: true
});

const SideMenu = dynamic(() => import('@/components/common/SideMenu'), { 
  loading: () => null,
  ssr: true
});

// Add mobile navigation component
const MobileNavigation = dynamic(() => import('@/components/common/MobileNavigation'), {
  loading: () => null,
  ssr: false // Mobile navigation should be client-side only
});

// Define a custom type for pageProps to handle sessions and other properties
interface CustomPageProps {
  isDashboard?: boolean;
}

const App = ({
  Component,
  pageProps,
}: AppProps<CustomPageProps>) => {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [isMounted, setIsMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Use this to detect mobile screens
  const isMobile = useMediaQuery('(max-width:600px)');

  // Ensure component is mounted client-side before rendering
  useEffect(() => {
    setIsMounted(true);
    setupAxiosInterceptors();
  }, []);

  // Function to toggle between light and dark mode
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  // Handle drawer toggle
  const handleDrawerToggle = (open: boolean) => {
    setDrawerOpen(open);
  };

  // Memoize the themes to optimize performance
  const darkThemeChosen = useMemo(() => createTheme(darkTheme), []);
  const lightThemeChosen = useMemo(() => createTheme(lightTheme), []);

  // Determine if the current page is a dashboard page
  const isDashboardPage = pageProps.isDashboard || 
    ["Dashboard", "DataEntry", "Threats", "NetworkTraffic", "Incident", "ProfilePage", "Reports"]
    .includes(Component.name);

  // Prevent rendering on server to avoid hydration mismatches
  if (!isMounted) {
    return null;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={mode === "dark" ? darkThemeChosen : lightThemeChosen}>
        <CssBaseline />
        {isDashboardPage ? (
          <>
            <Header ColorModeContext={ColorModeContext} />
            
            {/* Show SideMenu on desktop */}
            {!isMobile && (
              <SideMenu 
                drawerWidthOpen={240} 
                drawerWidthClosed={70} 
                onToggle={handleDrawerToggle} 
              />
            )}
            
            {/* Show Mobile Navigation on mobile */}
            {isMobile && <MobileNavigation isOpen={false} onToggle={function (open: boolean): void {
              throw new Error('Function not implemented.');
            } } />}
            
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </>
        ) : (
          <Component {...pageProps} />
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;