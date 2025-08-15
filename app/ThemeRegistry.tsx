"use client";

import { PropsWithChildren } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

export default function ThemeRegistry({ children }: PropsWithChildren) {
  const theme = createTheme({
    typography: { fontFamily: "Inter, system-ui, Arial, sans-serif" },
    palette: { mode: "light" },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
