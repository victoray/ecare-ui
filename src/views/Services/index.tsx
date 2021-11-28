import React, { FC, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Drawer,
  Form,
  Image,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import styled from "styled-components/macro";
import Header from "../../components/Header";
import { useMutation, useQuery } from "react-query";
import { useApi } from "../../api";
import Service, { Address, ServiceType } from "components/Service";
import { useSelector } from "react-redux";
import { selectIsProvider, selectUser } from "../../store/auth";
import { useHistory } from "react-router";
import { ImageField } from "../Account";
import { healthCareProviders } from "../../constants";
import MapboxSearch from "../../components/Header/MapBoxSearch";

const StyledContainer = styled.div`
  padding: 10px 10vw;
`;

const StyledCard = styled(Card)`
  width: 100%;
`;

const AddressField: FC<{
  serviceId?: string;
  value?: Array<Address>;
  onChange(value: Partial<Address>): void;
}> = ({ value, onChange, serviceId }) => {
  return (
    <MapboxSearch
      value={value?.[0]?.rawAddress}
      onSelect={(feature) =>
        onChange({
          rawAddress: feature.place_name || "",
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1],
          service: serviceId,
        })
      }
      bordered
    />
  );
};

const Services = () => {
  const api = useApi();
  const user = useSelector(selectUser);
  const isProvider = useSelector(selectIsProvider);
  const history = useHistory();

  const [images, setImages] = useState<Array<string>>([
    "https://res.cloudinary.com/odinson/image/upload/v1637538553/w6gvclvf84avgpm3hbay.jpg",
    "https://res.cloudinary.com/odinson/image/upload/v1637538553/wtbaegxcjmmpnqelu7yn.jpg",
    "https://res.cloudinary.com/odinson/image/upload/v1637538553/doc3fpfe4duz185bbeqg.jpg",
    "https://res.cloudinary.com/odinson/image/upload/v1637538553/owlgkytiyy2ebf7umlds.jpg",
    "https://res.cloudinary.com/odinson/image/upload/v1637538554/xzcdozhw7sf7c0lagg37.jpg",
  ]);
  const [form] = Form.useForm();

  const { data: services } = useQuery(["services", api], () =>
    api.client.get<any, Array<ServiceType>>("/services/", {
      params: { user: user?.uuid },
    })
  );

  const { mutate: createService } = useMutation((data: any) => {
    return api.client.post<any, ServiceType>("/services/", {
      ...data,
    });
  });

  const dummy = {
    name: "Care home",
    shortDescription: "The best home for you",
    fullDescription: "We take care of anyone any where any time.",
    images: [
      "http://res.cloudinary.com/odinson/image/upload/v1637538553/w6gvclvf84avgpm3hbay.jpg",
      "http://res.cloudinary.com/odinson/image/upload/v1637538553/wtbaegxcjmmpnqelu7yn.jpg",
      "http://res.cloudinary.com/odinson/image/upload/v1637538553/doc3fpfe4duz185bbeqg.jpg",
      "http://res.cloudinary.com/odinson/image/upload/v1637538553/owlgkytiyy2ebf7umlds.jpg",
      "http://res.cloudinary.com/odinson/image/upload/v1637538554/xzcdozhw7sf7c0lagg37.jpg",
    ],
    addresses: [
      {
        rawAddress: "Lagos, Nigeria",
        longitude: 3.4,
        latitude: 6.45,
      },
    ],
    providerType: "hospital",
    pricePerHour: 15000,
    user: user?.uuid,
  };

  return (
    <div>
      <Header position={"relative"} />

      <StyledContainer>
        <Typography.Title>Services</Typography.Title>

        {isProvider && (
          <Row justify={"end"}>
            <Button
              type={"primary"}
              onClick={() => history.push("/service/new")}
            >
              Create Service
            </Button>

            <Divider />
          </Row>
        )}

        <Row justify={"space-around"} gutter={1}>
          {services?.map((service) => (
            <StyledCard key={service.url} hoverable>
              <Service service={service} showDivider={false} />
            </StyledCard>
          ))}
        </Row>

        <Drawer
          visible={false}
          width={500}
          title={
            <Typography.Title level={3}>Create new service</Typography.Title>
          }
        >
          <Form
            layout={"vertical"}
            form={form}
            onFinish={(values) => createService(values)}
            initialValues={dummy}
          >
            <Form.Item name={"name"} label={"Name"}>
              <Input required />
            </Form.Item>
            <Form.Item name={"shortDescription"} label={"Short Description"}>
              <Input required />
            </Form.Item>
            <Form.Item name={"fullDescription"} label={"Full Description"}>
              <Input.TextArea rows={5} required />
            </Form.Item>
            <Form.Item name={"images"} label={"Images"}>
              <ImageField
                initialImages={images}
                onChange={(value) => {
                  form.setFieldsValue({ images: value });
                  setImages(value);
                }}
                multiple
                imageRender={
                  <Space>
                    {images.slice(0, 4).map((image, index) => (
                      <Image width={50} src={image} key={index} />
                    ))}
                  </Space>
                }
              />
            </Form.Item>
            <Form.Item name={"addresses"} label={"Address"}>
              <AddressField
                value={form.getFieldValue("addresses")}
                onChange={(value) =>
                  form.setFieldsValue({ addresses: [value] })
                }
              />
            </Form.Item>
            <Form.Item name={"providerType"} label={"Provider Type"} required>
              <Select options={healthCareProviders} />
            </Form.Item>
            <Form.Item name={"pricePerHour"} label={"Price Per Hour"}>
              <InputNumber min={0} required />
            </Form.Item>

            <Button htmlType={"submit"} type={"primary"}>
              Submit
            </Button>
          </Form>
        </Drawer>
      </StyledContainer>
    </div>
  );
};

export default Services;
