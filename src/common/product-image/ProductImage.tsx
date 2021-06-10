import { useState } from "react";

import Heart from "../images/Heart";
import HeartFilled from "../images/HeartFilled";
import Stack from "../Stack";
import styles from "./ProductImage.module.css";
import WishlistToolTip from "./WishlistToolTip";

import type { FC } from "react";
import type { Product } from "../Schema";

export interface ProductImageProps extends React.HTMLProps<HTMLDivElement> {
  alwaysHover?: boolean;
  initialWishList?: boolean;
  loading?: "eager" | "lazy";
  loggedIn?: boolean;
  product: Product;
  onToggleWishList: (id: string, value: boolean) => void;
}

const ProductImage: FC<ProductImageProps> = ({
  alwaysHover,
  initialWishList,
  loggedIn,
  loading,
  className,
  style,
  product,
  onToggleWishList,
}) => {
  const [hover, setHover] = useState(false);
  const [wishlist, setWishList] = useState(initialWishList);
  const {
    business,
    name,
    link,
    objectId,
    priceRange,
    variantImages,
    variantIndex,
  } = product;

  return (
    <div className={className} key={objectId}>
      {!loggedIn && (hover || alwaysHover) && (
        <Stack direction="row-reverse" style={{ marginRight: 20 }}>
          <div style={{ position: "absolute", marginTop: 16 }}>
            <WishlistToolTip
              onMouseEnter={() => {
                setHover(true);
              }}
              onMouseLeave={() => {
                setHover(false);
              }}
            />
          </div>
        </Stack>
      )}
      {loggedIn && (hover || alwaysHover) && !wishlist && (
        <Stack direction="row-reverse" style={{ marginRight: 20 }}>
          <div style={{ position: "absolute", marginTop: 16 }}>
            <Heart
              className={styles["heart"]}
              onMouseEnter={() => {
                setHover(true);
              }}
              onClick={() => {
                onToggleWishList(`${objectId}_${variantIndex}`, true);
                setWishList(true);
              }}
            />
          </div>
        </Stack>
      )}
      {loggedIn && wishlist && (
        <Stack direction="row-reverse" style={{ marginRight: 20 }}>
          <div style={{ position: "absolute", marginTop: 16 }}>
            <HeartFilled
              className={styles["heart-filled"]}
              onMouseEnter={() => {
                setHover(true);
              }}
              onClick={() => {
                onToggleWishList(`${objectId}_${variantIndex}`, false);
                setWishList(false);
              }}
              height={16}
              width={16}
            />
          </div>
        </Stack>
      )}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "black" }}
      >
        <Stack direction="column" rowAlign="flex-start" style={style}>
          <picture
            className={styles.picture}
            onMouseOver={() => {
              if (!hover) {
                setHover(true);
              }
            }}
            onMouseLeave={() => {
              setHover(false);
            }}
          >
            <img
              alt={name}
              loading={loading}
              src={variantImages[variantIndex].replace(
                "/upload",
                "/upload/w_400"
              )}
              width={75}
            />
          </picture>
          <h6 className={styles.h6}>{business}</h6>
          <h4 className={styles.h4}>{name}</h4>
          {priceRange[0] === priceRange[1] ? (
            <h5 className={styles.h5}>${priceRange[0].toFixed(2)} CAD</h5>
          ) : (
            <h5 className={styles.h5}>
              ${priceRange[0].toFixed(2)}-{priceRange[1].toFixed(2)} CAD
            </h5>
          )}
        </Stack>
      </a>
    </div>
  );
};

export default ProductImage;
