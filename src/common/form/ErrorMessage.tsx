import { ErrorMessage, ErrorMessageProps } from "formik";

import type { FC, HTMLProps, JSXElementConstructor, ReactElement } from "react";

export type FormErrorMessageProps = ErrorMessageProps;

const FormErrorMessage: FC<FormErrorMessageProps> = ({ name }) => {
  return (
    <ErrorMessage
      name={name}
      render={(
        msg
      ): ReactElement<
        HTMLProps<HTMLDivElement>,
        JSXElementConstructor<HTMLDivElement>
      > => <div style={{ color: "red", fontSize: 12 }}>{msg}</div>}
    />
  );
};

export default FormErrorMessage;
