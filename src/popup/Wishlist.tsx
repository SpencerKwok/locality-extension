import Button from "react-bootstrap/Button";

import ProductImage from "../common/product-image/ProductImage";
import Stack from "../common/Stack";
import "./App.css";

import type { FC } from "react";
import type { Product } from "../common/Schema";

export interface WishlistProps {
  wishlist: Array<Product>;
  onToggleWishlist: (objectId: string, value: boolean) => void;
  onSignOut: () => void;
}

const Wishlist: FC<WishlistProps> = ({
  wishlist,
  onToggleWishlist,
  onSignOut,
}) => {
  return (
    <div style={{ width: 300 }}>
      <Stack direction="row" columnAlign="center">
        <Stack
          direction="column"
          rowAlign="center"
          style={{ marginBottom: 20 }}
        >
          <Stack direction="row-reverse" style={{ width: 300 }}>
            <Button
              variant="secondary"
              style={{ margin: 8, padding: "4px 8px" }}
              onClick={onSignOut}
            >
              Sign out
            </Button>
          </Stack>
          <h1 style={{ textAlign: "center" }}>My Wishlist</h1>
          <Stack direction="column" rowAlign="center" style={{ width: 300 }}>
            {wishlist.length > 0 ? (
              Array.from(Array(Math.ceil(wishlist.length / 3)).keys()).map(
                (index) => {
                  return (
                    <Stack direction="row" columnAlign="flex-start" spacing={8}>
                      {(() => {
                        const results = wishlist
                          .slice(index * 3, index * 3 + 3)
                          .map((product, index2) => {
                            if (product.name.length > 14) {
                              product.name = `${product.name.substr(0, 12)}...`;
                            }

                            return (
                              <ProductImage
                                alwaysHover
                                initialWishList
                                loggedIn
                                className={`locality-link${
                                  (index2 + 1) % 3 === 0 ? "-end" : ""
                                }`}
                                loading={index * 3 < 9 ? "eager" : "lazy"}
                                product={product}
                                onToggleWishList={onToggleWishlist}
                              />
                            );
                          });

                        const blankSlots = (3 - (results.length % 3)) % 3;
                        if (blankSlots > 0) {
                          results.push(
                            <div
                              key={wishlist.length}
                              style={{
                                width: blankSlots * 90 + (blankSlots - 1) * 8,
                              }}
                            />
                          );
                        }

                        return results;
                      })()}
                    </Stack>
                  );
                }
              )
            ) : (
              <div
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                Empty
              </div>
            )}
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default Wishlist;
