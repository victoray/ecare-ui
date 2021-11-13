import React, { FC, Fragment } from "react";
import { Carousel, Col, Divider, Row, Space, Typography } from "antd";
import Header from "../../components/Header";
import styled from "styled-components/macro";
import faker from "faker";
import { times } from "lodash";

const StyledMapContainer = styled(Col)`
  background-color: gray;
`;

const StyledRow = styled(Row)`
  height: calc(100vh - 85px);
`;

const service = () => ({
  title: faker.name.findName(),
  location: faker.address.cityName(),
  description: faker.commerce.productDescription(),
  pricePerHour: "15000",
  currency: "NGN",
  images: [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80",
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80",
    "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3200&q=80",
    "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2047&q=80",
  ],
});

const ServiceContainer = styled(Space)`
  padding: 0 25px;
  cursor: pointer;
`;

const StyledServiceImage = styled.img`
  width: 300px;
  height: 200px;
  border-radius: 15px;
  object-fit: cover;
`;

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  height: 200px;
`;

const StyledPriceInfo = styled(Row)`
  margin-top: auto;
`;

type ServiceProps = {
  service: ReturnType<typeof service>;
};
const Service: FC<ServiceProps> = ({ service }) => {
  return (
    <Fragment>
      <ServiceContainer align={"start"}>
        <StyledServiceImage as={Carousel}>
          {service.images.map((image, index) => (
            <StyledServiceImage src={image} alt="" key={index} />
          ))}
        </StyledServiceImage>

        <StyledInfo>
          <Space direction={"vertical"}>
            <Typography.Text strong>{service.title}</Typography.Text>
            <Typography.Text type={"secondary"}>
              {service.description}
            </Typography.Text>
          </Space>

          <StyledPriceInfo justify={"end"}>
            <Typography.Text strong>
              {service.currency}
              {service.pricePerHour}
            </Typography.Text>
            <Typography.Text>/ hour</Typography.Text>
          </StyledPriceInfo>
        </StyledInfo>
      </ServiceContainer>
      <Divider />
    </Fragment>
  );
};

const Services = () => {
  return (
    <div>
      <Header position={"relative"} />

      <StyledRow>
        <Col span={8}>
          {times(5, () => service()).map((service, index) => (
            <Service service={service} key={index} />
          ))}
        </Col>
        <StyledMapContainer span={16}>Map</StyledMapContainer>
      </StyledRow>
    </div>
  );
};

export default Services;
