import React from "react";
import Button from "react-bootstrap/Button";

import styles from "./form.module.css";

import type { ButtonProps } from "react-bootstrap/Button";

export interface FormSubmitButtonProps extends ButtonProps {
  text: string;
  submittingText: string;
  isSubmitting: boolean;
}

export default function FormSubmitButton({
  text,
  submittingText,
  isSubmitting,
  disabled,
  ...rest
}: FormSubmitButtonProps) {
  return (
    <Button
      {...rest}
      className={styles.button}
      type="submit"
      disabled={isSubmitting}
    >
      {isSubmitting && !disabled ? (
        <React.Fragment>
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            style={{ marginBottom: 2, marginRight: 12 }}
          ></span>
          {submittingText}
        </React.Fragment>
      ) : (
        <React.Fragment>{text}</React.Fragment>
      )}
    </Button>
  );
}
