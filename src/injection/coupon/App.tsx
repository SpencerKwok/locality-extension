import { Fragment, useState } from "react";
import styled from "styled-components";

import LocalityLogo from "../../common/images/LocalityLogo";
import Stack from "../../common/Stack";

import type { FC } from "react";
import type { CouponData } from "../../common/Schema";
import "./App.css";

export interface AppProps {
  coupons: Array<CouponData>;
  input: Array<string>;
  submit: Array<string>;
  total: Array<string>;
  onOpen: () => void;
  onClose: () => void;
}

const StyledButton = styled.button`
  border: none;
  border-radius: 0.25rem;
  background: #112378;
  color: #ffffff;
  padding: 12px;
  &:active {
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.28),
        rgba(255, 255, 255, 0.28)
      ),
      #112378;
  }
  &:disabled {
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.28),
        rgba(255, 255, 255, 0.28)
      ),
      #112378;
    cursor: default;
  }
  &:hover {
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.28),
        rgba(255, 255, 255, 0.28)
      ),
      #112378;
  }
`;

const showCheckoutElements = async (
  input: Array<string>,
  submit: Array<string>,
  total: Array<string>
): Promise<{
  inputElem: HTMLInputElement | null;
  submitElem: HTMLButtonElement | null;
  totalElem: HTMLDivElement | HTMLSpanElement | null;
}> => {
  const elementClickOrder = [
    ...input.slice(0, input.length - 1),
    ...submit.slice(0, submit.length - 1),
    ...total.slice(0, total.length - 1),
  ];

  let inputElem: HTMLInputElement | null = null;
  let submitElem: HTMLButtonElement | null = null;
  let totalElem: HTMLDivElement | HTMLSpanElement | null = null;

  let index = 0;
  let observer: MutationObserver = new MutationObserver(() => {});
  const p1 = new Promise<void>((resolve) => {
    observer = new MutationObserver((mutationsList, observer) => {
      mutationsList.forEach(({ addedNodes }) => {
        let index1 = 0;
        while (addedNodes[index1]) {
          let index2 = 0;
          const addedNode: any = addedNodes[index1];
          while (addedNode[index2]) {
            const elem = addedNode[index2];
            switch (`#${elem.id}`) {
              case input[input.length - 1]:
                inputElem = elem;
                break;
              case submit[submit.length - 1]:
                submitElem = elem;
                break;
              case total[total.length - 1]:
                totalElem = elem;
                break;
            }
            switch (elem.getAttribute("class")) {
              case input[input.length - 1]:
                inputElem = elem;
                break;
              case submit[submit.length - 1]:
                submitElem = elem;
                break;
              case total[total.length - 1]:
                totalElem = elem;
                break;
            }
            index2 += 1;
          }
          index1 += 1;
        }
      });
      observer.disconnect();
      resolve();
    });
    observer.observe(document, {
      childList: true,
      subtree: true,
    });
  });
  const p2 = new Promise<void>((resolve) => {
    const rawElem = document.querySelector(elementClickOrder[index]);
    if (rawElem) {
      const elem = rawElem as HTMLButtonElement;
      elem.click && elem.click();
    }

    setTimeout(() => {
      resolve();
    }, 1000);
  });

  for (; index < elementClickOrder.length; ++index) {
    await Promise.race([p1, p2]);
  }

  observer.disconnect();

  return {
    inputElem,
    submitElem,
    totalElem,
  };
};

let mouseX = -1;
let mouseY = -1;
const App: FC<AppProps> = ({
  coupons,
  input,
  submit,
  total,
  onOpen,
  onClose,
}) => {
  const [appliedCoupons, setAppliedCoupons] = useState(false);
  const [applyingCoupons, setApplyingCoupons] = useState(false);
  const [savings, setSavings] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  const preSavingsComponents = (
    <Fragment>
      <div style={{ marginBottom: 12, textAlign: "left", width: 200 }}>
        {applyingCoupons
          ? "Applying coupons..."
          : "Hey there! Thanks for supporting our local businesses. We have detected that this local business is offering coupons that could save you money!"}
      </div>
      <StyledButton
        disabled={applyingCoupons}
        onClick={async () => {
          setApplyingCoupons(true);
          const revealedCheckoutElements = await showCheckoutElements(
            input,
            submit,
            total
          );

          const inputElem = revealedCheckoutElements.inputElem
            ? revealedCheckoutElements.inputElem
            : (document.querySelector(
                input[input.length - 1]
              ) as HTMLInputElement);
          const submitElem = revealedCheckoutElements.submitElem
            ? revealedCheckoutElements.submitElem
            : (document.querySelector(
                submit[submit.length - 1]
              ) as HTMLButtonElement);
          const totalElem = revealedCheckoutElements.totalElem
            ? revealedCheckoutElements.totalElem
            : (document.querySelector(total[total.length - 1]) as
                | HTMLDivElement
                | HTMLSpanElement);

          // Get previous total
          const previousTotal = parseFloat(
            totalElem.innerText.replace(/[^0-9.]/gi, "")
          );

          // Setup event handler to handle total amount change
          let minimumTotal = previousTotal;
          const observer = new MutationObserver(() => {
            const newRawTotal = document.querySelector(total[total.length - 1]);
            const newTotalElem = newRawTotal as
              | HTMLDivElement
              | HTMLSpanElement;
            const newTotal = parseFloat(
              newTotalElem.innerText.replace(/[^0-9.]/gi, "")
            );
            minimumTotal = Math.min(minimumTotal, newTotal);
          });
          observer.observe(document, {
            childList: true,
            subtree: true,
          });

          // Apply all coupons
          for (let i = 0; i < coupons.length; ++i) {
            const { coupon } = coupons[i];
            inputElem.value = coupon;
            inputElem.dispatchEvent(new Event("input", { bubbles: true }));
            submitElem.click && submitElem.click();
            void (await new Promise((resolve) => setTimeout(resolve, 2000)));
          }

          // Remove total amount change event handler
          observer.disconnect();

          // Check if the user has saved any money
          if (minimumTotal < previousTotal) {
            setSavings(previousTotal - minimumTotal);
          }

          // Well, we tried applying coupons
          setAppliedCoupons(true);
        }}
      >
        Apply Coupons
      </StyledButton>
    </Fragment>
  );

  const postSavingsSuccessComponents = (
    <Fragment>
      <div style={{ marginBottom: 12, textAlign: "left", width: 200 }}>
        You saved ${savings.toFixed(2)}! Thank you for supporting your local
        businesses!
      </div>
    </Fragment>
  );

  const postSavingsFailureComponents = (
    <Fragment>
      <div style={{ marginBottom: 12, textAlign: "left", width: 200 }}>
        Applied coupons! Thank you for supporting your local businesses!
      </div>
    </Fragment>
  );

  if (collapsed) {
    return (
      <img
        src="https://res.cloudinary.com/hcory49pf/image/upload/v1628434355/extension/locality128.png"
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
          {!appliedCoupons
            ? preSavingsComponents
            : savings <= 0
            ? postSavingsFailureComponents
            : postSavingsSuccessComponents}
        </Stack>
      </Stack>
    </div>
  );
};

export default App;
