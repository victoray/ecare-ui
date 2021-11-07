import React, { FC } from "react";
import { Col, Row, Space, Typography } from "antd";
import styled from "styled-components/macro";
import { times } from "lodash";
import faker from "faker";

const StyledContainer = styled.div`
  padding: 50px 15vw;
`;

const StyledImage = styled.img`
  height: 64px;
  width: 64px;
  border-radius: 2px;
`;

type CareProviderProps = {
  name: string;
  location: string;
  avatar: string;
};

const CareProvider: FC<CareProviderProps> = ({ name, location, avatar }) => {
  return (
    <Space align={"center"}>
      <StyledImage src={avatar} alt="" />

      <Space direction={"vertical"}>
        <Typography.Text strong>{name}</Typography.Text>
        <Typography.Text type={"secondary"}>{location}</Typography.Text>
      </Space>
    </Space>
  );
};

faker.seed(2);

const Explore = () => {
  return (
    <StyledContainer>
      <Typography.Title level={3}>
        Explore care providers nearby
      </Typography.Title>

      <Row>
        {times(8, () => ({
          name: faker.name.findName(),
          location: faker.address.cityName(),
          avatar: "https://joeschmoe.io/api/v1/random",
        })).map((data, index) => (
          <Col span={6}>
            <CareProvider {...data} key={index} />
          </Col>
        ))}
      </Row>
    </StyledContainer>
  );
};

export default Explore;
