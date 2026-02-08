import React from 'react';
import Link from 'next/link';
import './Header.css';
import {
  AppBar,
  Toolbar,
  Typography,
  Icon,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import MobileDrawer from './MobileDrawer';
import DesktopMenu from './DesktopMenu';

const menuItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/products' },
  { label: 'Simulador', href: '/simulator' },
  { label: 'Onboarding', href: '/onboarding' },
];

// Tema por defecto para usar cuando el ThemeProvider no está disponible
const defaultTheme = createTheme({
  palette: {
    background: { default: '#ffffea' },
    primary: { main: '#00cecb', light: '#00cecb' },
    text: { primary: '#1a1a1a' },
    divider: '#d8d8d8',
  },
});

export default function Header() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar
        component="header"
        position="fixed"
        elevation={0}
        className="header-appbar"
      >
        <Toolbar className="header-toolbar">
          <Typography
            variant="h6"
            component={Link}
            href="/"
            className="header-logo"
          >
            <Icon
              component={SavingsIcon}
              className="header-logo-icon"
            />
            <Typography
              component="span"
              className="header-logo-text"
            >
              Ahorro Digital
            </Typography>
          </Typography>

          {/* Menú desktop - componente cliente para detección de ruta activa */}
          <DesktopMenu />

          {/* Drawer móvil - componente cliente */}
          <MobileDrawer menuItems={menuItems} />
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}



