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

// Search
if (
  window.location.host.match(/www\.amazon\.c(a|om)/) ||
  window.location.host.match(/www\.etsy\.com/) ||
  window.location.host.match(/www\.walmart\.c(a|om)/)
) {
  chrome.runtime.sendMessage(
    { message: "get", keys: ["email", "token"] },
    (values: any) => {
      const [cached_email, cached_token] = values;
      const possibleQueries = window.location.search.match(
        /(?<=(q|k|query|redirectQuery)=)[^&]*/g
      );
      if (possibleQueries) {
        const email = typeof cached_email === "string" ? cached_email : "";
        const token = cached_token ? cached_token : "";
        const query = decodeURIComponent(possibleQueries[0]).replace(
          /\+/g,
          " "
        );
        GetRpcClient.getInstance()
          .call("Search", `/search?q=${query}`, {
            email,
            token,
          })
          .then(({ hits }) => {
            if (hits.length > 0)
              ReactDOM.render(
                <AppWrapper
                  email={email}
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
}

// Coupon
else {
  const hostname = "https://locality-ui-dev.herokuapp.com";
  fetch(`${hostname}/api/extension/checkout/get`)
    .then((res) => res.json())
    .then(
      ({
        checkoutUrl,
        input,
        submit,
        total,
      }: {
        checkoutUrl: string;
        input: Array<string>;
        submit: Array<string>;
        total: Array<string>;
      }) => {
        // Check if we are on the checkout URL
        const re = new RegExp(checkoutUrl);
        if (re.test(window.location.href)) {
          // Click through prefix elements to reveal input, submit, and total elements
          [input, submit, total].forEach((x) => {
            x.slice(0, x.length - 1).forEach((selector) => {
              const rawElem = document.querySelector(selector);
              if (rawElem) {
                const elem = rawElem as HTMLButtonElement;
                elem.click && elem.click();
              }
            });
          });

          // Check if input, submit, and total elements all exist
          const rawInput = document.querySelector(input[input.length - 1]);
          const rawSubmit = document.querySelector(submit[submit.length - 1]);
          const rawTotal = document.querySelector(total[total.length - 1]);
          if (rawInput && rawSubmit && rawTotal) {
            const inputElem = rawInput as HTMLInputElement;
            const submitElem = rawSubmit as HTMLButtonElement;
            const totalElem = rawTotal as HTMLDivElement | HTMLSpanElement;

            // Get coupons
            fetch(`${hostname}/api/extension/coupons/get`)
              .then((res) => res.json())
              .then(
                async ({ coupons }: { coupons: Array<{ coupon: string }> }) => {
                  // Get previous total
                  const previousTotal = parseFloat(
                    totalElem.innerText.replace(/[^0-9.]/gi, "")
                  );

                  // Setup event handler to handle total amount change
                  let minimumTotal = previousTotal;
                  const totalChangeEventListener = () => {
                    const newRawTotal = document.querySelector(
                      total[total.length - 1]
                    );
                    const newTotalElem = newRawTotal as
                      | HTMLDivElement
                      | HTMLSpanElement;
                    const newTotal = parseFloat(
                      newTotalElem.innerText.replace(/[^0-9.]/gi, "")
                    );
                    minimumTotal = Math.min(minimumTotal, newTotal);
                  };
                  document.addEventListener("change", totalChangeEventListener);

                  // Apply all coupons
                  for (let i = 0; i < coupons.length; ++i) {
                    const { coupon } = coupons[i];
                    inputElem.value = coupon;
                    submitElem.disabled = false;
                    submitElem.click && submitElem.click();
                    void (await new Promise((resolve) =>
                      setTimeout(resolve, 3000)
                    ));
                  }

                  // Remove total amount change event handler
                  document.removeEventListener(
                    "change",
                    totalChangeEventListener
                  );

                  // Check if the user has saved any money
                  if (minimumTotal < previousTotal) {
                    console.log("Savings!");
                  }
                }
              )
              .catch((err) => console.log(err));
          }
        }
      }
    )
    .catch((err) => console.log(err));
}

window.addEventListener("resize", onResize);
window.addEventListener("unload", () => {
  window.removeEventListener("resize", onResize);
});
