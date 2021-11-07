import React from "react";
import { Row, Typography } from "antd";
import styled from "styled-components/macro";

const StyledContainer = styled(Row)`
  padding: 20px;
  border-top: 1px whitesmoke solid;
`;

const Footer = () => {
  return (
    <StyledContainer justify={"center"}>
      <Typography.Text>2021 eCare</Typography.Text>
    </StyledContainer>
  );
};

export default Footer;
