import type { FC } from "react";

export interface FormCharacterLimitProps {
  message: string;
  maxCharacters: number;
}

const FormCharacterLimit: FC<FormCharacterLimitProps> = ({
  message,
  maxCharacters,
}) => {
  return (
    <div
      style={{
        textAlign: "right",
        color: message.length > maxCharacters ? "red" : "black",
      }}
    >{`${message.length}/${maxCharacters}`}</div>
  );
};

export default FormCharacterLimit;
