import React, { FC } from "react";
import Icon from "@ant-design/icons";
import { ReactComponent as BluePinSvg } from "./assets/ico-pin-blue.svg";

export const BluePinIcon: FC = (props) => {
  return <Icon component={BluePinSvg} {...props} />;
};
