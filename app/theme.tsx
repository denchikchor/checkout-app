"use client";
import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: { fontFamily: "Inter, system-ui, Arial, sans-serif" },
  palette: { mode: "light" },
  components: { MuiContainer: { defaultProps: { maxWidth: "lg" } } },
});

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
