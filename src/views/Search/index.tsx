import React from "react";
import { Col, Row } from "antd";
import Header from "../../components/Header";
import styled from "styled-components/macro";
import { times } from "lodash";
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "./Map";
import Service, { service } from "../../components/Service";

const StyledMapContainer = styled(Col)`
  background-color: gray;
`;

const StyledRow = styled(Row)`
  height: calc(100vh - 85px);
`;

const Search = () => {
  return (
    <div>
      <Header position={"relative"} />

      <StyledRow>
        <Col span={8}>
          {times(5, () => service()).map((service, index) => (
            <Service service={service} key={index} />
          ))}
        </Col>
        <StyledMapContainer span={16}>
          <Map />
        </StyledMapContainer>
      </StyledRow>
    </div>
  );
};

export default Search;
