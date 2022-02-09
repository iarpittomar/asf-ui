import { CSSProperties } from "styled-components";

export interface IButton {
  className: string;
  contained: string;
  flat: string;
  disabled: string;
  icon: string;
  onClick: () => void;
  size: string;
  style: CSSProperties;
  id: string;
  tooltip: string;
  type: "button" | "submit" | "reset";
}
