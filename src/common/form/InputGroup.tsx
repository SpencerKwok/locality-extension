import styles from "./form.module.css";

import type { FC, HTMLProps } from "react";

export type FormInputGroupProps = HTMLProps<HTMLDivElement>;

const FormInputGroup: FC<FormInputGroupProps> = ({ children, ...rest }) => {
  return (
    <div className={styles["input-group"]} {...rest}>
      {children}
    </div>
  );
};

export default FormInputGroup;
