import { useState } from "react";

import { GetRpcClient, PostRpcClient } from "../common/RpcClient";
import LocalityLogo from "../common/images/LocalityLogo";
import ProductImage from "../common/product-image/ProductImage";
import Stack from "../common/Stack";

import type { FC } from "react";
import type { Product } from "../common/Schema";
import "./App.css";

export interface AppProps {
  id: number;
  token: string;
  initialHits: Array<Product>;
  query: string;
  onOpen: () => void;
  onClose: () => void;
}

let mouseX = -1;
let mouseY = -1;
const App: FC<AppProps> = ({
  id,
  token,
  initialHits,
  query,
  onOpen,
  onClose,
}) => {
  const [results, setResults] = useState({
    isAllHits: false,
    loadingHits: false,
    hits: initialHits,
    page: 0,
  });
  const [collapsed, setCollapsed] = useState(false);
  const loggedIn: boolean = !!(typeof id === "number" && token);
  const onToggleWishlist = (objectId: string, value: boolean) => {
    if (value) {
      PostRpcClient.getInstance().call(
        "AddToWishList",
        { id: objectId },
        { id, token }
      );
    } else {
      PostRpcClient.getInstance().call(
        "DeleteFromWishList",
        { id: objectId },
        { id, token }
      );
    }

    // TODO: Fix this one day please, linear search is pathetically slow
    for (let i = 0; i < results.hits.length; ++i) {
      if (
        objectId ===
        `${results.hits[i].objectId}_${results.hits[i].variantIndex}`
      ) {
        setResults({
          ...results,
          hits: [
            ...results.hits.slice(0, i),
            { ...results.hits[i], wishlist: value },
            ...results.hits.slice(i + 1),
          ],
        });
        break;
      }
    }
  };

  if (collapsed) {
    return (
      <img
        src="https://res.cloudinary.com/hcory49pf/image/upload/v1614846287/extension/locality128.png"
        alt="Locality Logo"
        width={64}
        onMouseDown={(event) => {
          mouseX = event.clientX;
          mouseY = event.clientY;
        }}
        onMouseUp={(event) => {
          const diffX = event.clientX - mouseX;
          const diffY = event.clientY - mouseY;
          if (Math.sqrt(diffX * diffX + diffY * diffY) < 2) {
            setCollapsed(false);
            onOpen();
          }
        }}
      />
    );
  }

  return (
    <div
      className="locality-window"
      style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}
    >
      <div
        className="locality-close"
        onMouseDown={(event) => {
          mouseX = event.clientX;
          mouseY = event.clientY;
        }}
        onMouseUp={(event) => {
          const diffX = event.clientX - mouseX;
          const diffY = event.clientY - mouseY;
          if (Math.sqrt(diffX * diffX + diffY * diffY) < 2) {
            setCollapsed(true);
            onClose();
          }
        }}
      />
      <Stack direction="row" columnAlign="center">
        <Stack direction="column" rowAlign="center">
          <LocalityLogo height={60} width={200} />
          <div style={{ marginBottom: 12 }}>
            Results for "{query}" in your area!
          </div>
          <Stack
            direction="column"
            rowAlign="center"
            style={{
              height: 400,
              width: 300,
              overflowX: "hidden",
              overflowY: "scroll",
              position: "relative",
            }}
            onScroll={(event) => {
              if (
                !results.isAllHits &&
                !results.loadingHits &&
                event.currentTarget.scrollHeight -
                  event.currentTarget.scrollTop -
                  event.currentTarget.clientHeight <
                  800
              ) {
                setResults({
                  ...results,
                  loadingHits: true,
                });

                GetRpcClient.getInstance()
                  .call("Search", `/search?q=${query}&pg=${results.page + 1}`, {
                    id,
                    token,
                  })
                  .then(({ hits }) => {
                    if (hits.length === 0) {
                      setResults({
                        ...results,
                        isAllHits: true,
                        loadingHits: false,
                      });
                    } else {
                      setResults({
                        ...results,
                        loadingHits: false,
                        hits: [...results.hits, ...hits],
                        page: results.page + 1,
                      });
                    }
                  });
              }
            }}
          >
            {Array.from(Array(Math.ceil(results.hits.length / 3)).keys()).map(
              (index) => {
                return (
                  <Stack direction="row" columnAlign="flex-start" spacing={8}>
                    {(() => {
                      const renderedResults = results.hits
                        .slice(index * 3, index * 3 + 3)
                        .map((product, index2) => {
                          if (product.name.length > 14) {
                            product.name = `${product.name.substr(0, 12)}...`;
                          }

                          if (product.business.length > 14) {
                            product.business = `${product.business.substr(
                              0,
                              12
                            )}...`;
                          }

                          return (
                            <ProductImage
                              loggedIn={loggedIn}
                              initialWishList={product.wishlist}
                              className={`locality-link${
                                (index2 + 1) % 3 === 0 ? "-end" : ""
                              }`}
                              loading={(index * 3) % 24 < 9 ? "eager" : "lazy"}
                              product={product}
                              onToggleWishList={onToggleWishlist}
                            />
                          );
                        });

                      const blankSlots = (3 - (renderedResults.length % 3)) % 3;
                      if (blankSlots > 0) {
                        renderedResults.push(
                          <div
                            key={results.hits.length}
                            style={{
                              width: blankSlots * 75 + (blankSlots - 1) * 8,
                            }}
                          />
                        );
                      }

                      return renderedResults;
                    })()}
                  </Stack>
                );
              }
            )}
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default App;
