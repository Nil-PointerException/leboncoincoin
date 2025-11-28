import { createTheme } from '@mui/material/styles'

const duckYellow = {
  main: '#FFD700',
  light: '#FFE063',
  dark: '#E6C000',
  contrastText: '#111827',
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: duckYellow,
    secondary: {
      main: '#6B7280',
      light: '#A1A5B0',
      dark: '#4B5563',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
    divider: '#E5E7EB',
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
  },
  typography: {
    fontFamily: ['"Inter"', '"Plus Jakarta Sans"', 'sans-serif'].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.75rem',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.2rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      fontSize: '0.9375rem',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.08)',
    '0px 8px 16px rgba(0, 0, 0, 0.1)',
    '0px 12px 24px rgba(0, 0, 0, 0.12)',
    '0px 16px 32px rgba(0, 0, 0, 0.14)',
    '0px 20px 40px rgba(0, 0, 0, 0.16)',
    '0px 24px 48px rgba(0, 0, 0, 0.18)',
    '0px 28px 56px rgba(0, 0, 0, 0.2)',
    '0px 32px 64px rgba(0, 0, 0, 0.22)',
    '0px 36px 72px rgba(0, 0, 0, 0.24)',
    '0px 40px 80px rgba(0, 0, 0, 0.26)',
    '0px 44px 88px rgba(0, 0, 0, 0.28)',
    '0px 48px 96px rgba(0, 0, 0, 0.3)',
    '0px 52px 104px rgba(0, 0, 0, 0.32)',
    '0px 56px 112px rgba(0, 0, 0, 0.34)',
    '0px 60px 120px rgba(0, 0, 0, 0.36)',
    '0px 64px 128px rgba(0, 0, 0, 0.38)',
    '0px 68px 136px rgba(0, 0, 0, 0.4)',
    '0px 72px 144px rgba(0, 0, 0, 0.42)',
    '0px 76px 152px rgba(0, 0, 0, 0.44)',
    '0px 80px 160px rgba(0, 0, 0, 0.46)',
    '0px 84px 168px rgba(0, 0, 0, 0.48)',
    '0px 88px 176px rgba(0, 0, 0, 0.5)',
    '0px 92px 184px rgba(0, 0, 0, 0.52)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F8F9FA',
          color: '#111827',
          fontFamily: '"Inter","Plus Jakarta Sans",sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          padding: '10px 26px',
          fontSize: '0.95rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 6px 20px rgba(17, 24, 39, 0.1)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 8px 24px rgba(17, 24, 39, 0.12)',
          },
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.8125rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #F3F4F6',
          boxShadow: '0 2px 4px rgba(15, 23, 42, 0.02)',
          transition: 'all 0.25s ease',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '20px',
          '&:last-child': {
            paddingBottom: '20px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
          height: 28,
        },
        filled: {
          backgroundColor: '#F3F4F6',
          '&:hover': {
            backgroundColor: '#E5E7EB',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            boxShadow: 'none',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#D1D5DB',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: duckYellow.main,
              borderWidth: 2,
              boxShadow: '0 0 0 4px rgba(255, 215, 0, 0.2)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)',
        },
        elevation2: {
          boxShadow: '0 8px 30px rgba(15, 23, 42, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 0px rgba(15, 23, 42, 0.08)',
          backgroundColor: '#FFFFFF',
          color: '#111827',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(17, 24, 39, 0.04)',
            transform: 'scale(1.03)',
          },
        },
      },
    },
  },
})

export default theme
