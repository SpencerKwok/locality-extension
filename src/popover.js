// popover.js

import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Store } from "webext-redux";

import App from "./App";

const store = new Store();

// wait for the store to connect to the background page
store.ready().then(() => {
  // The store implements the same interface as Redux's store
  // so you can use tools like `react-redux` no problem!
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("app")
  );
});
