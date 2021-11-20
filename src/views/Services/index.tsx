import React from "react";
import { Card, Row, Typography } from "antd";
import styled from "styled-components/macro";
import faker from "faker";
import Header from "../../components/Header";
import { useQuery } from "react-query";
import { useApi } from "../../api";
import Service, { ServiceType } from "components/Service";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/auth";

const service = () => ({
  title: faker.name.findName(),
  location: faker.address.cityName(),
  description: faker.commerce.productDescription(),
  images: ["https://joeschmoe.io/api/v1/random"],
});

const StyledContainer = styled.div`
  padding: 10px 10vw;
`;

const StyledCard = styled(Card)`
  width: 100%;
`;

const Services = () => {
  const api = useApi();
  const user = useSelector(selectUser);

  const { data: services } = useQuery(["services", api], () =>
    api.client.get<any, Array<ServiceType>>("/services/", {
      params: { user: user?.uuid },
    })
  );
  return (
    <div>
      <Header position={"relative"} />

      <StyledContainer>
        <Typography.Title>Services</Typography.Title>

        <Row justify={"space-around"} gutter={1}>
          {services?.map((service) => (
            <StyledCard key={service.url} hoverable>
              <Service service={service} showDivider={false} />
            </StyledCard>
          ))}
        </Row>
      </StyledContainer>
    </div>
  );
};

export default Services;
