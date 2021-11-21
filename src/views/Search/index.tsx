import React from "react";
import { Col } from "antd";
import Header from "../../components/Header";
import styled from "styled-components/macro";
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "./Map";
import Service, { ServiceType } from "../../components/Service";
import { useSelector } from "react-redux";
import { selectSearchParams } from "../../store/search";
import { useQuery } from "react-query";
import { useApi } from "../../api";

const StyledMapContainer = styled(Col)`
  background-color: gray;
  width: 65%;
`;

const StyledContainer = styled.div`
  height: calc(100vh - 153px);
  display: flex;
`;

const StyledServices = styled.div`
  overflow-y: scroll;
  height: 100%;
  width: 35%;
  min-width: 300px;
`;

const Search = () => {
  const api = useApi();
  const searchParams = useSelector(selectSearchParams);

  const { data: services, isLoading } = useQuery(["services", api], () =>
    api.client.get<any, Array<ServiceType>>(`/services/`)
  );

  return (
    <div>
      <Header position={"relative"} />

      <StyledContainer>
        <StyledServices>
          {services?.map((service, index) => (
            <Service service={service} key={index} />
          ))}
        </StyledServices>
        <StyledMapContainer>
          <Map services={services || []} />
        </StyledMapContainer>
      </StyledContainer>
    </div>
  );
};

export default Search;
