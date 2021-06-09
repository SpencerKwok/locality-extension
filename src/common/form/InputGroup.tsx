import InputGroup, { InputGroupProps } from "react-bootstrap/InputGroup";

export interface FormInputGroupProps extends InputGroupProps {}

export default function FormInputGroup({
  children,
  ...rest
}: FormInputGroupProps) {
  return <InputGroup {...rest}>{children}</InputGroup>;
}
