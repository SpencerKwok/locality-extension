import Stack from "../Stack";
import styles from "./form.module.css";

import type { FC, HTMLProps } from "react";

export interface FormInputProps extends HTMLProps<HTMLInputElement> {
  required?: boolean;
}

const FormInputGroup: FC<FormInputProps> = ({ required, type, ...rest }) => {
  if (type === "checkbox") {
    return <input type={type} {...rest} />;
  }

  return (
    <Stack
      direction="row"
      rowAlign="center"
      columnAlign="center"
      className={styles["input-wrapper"]}
      priority={[1, 0]}
      spacing={8}
      style={{ border: type === "checkbox" ? "none" : "" }}
    >
      <input className={styles.input} type={type} {...rest} />
      <div style={{ color: "red", width: 10 }}>
        {required === true ? "*" : ""}
      </div>
    </Stack>
  );
};

export default FormInputGroup;
