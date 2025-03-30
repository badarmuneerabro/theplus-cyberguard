import { Box } from "@mui/material";
import { PropsWithChildren } from "react";
import { useState, useEffect } from "react";
import Footer from "../common/Footer/Footer";
import SideMenu from "../common/SideMenu";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);  // Initially set to false to hide the menu on mobile by default
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close menu on mobile
      if (window.innerWidth < 768) {
        setMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const drawerWidthOpen = isMobile ? 0 : 150;  // Width when drawer is open (set for both mobile and desktop)
  const drawerWidthClosed = isMobile ? 0 : 60;  // Width when drawer is closed (set to 0 on mobile)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* SideMenu only visible on larger screens */}
      {!isMobile && (
        <SideMenu 
          onToggle={(open: boolean) => setMenuOpen(open)}
          drawerWidthOpen={drawerWidthOpen}
          drawerWidthClosed={drawerWidthClosed}
          isMobile={isMobile}
        />
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          transition: 'all 0.3s ease',
          //
          width: `calc(100% - ${menuOpen ? drawerWidthOpen : drawerWidthClosed}px)`,  // Adjust the width calculation
        }}
      >
        {children}
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
