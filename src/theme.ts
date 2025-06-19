import { createTheme } from "@mui/material/styles";
import { colors } from "./styles/variables";

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
    },
    secondary: {
      main: colors.secondary,
    },
    background: {
      default: colors.background,
    },
    text: {
      primary: colors.text,
    },
    error: {
      main: colors.error,
    },
    success: {
      main: colors.success,
    },
    warning: {
      main: colors.warning,
    },
  },
});
