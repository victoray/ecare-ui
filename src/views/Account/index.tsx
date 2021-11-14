import React, { useEffect } from "react";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Typography,
} from "antd";
import Header from "../../components/Header";
import styled from "styled-components/macro";
import { useSelector } from "react-redux";
import { selectUser, User } from "../../store/auth";
import { useMutation } from "react-query";
import { useApi } from "../../api";
import moment from "moment";

const StyledContent = styled.div`
  margin: 0 auto;
  max-width: 50vw;
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`;

const Account = () => {
  const api = useApi();
  const user = useSelector(selectUser);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      const initialValues: Record<any, any> = {
        ...user,
      };
      if (initialValues.dateOfBirth) {
        initialValues.dateOfBirth = moment(initialValues.dateOfBirth);
      }
      form.setFieldsValue(initialValues);
    }
  }, [form, user]);

  const { mutateAsync: updateUser } = useMutation((data: Partial<User>) => {
    const formattedData = { ...data };
    if (formattedData.dateOfBirth) {
      formattedData.dateOfBirth = moment(formattedData.dateOfBirth).format(
        "YYYY-MM-DD"
      );
    }
    return api.client.put(`/users/${user?.uuid}/`, { ...formattedData });
  });

  return (
    <div>
      <Header position={"relative"} />

      <StyledContent>
        <Typography.Title>Account Info</Typography.Title>
        <Typography.Text type={"secondary"}>
          This information will be used to verify your account
        </Typography.Text>
        <Divider />

        <Form
          form={form}
          layout={"vertical"}
          initialValues={{ ...user }}
          onFinish={updateUser}
        >
          <Form.Item name={"legalName"} label={<strong>Name</strong>}>
            <Input />
          </Form.Item>

          <Form.Item
            name={"dateOfBirth"}
            label={<strong>Date of birth</strong>}
          >
            <StyledDatePicker
              disabled={Boolean(user?.dateOfBirth)}
              format={"YYYY-MM-DD"}
            />
          </Form.Item>

          <Form.Item name={"email"} label={<strong>Email address</strong>}>
            <Input disabled={true} />
          </Form.Item>

          <Form.Item
            name={"governmentId"}
            label={<strong>Government ID</strong>}
          >
            <Input disabled={Boolean(user?.dateOfBirth)} />
          </Form.Item>

          <Form.Item
            name={"emergencyContact"}
            label={<strong>Emergency contact</strong>}
          >
            <Input type={"email"} />
          </Form.Item>

          <Form.Item name={"address"} label={<strong>Address</strong>}>
            <Input />
          </Form.Item>

          <Row justify={"end"}>
            <Button type={"primary"} htmlType={"submit"}>
              Update Account
            </Button>
          </Row>
        </Form>
      </StyledContent>
    </div>
  );
};

export default Account;
