import styled from "styled-components/macro";
import { Carousel, Divider, Row, Space, Typography } from "antd";
import React, { FC, Fragment } from "react";
import faker from "faker";
import { Link } from "react-router-dom";
import { User } from "../../store/auth";

export const service = (): ServiceType => ({
  name: faker.name.findName(),
  fullDescription: faker.commerce.productDescription(),
  shortDescription: faker.commerce.productDescription(),
  providerType: "doctor",
  url: "",
  user: {
    dateOfBirth: "2021-11-16",
    email: "odinodin161@gmail.com",
    emergencyContact: "viktoray007@gmail.com",
    gender: null,
    governmentId:
      "http://res.cloudinary.com/odinson/image/upload/v1636922684/fnkw5ovarhkkogrsqlx2.jpg",
    legalName: "Victor Ayogu",
    profileImage:
      "http://res.cloudinary.com/odinson/image/upload/v1636922996/bpfaxqnhezgdslfxlymd.jpg",
    role: "http://127.0.0.1:8000/roles/a1af88c8-5c93-4367-a321-e25a0adbaf91/",
    roleType: "provider",
    username: "c5xEpJerFRWYn0fabpCSDXYvobA2",
    uuid: "97924d96-ca1e-4d16-a99d-d2861de9fe38",
  },
  pricePerHour: 15000,
  images: [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80",
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80",
    "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3200&q=80",
    "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2047&q=80",
  ],
  uuid: "",
});

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
