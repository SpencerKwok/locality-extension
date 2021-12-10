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

const getCheckoutElements = (
  addedNodes: any,
  input: string,
  submit: string
) => {
  let inputElem: HTMLInputElement | null = null;
  let submitElem: HTMLButtonElement | null = null;

  let index1 = 0;
  while (addedNodes[index1]) {
    let index2 = 0;
    const addedNode = addedNodes[index1];
    while (addedNode[index2]) {
      const elem = addedNode[index2];
      switch (`#${elem.id}`) {
        case input:
          inputElem = elem;
          break;
        case submit:
          submitElem = elem;
          break;
      }
      switch (elem.getAttribute("class")) {
        case input:
          inputElem = elem;
          break;
        case submit:
          submitElem = elem;
          break;
      }
      index2 += 1;
    }

    if ("nextElementSibling" in addedNodes[index1]) {
      const nextElementSibling = addedNodes[index1]["nextElementSibling"];
      if (nextElementSibling && nextElementSibling.querySelector) {
        if (nextElementSibling.querySelector(input)) {
          inputElem = nextElementSibling.querySelector(input);
        } else if (nextElementSibling.querySelector(submit)) {
          submitElem = nextElementSibling.querySelector(submit);
        }
      }
    }

    const nextElementSibling = addedNodes[index1];
    if (nextElementSibling && nextElementSibling.querySelector) {
      if (nextElementSibling.querySelector(input)) {
        inputElem = nextElementSibling.querySelector(input);
      } else if (nextElementSibling.querySelector(submit)) {
        submitElem = nextElementSibling.querySelector(submit);
      }
    }

    index1 += 1;
  }

  return {
    inputElem,
    submitElem,
  };
};

const showCheckoutElements = async (
  input: Array<string>,
  submit: Array<string>
): Promise<{
  inputElem: HTMLInputElement | null;
  submitElem: HTMLButtonElement | null;
}> => {
  const elementClickOrder = [
    ...input.slice(0, input.length - 1),
    ...submit.slice(0, submit.length - 1),
  ];

  let inputElem: HTMLInputElement | null = null;
  let submitElem: HTMLButtonElement | null = null;

  let index = 0;
  let observer: MutationObserver = new MutationObserver(() => {});
  const p1 = new Promise<void>((resolve) => {
    observer = new MutationObserver((mutationsList, observer) => {
      mutationsList.forEach(({ addedNodes }: { addedNodes: any }) => {
        const elems = getCheckoutElements(
          addedNodes,
          input[input.length - 1],
          submit[submit.length - 1]
        );
        if (elems.inputElem) {
          inputElem = elems.inputElem;
        }
        if (elems.submitElem) {
          submitElem = elems.submitElem;
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
      elem && elem.click && elem.click();
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
  };
};

let mouseX = -1;
let mouseY = -1;
const App: FC<AppProps> = ({ coupons, input, submit, onOpen, onClose }) => {
  const [appliedCoupons, setAppliedCoupons] = useState(false);
  const [applyingCoupons, setApplyingCoupons] = useState(false);
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
            submit
          );

          let inputElem = revealedCheckoutElements.inputElem
            ? revealedCheckoutElements.inputElem
            : (document.querySelector(
                input[input.length - 1]
              ) as HTMLInputElement);
          let submitElem = revealedCheckoutElements.submitElem
            ? revealedCheckoutElements.submitElem
            : (document.querySelector(
                submit[submit.length - 1]
              ) as HTMLButtonElement);

          // Apply all coupons
          for (let i = 0; i < coupons.length; ++i) {
            const { coupon } = coupons[i];
            inputElem.value = coupon;
            inputElem.dispatchEvent(new Event("input", { bubbles: true }));
            submitElem.click && submitElem.click();
            void (await new Promise((resolve) => setTimeout(resolve, 2000)));

            // TODO: Doesn't work when we have more than
            // 1 coupon and the inputs need to be revealed
            inputElem = document.querySelector(
              input[input.length - 1]
            ) as HTMLInputElement;
            submitElem = document.querySelector(
              submit[submit.length - 1]
            ) as HTMLButtonElement;
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
            : postSavingsSuccessComponents}
        </Stack>
      </Stack>
    </div>
  );
};

export default App;
