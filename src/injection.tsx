import ReactDOM from "react-dom";
import CouponApp from "./injection/coupon/App";
import SearchApp from "./injection/search/App";
import "bootstrap/dist/css/bootstrap.min.css";

import { GetRpcClient } from "./common/RpcClient";
import styles from "./injection.module.css";

import type { FC } from "react";
import type { CouponData } from "./common/Schema";
import type { AppProps as CouponAppProps } from "./injection/coupon/App";
import type { AppProps as SearchAppProps } from "./injection/search/App";

const HOST_NAME = "https://mylocality.shop";

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

const searchOnOpen = () => {
  open = true;
  fixHorizontal = false;
  app.style.left = "";
  app.style.top = "60px";
  app.style.right = "20px";
  app.className = styles["locality-window"];
};

const searchOnClose = () => {
  open = false;
  fixHorizontal = true;
  app.style.left = "";
  app.style.top = "185px";
  app.style.right = "0px";
  app.className = styles["locality-window-collapsed"];
};

const searchOnResize = () => {
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

const couponOnOpen = () => {
  open = true;
  fixHorizontal = false;
  app.style.left = "";
  app.style.top = "20px";
  app.style.right = "20px";
  app.className = styles["locality-window"];
};

const couponOnClose = () => {
  open = false;
  fixHorizontal = true;
  app.style.left = "";
  app.style.top = "0px";
  app.style.right = "0px";
  app.className = styles["locality-window-collapsed"];
};

const couponOnResize = () => {
  if (open) {
    app.style.left = "";
    app.style.top = "20px";
    app.style.right = "20px";
  } else {
    app.style.left = "";
    app.style.top = "0px";
    app.style.right = "0px";
  }
};

const SearchAppWrapper: FC<SearchAppProps> = (props) => {
  return ReactDOM.createPortal(<SearchApp {...props} />, app);
};

const CouponAppWrapper: FC<CouponAppProps> = (props) => {
  return ReactDOM.createPortal(<CouponApp {...props} />, app);
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
                <SearchAppWrapper
                  email={email}
                  token={token}
                  initialHits={hits}
                  query={query}
                  onOpen={searchOnOpen}
                  onClose={searchOnClose}
                />,
                app
              );

            window.addEventListener("resize", searchOnResize);
            window.addEventListener("unload", () => {
              window.removeEventListener("resize", searchOnResize);
            });
          });
      }
    }
  );
}

// Coupons
else if (window.location.host.match(/shop\.app/)) {
  new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
    const logo: HTMLImageElement | null = document.querySelector(
      "#app > section > header > div._330j5._13qKW > div > button > img"
    );
    if (logo) {
      fetch(
        `${HOST_NAME}/api/extension/checkout/shop_app/get?name=${encodeURIComponent(
          logo.alt
        )}`
      )
        .then((res) => res.json())
        .then(
          async ({
            coupons,
            input,
            submit,
            total,
          }: {
            coupons: Array<CouponData>;
            input: Array<string>;
            submit: Array<string>;
            total: Array<string>;
          }) => {
            if (coupons.length > 0) {
              app.style.top = "20px";
              ReactDOM.render(
                <CouponAppWrapper
                  coupons={coupons}
                  input={input}
                  submit={submit}
                  onOpen={couponOnOpen}
                  onClose={couponOnClose}
                />,
                app
              );

              window.addEventListener("resize", couponOnResize);
              window.addEventListener("unload", () => {
                window.removeEventListener("resize", couponOnResize);
              });
            }
          }
        )
        .catch((err) => console.log(err));
    }
  });
} else {
  fetch(`${HOST_NAME}/api/extension/checkout/get`)
    .then((res) => res.json())
    .then(
      async ({
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
          // Get coupons
          fetch(`${HOST_NAME}/api/extension/coupons/get`)
            .then((res) => res.json())
            .then(async ({ coupons }: { coupons: Array<CouponData> }) => {
              if (coupons.length > 0) {
                app.style.top = "20px";
                ReactDOM.render(
                  <CouponAppWrapper
                    coupons={coupons}
                    input={input}
                    submit={submit}
                    onOpen={couponOnOpen}
                    onClose={couponOnClose}
                  />,
                  app
                );

                window.addEventListener("resize", couponOnResize);
                window.addEventListener("unload", () => {
                  window.removeEventListener("resize", couponOnResize);
                });
              }
            })
            .catch((err) => console.log(err));
        }

        // Could be hash that is set later, set listener to check...
        else {
          const hashChangeEventHandler = (): any => {
            const re = new RegExp(checkoutUrl);
            if (re.test(window.location.href)) {
              // Get coupons
              fetch(`${HOST_NAME}/api/extension/coupons/get`)
                .then((res) => res.json())
                .then(async ({ coupons }: { coupons: Array<CouponData> }) => {
                  if (coupons.length > 0) {
                    app.style.top = "20px";
                    ReactDOM.render(
                      <CouponAppWrapper
                        coupons={coupons}
                        input={input}
                        submit={submit}
                        onOpen={couponOnOpen}
                        onClose={couponOnClose}
                      />,
                      app
                    );

                    window.addEventListener("resize", couponOnResize);
                    window.addEventListener("unload", () => {
                      window.removeEventListener("resize", couponOnResize);
                    });
                  }
                })
                .catch((err) => console.log(err));
              return window.removeEventListener(
                "hashchange",
                hashChangeEventHandler
              );
            }
          };
          window.addEventListener("hashchange", hashChangeEventHandler);
        }
      }
    )
    .catch((err) => console.log(err));
}
