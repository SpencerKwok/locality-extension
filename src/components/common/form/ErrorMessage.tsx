import type { FC } from "react";
import { ErrorMessage, ErrorMessageProps } from "formik";

export interface FormErrorMessageProps extends ErrorMessageProps {}

const FormErrorMessage: FC<FormErrorMessageProps> = ({ name }) => {
  return (
    <ErrorMessage
      name={name}
      render={(msg) => <div style={{ color: "red" }}>{msg}</div>}
    />
  );
};

export default FormErrorMessage;
