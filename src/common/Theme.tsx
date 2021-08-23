import { createContext } from "react";

export interface ThemeObject {
  color: {
    background: {
      light: string;
      dark: string;
    };
    hover: {
      light: string;
      dark: string;
    };
    text: {
      light: string;
      dark: string;
    };
  };
}

export const DefaultTheme: ThemeObject = {
  color: {
    background: {
      light: "#FBECCF",
      dark: "#F3D2C1",
    },
    hover: {
      light: "#EEEEEE",
      dark: "linear-gradient(0deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.28)), #112378;",
    },
    text: {
      light: "#FFFFFF",
      dark: "#112378",
    },
  },
};

const ThemeContext = createContext<ThemeObject>(DefaultTheme);
export default ThemeContext;
