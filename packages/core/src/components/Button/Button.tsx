import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import React from "react";
import { IButton } from "../../interfaces/IButton";

const Button: React.FC<any> = (props) => {
  //   const classes = [];

  //   if (props.children) {
  //     classes.push("button");
  //   } else {
  //     classes.push("icon-button");
  //   }

  //   if (className) {
  //     classes.push(className);
  //   }

  //   if (size) {
  //     classes.push(size);
  //   }

  //   if (contained) {
  //     classes.push("contained");
  //   } else if (flat) {
  //     classes.push("flat");
  //   }

  //   if (icon) {
  //     classes.push(`icon icon-${icon}`);
  //   }

  /* eslint-disable react/button-has-type */
  return <ButtonComponent>Button</ButtonComponent>;
  /* eslint-enable react/button-has-type */
};

export default Button;
