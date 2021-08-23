import styles from "./form.module.css";

import type { FC } from "react";

export interface FormGroup {}

const FormInputGroup: FC<FormGroup> = ({ children, ...rest }) => {
  return (
    <div className={styles["form-group"]} {...rest}>
      {children}
    </div>
  );
};

export default FormInputGroup;
