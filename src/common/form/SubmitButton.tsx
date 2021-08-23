import Button from "../button/Button";
import Stack from "../Stack";
import styles from "./form.module.css";

import type { FC } from "react";
import type { ButtonProps } from "react-bootstrap/Button";

export interface FormSubmitButtonProps extends ButtonProps {
  text: string;
  submittingText: string;
  isSubmitting: boolean;
}

const FormSubmitButton: FC<FormSubmitButtonProps> = ({
  text,
  submittingText,
  isSubmitting,
  disabled,
  ...rest
}) => {
  return (
    <Button
      {...rest}
      className={styles.button}
      variant="dark"
      type="submit"
      disabled={isSubmitting}
    >
      {isSubmitting === true && disabled !== true ? (
        <Stack direction="row" rowAlign="center" columnAlign="center">
          <span
            className={`${styles["spinner-border"]} ${styles["spinner-border-sm"]}`}
            role="status"
            aria-hidden="true"
            style={{ marginRight: 12 }}
          ></span>
          {submittingText}
        </Stack>
      ) : (
        <Stack
          direction="row"
          rowAlign="center"
          columnAlign="center"
          style={{ height: 18 }}
        >
          {text}
        </Stack>
      )}
    </Button>
  );
};

export default FormSubmitButton;
