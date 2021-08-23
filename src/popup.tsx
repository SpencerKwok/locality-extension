import React from "react";
import ReactDOM from "react-dom";
import App from "./popup/App";
import ThemeContext, { DefaultTheme } from "./common/Theme";

ReactDOM.render(
  <React.StrictMode>
    <ThemeContext.Provider value={DefaultTheme}>
      <App />
    </ThemeContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
