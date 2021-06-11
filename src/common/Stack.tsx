import type { CSSProperties, FC } from "react";
import { Children } from "react";

export type StackDirection =
  | "row"
  | "row-reverse"
  | "column"
  | "column-reverse";
export type StackAlignment = "flex-start" | "center" | "flex-end";

export interface StackProps {
  direction: StackDirection;
  columnAlign?: StackAlignment;
  rowAlign?: StackAlignment;
  priority?: Array<number>;
  spacing?: number;
  style?: CSSProperties;
}

const Stack: FC<StackProps> = (props) => {
  let baseChildStyle = {};
  if (props.spacing) {
    switch (props.direction) {
      case "row":
        baseChildStyle = { ...baseChildStyle, marginRight: props.spacing };
        break;
      case "column":
        baseChildStyle = { ...baseChildStyle, marginBottom: props.spacing };
        break;
      case "row-reverse":
        baseChildStyle = { ...baseChildStyle, marginLeft: props.spacing };
        break;
      case "column-reverse":
        baseChildStyle = { ...baseChildStyle, marginTop: props.spacing };
        break;
    }
  }

  let style: {} = {
    ...props.style,
    display: "flex",
    flexDirection: props.direction,
  };
  if (props.columnAlign) {
    style = { ...style, justifyContent: props.columnAlign };
  }
  if (props.rowAlign) {
    style = { ...style, alignItems: props.rowAlign };
  }

  const children = Children.toArray(props.children);

  return (
    <div {...props} style={style}>
      {children.map((child, index) => {
        let childStyle = baseChildStyle;
        if (props.priority) {
          childStyle = { ...childStyle, flexGrow: props.priority[index] };
        }

        if (index >= children.length - 1) {
          switch (props.direction) {
            case "row":
              childStyle = { ...childStyle, marginRight: 0 };
              break;
            case "column":
              childStyle = { ...childStyle, marginBottom: 0 };
              break;
            case "row-reverse":
              childStyle = { ...childStyle, marginLeft: 0 };
              break;
            case "column-reverse":
              childStyle = { ...childStyle, marginTop: 0 };
              break;
          }
        }

        return <div style={childStyle}>{child}</div>;
      })}
    </div>
  );
};

export default Stack;
