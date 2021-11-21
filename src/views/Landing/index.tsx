import React from "react";
import styled from "styled-components/macro";
import headerImage from "images/header.jpg";
import Header from "components/Header";
import Explore from "components/Explore";

const StyledContainer = styled.div``;

const StyledHeaderImage = styled.div`
  //width: 100vw;
  height: 75vh;
  object-fit: cover;

  background: #c04848; /* fallback for old browsers */
  background: linear-gradient(rgb(0, 0, 0, 0.6), rgb(0, 0, 0, 0.1)),
    url(${headerImage});
  background-size: cover;
  background-repeat: no-repeat;
`;

const Landing = () => {
  return (
    <StyledContainer>
      <StyledHeaderImage />
      <Header />
      <Explore />
    </StyledContainer>
  );
};

export default Landing;
