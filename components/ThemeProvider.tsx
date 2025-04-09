"use client"

import { createContext, useContext, useState, useMemo } from "react"
import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import type { PaletteMode } from "@mui/material"

const ThemeContext = createContext({
  toggleColorMode: () => {},
  mode: "dark",
})

export const useThemeContext = () => useContext(ThemeContext)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>("dark")

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
      },
      mode,
    }),
    [mode],
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#FFD700",
          },
          secondary: {
            main: "#ffffff",
          },
          background: {
            default: "#000000",
            paper: "rgba(0, 0, 0, 0.5)",
          },
        },
        typography: {
          fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
          h1: {
            fontWeight: 700,
          },
          h6: {
            fontWeight: 500,
          },
          body1: {
            fontWeight: 400,
          },
          body2: {
            fontWeight: 400,
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                boxShadow: "none",
              },
            },
          },
        },
      }),
    [mode],
  )

  return (
    <ThemeContext.Provider value={colorMode}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  )
}
