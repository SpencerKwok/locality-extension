import ReactDOM from "react-dom";
import App from "./injection/App";
import "bootstrap/dist/css/bootstrap.min.css";

import { GetRpcClient } from "./common/RpcClient";
import styles from "./injection.module.css";

import type { FC } from "react";
import type { AppProps } from "./injection/App";

let open = true;
let mouseDown = false;
let fixHorizontal = false;
let fixVertical = false;
const dragElement = (element: HTMLDivElement) => {
  let pos1 = 0;
  let pos2 = 0;
  let pos3 = 0;
  let pos4 = 0;

  element.onmousedown = dragMouseDown;
  function dragMouseDown(e: any) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;

    if (e.button === 0) {
      mouseDown = true;
    }
  }

  function elementDrag(e: any) {
    e = e || window.event;
    e.preventDefault();

    if (e.button === 0 && mouseDown) {
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // set the element's new position:
      if (!fixHorizontal) {
        element.style.left = element.offsetLeft - pos1 + "px";
      }
      if (!fixVertical) {
        element.style.top = element.offsetTop - pos2 + "px";
      }
    }
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    mouseDown = false;
  }

  return element;
};

const app = dragElement(document.createElement("div"));
app.className = styles["locality-window"];
app.id = "locality";
document.body.insertBefore(app, document.body.firstChild);

const onOpen = () => {
  open = true;
  fixHorizontal = false;
  app.style.left = "";
  app.style.top = "60px";
  app.style.right = "20px";
  app.className = styles["locality-window"];
};

const onClose = () => {
  open = false;
  fixHorizontal = true;
  app.style.left = "";
  app.style.top = "185px";
  app.style.right = "0px";
  app.className = styles["locality-window-collapsed"];
};

const onResize = () => {
  if (open) {
    app.style.left = "";
    app.style.top = "60px";
    app.style.right = "20px";
  } else {
    app.style.left = "";
    app.style.top = "185px";
    app.style.right = "0px";
  }
};

const AppWrapper: FC<AppProps> = (props) => {
  return ReactDOM.createPortal(<App {...props} />, app);
};

chrome.runtime.sendMessage(
  { message: "get", keys: ["id", "token"] },
  (values: any) => {
    const [cached_id, cached_token] = values;
    const possibleQueries = window.location.search.match(
      /(?<=(q|k|query|redirectQuery)=)[^&]*/g
    );
    if (possibleQueries) {
      const id = typeof cached_id === "number" ? cached_id : -1;
      const token = cached_token ? cached_token : "";
      const query = decodeURIComponent(possibleQueries[0]).replace(/\+/g, " ");
      GetRpcClient.getInstance()
        .call("Search", `/search?q=${query}`, {
          id,
          token,
        })
        .then(({ hits }) => {
          if (hits.length > 0)
            ReactDOM.render(
              <AppWrapper
                id={id}
                token={token}
                initialHits={hits}
                query={query}
                onOpen={onOpen}
                onClose={onClose}
              />,
              app
            );
        });
    }
  }
);

window.addEventListener("resize", onResize);
window.addEventListener("unload", () => {
  window.removeEventListener("resize", onResize);
});
