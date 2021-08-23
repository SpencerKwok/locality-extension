import { Children, forwardRef } from "react";
import styled from "styled-components";

export type StackDirection =
  | "column-reverse"
  | "column"
  | "row-reverse"
  | "row";
export type StackAlignment = "center" | "flex-end" | "flex-start";

export interface StackProps extends React.HTMLProps<HTMLDivElement> {
  direction: StackDirection;
  columnAlign?: StackAlignment;
  rowAlign?: StackAlignment;
  priority?: Array<number>;
  spacing?: number;
}

const directionToMargin = (direction: StackDirection): string => {
  switch (direction) {
    case "row":
      return "right";
    case "row-reverse":
      return "left";
    case "column":
      return "bottom";
    case "column-reverse":
      return "top";
  }
};

const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ direction, columnAlign, rowAlign, ...rest }, ref) => {
    return (
      <div ref={ref} {...rest}>
        {Children.map(rest.children, (child, index) => {
          return (
            <div
              className="stackitem"
              {...(rest.priority && {
                style: { flexGrow: rest.priority[index] },
              })}
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  }
);

export default styled(Stack)`
  align-items: ${({ rowAlign }): string | undefined => rowAlign};
  display: flex;
  flex-wrap: ${({ wrap }): string | undefined => wrap};
  flex-direction: ${({ direction }): string | undefined => direction};
  justify-content: ${({ columnAlign }): string | undefined => columnAlign};
  > .stackitem {
      margin-${({ direction }): string | undefined =>
        directionToMargin(direction)}: ${({ spacing }): number | undefined =>
  spacing}px;
        &:last-child {
            margin-${({ direction }): string | undefined =>
              directionToMargin(direction)}: 0px;
        }
    }
`;
