import Heart from "../images/Heart";
import Popup from "reactjs-popup";
import styles from "./ProductImage.module.css";
import "reactjs-popup/dist/index.css";

export interface WishlistToolTipProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function WishlistToolTip({
  onMouseEnter,
  onMouseLeave,
}: WishlistToolTipProps) {
  return (
    <Popup
      contentStyle={{
        marginTop: 8,
        marginLeft: 8,
        padding: 0,
        width: 120,
        zIndex: 2147483647,
      }}
      position={["right center", "left center"]}
      on={["hover"]}
      trigger={
        <div>
          <Heart className={styles.heart} onMouseEnter={onMouseEnter} />
        </div>
      }
    >
      <p
        style={{ textAlign: "center", padding: 8, margin: 0 }}
        onMouseLeave={onMouseLeave}
      >
        Sign up to create your wishlist!
      </p>
    </Popup>
  );
}
