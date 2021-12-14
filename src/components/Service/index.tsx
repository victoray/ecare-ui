import styled from "styled-components/macro";
import { Carousel, Divider, Row, Space, Typography } from "antd";
import React, { FC, Fragment } from "react";
import { Link } from "react-router-dom";
import { User } from "../../store/auth";

const ServiceContainer = styled(Space)`
  padding: 0 25px;
  cursor: pointer;
  width: 100%;

  & > *:last-child {
    flex: 1;
  }
`;

const StyledSpace = styled(Space)`
  width: 100%;
`;

export const StyledServiceImage = styled.img`
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

export type Address = {
  rawAddress: string;
  longitude: number;
  latitude: number;
  uuid: string;
  service: string;
};

export type ServiceType = {
  fullDescription: string;
  images: Array<string>;
  name: string;
  pricePerHour: number;
  providerType: string;
  shortDescription: string;
  url: string;
  user: User;
  uuid: string;
  addresses?: Array<Address>;
};

type ServiceProps = {
  service: ServiceType;
  showDivider?: boolean;
};

const Service: FC<ServiceProps> = ({ service, showDivider = true }) => {
  return (
    <Fragment>
      <ServiceContainer align={"start"}>
        <StyledServiceImage as={Carousel} autoplay>
          {service.images.map((image, index) => (
            <StyledServiceImage src={image} alt="" key={index} />
          ))}
        </StyledServiceImage>

        <StyledInfo>
          <StyledSpace direction={"vertical"}>
            <Typography.Text strong>
              <Link to={`/service/${service.uuid}`}>{service.name}</Link>
            </Typography.Text>
            <Typography.Paragraph type={"secondary"} ellipsis={{ rows: 5 }}>
              {service.fullDescription}
            </Typography.Paragraph>
          </StyledSpace>

          <StyledPriceInfo justify={"end"}>
            <Typography.Text strong>
              NGN
              {service.pricePerHour}
            </Typography.Text>
            <Typography.Text>/ hour</Typography.Text>
          </StyledPriceInfo>
        </StyledInfo>
      </ServiceContainer>
      {showDivider && <Divider />}
    </Fragment>
  );
};

export default Service;
