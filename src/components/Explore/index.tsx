import React, { FC } from "react";
import { Col, Row, Space, Typography } from "antd";
import styled from "styled-components/macro";
import faker from "faker";
import { batch, useDispatch } from "react-redux";
import { useMutation } from "react-query";
import { getMapboxPlaces } from "../../api";
import { MapBoxFeature, setCareProvider, setFeature } from "../../store/search";
import { head } from "lodash";
import { useHistory } from "react-router";

const StyledContainer = styled.div`
  padding: 50px 15vw;
`;
const StyledCol = styled(Col)`
  margin: 10px 0;
  cursor: pointer;
`;

const StyledImage = styled.img`
  height: 64px;
  width: 64px;
  border-radius: 2px;
  object-fit: cover;
`;

type CareProviderProps = {
  name: string;
  location: string;
  avatar: string;
  provider: string;
};

const CareProvider: FC<CareProviderProps> = ({
  name,
  location,
  avatar,
  provider,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { mutate: searchMapboxPlaces } = useMutation(getMapboxPlaces, {
    onSuccess(response) {
      const feature: MapBoxFeature | undefined = head(response.data.features);
      if (feature) {
        batch(() => {
          dispatch(setFeature(feature));
          dispatch(setCareProvider(provider));
        });

        history.push(
          `/search/?feature=${feature.place_name}&provider=${provider}`
        );
      }
    },
  });

  return (
    <Space align={"center"} onClick={() => searchMapboxPlaces(location)}>
      <StyledImage src={avatar} alt="" />

      <Space direction={"vertical"}>
        <Typography.Text strong>{name}</Typography.Text>
        <Typography.Text type={"secondary"}>{location}</Typography.Text>
      </Space>
    </Space>
  );
};

faker.seed(2);

const hospitalImage =
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3253&q=80";
const nurseImage =
  "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1586&q=80";
const doctorImage =
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3540&q=80";

const locations = [
  {
    location: "Abuja",
    provider: "doctor",
    name: "Doctors",
    avatar: doctorImage,
  },
  { location: "Enugu", provider: "nurse", name: "Nurses", avatar: nurseImage },
  {
    location: "Lagos",
    provider: "doctor",
    name: "Doctors",
    avatar: doctorImage,
  },
  {
    location: "Rivers",
    provider: "doctor",
    name: "Doctors",
    avatar: doctorImage,
  },
  { location: "Abuja", provider: "nurse", name: "Nurses", avatar: nurseImage },
  {
    location: "Lagos",
    provider: "hospital",
    name: "Hospitals",
    avatar: hospitalImage,
  },
  {
    location: "Enugu",
    provider: "hospital",
    name: "Hospitals",
    avatar: hospitalImage,
  },
  { location: "Rivers", provider: "nurse", name: "Nurses", avatar: nurseImage },
];

const Explore = () => {
  return (
    <StyledContainer>
      <Typography.Title level={3}>
        Explore care providers nearby
      </Typography.Title>

      <Row>
        {locations.map((data, index) => (
          <StyledCol span={6} key={index}>
            <CareProvider {...data} key={index} />
          </StyledCol>
        ))}
      </Row>
    </StyledContainer>
  );
};

export default Explore;
