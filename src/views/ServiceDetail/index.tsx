import React, { FC, Fragment } from "react";
import Header from "../../components/Header";
import { RouteComponentProps, useHistory } from "react-router";
import { useMutation, useQuery } from "react-query";
import { useApi } from "../../api";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Image,
  Row,
  Spin,
  Typography,
} from "antd";
import { ServiceType } from "../../components/Service";
import styled from "styled-components/macro";
import { UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/auth";
import moment from "moment";

const StyledContent = styled.div`
  margin: 0 auto;
  max-width: 65vw;
`;

interface MatchParams {
  serviceId: string;
}

const StyledRow = styled(Row)`
  border-radius: 50px;

  .ant-image {
    height: 100%;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

interface ServiceDetailProps extends RouteComponentProps<MatchParams> {}

const ServiceDetail: FC<ServiceDetailProps> = ({ match }) => {
  const serviceId = match.params.serviceId;
  const history = useHistory();
  const user = useSelector(selectUser);
  const api = useApi();

  const { data: service, isLoading } = useQuery(
    [`service-${serviceId}`, api],
    () => api.publicClient.get<any, ServiceType>(`/services/${serviceId}/`)
  );

  const { mutateAsync: bookAppointment } = useMutation(
    (data: Record<any, any>) => {
      return api.client.post("/appointments/", {
        careProvider: service?.user.url,
        patient: user?.url,
        appointmentDate: moment(data.appointmentDate).toISOString(),
        service: service?.url,
      });
    }
  );

  const isOwner = user && user.uuid === service?.user.uuid;

  return (
    <div>
      <Header showSearch={false} position={"relative"} />

      <StyledContent>
        {isLoading ? (
          <Row justify={"center"}>
            <Spin size={"large"} />
          </Row>
        ) : (
          <div>
            <Typography.Title level={3}>{service?.name}</Typography.Title>

            <Image.PreviewGroup>
              <StyledRow justify={"space-between"}>
                <Col span={12}>
                  <StyledImage src={service?.images[0]} />
                </Col>
                <Col span={12}>
                  <Row>
                    <Col span={12}>
                      <StyledImage src={service?.images[1]} />
                    </Col>
                    <Col span={12}>
                      <StyledImage src={service?.images[2]} />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <StyledImage src={service?.images[3]} />
                    </Col>
                    <Col span={12}>
                      <StyledImage src={service?.images[1]} />
                    </Col>
                  </Row>
                </Col>
              </StyledRow>
            </Image.PreviewGroup>

            <Divider />

            <Row justify={"space-between"}>
              <Col span={15}>
                <Row justify={"space-between"} align={"middle"}>
                  <Typography.Title level={4}>
                    {service?.shortDescription}
                  </Typography.Title>
                  <Avatar
                    size={96}
                    src={
                      service?.user.profileImage ||
                      "https://joeschmoe.io/api/v1/random"
                    }
                    icon={<UserOutlined />}
                  />
                </Row>
                <Typography.Title level={4}>
                  {service?.user.legalName}
                </Typography.Title>

                <Divider />

                <Typography.Paragraph>
                  {service?.fullDescription}
                </Typography.Paragraph>
              </Col>

              {user && (
                <Col span={8}>
                  <Card hoverable>
                    {isOwner ? (
                      <Button
                        type={"primary"}
                        block
                        size={"large"}
                        onClick={() => history.push("/calendar")}
                      >
                        View appointments
                      </Button>
                    ) : (
                      <Fragment>
                        <Typography.Title level={4}>
                          NGN {service?.pricePerHour} / hour
                        </Typography.Title>
                        <Form onFinish={bookAppointment}>
                          <Form.Item name={"appointmentDate"} required>
                            <StyledDatePicker defaultValue={moment()} />
                          </Form.Item>
                          <Divider />
                          <Button
                            htmlType={"submit"}
                            type={"primary"}
                            block
                            size={"large"}
                          >
                            Book Appointment
                          </Button>
                        </Form>
                      </Fragment>
                    )}
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        )}
      </StyledContent>
    </div>
  );
};

export default ServiceDetail;
