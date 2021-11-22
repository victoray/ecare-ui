import React, { FC, ReactNode, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
  Typography,
  Upload,
} from "antd";
import Header from "../../components/Header";
import styled from "styled-components/macro";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser, User } from "../../store/auth";
import { useMutation, useQuery } from "react-query";
import { useApi } from "../../api";
import moment from "moment";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import axios from "axios";

type Role = {
  created_at: string;
  name: string;
  type: string;
  updated_at: string;
  url: string;
};

const StyledContent = styled.div`
  margin: 0 auto;
  max-width: 50vw;
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`;

type ImageFieldProps = {
  onChange(value: Array<string>): void;
  editable?: boolean;
  imageRender?: ReactNode;
  multiple?: boolean;
  initialImages?: Array<string>;
};
export const ImageField: FC<ImageFieldProps> = ({
                                                  onChange,
                                                  editable = true,
                                                  imageRender,
                                                  multiple,
                                                  initialImages = [],
                                                }) => {
  const [uploadedFiles, setUploadedFiles] =
      useState<Array<string>>(initialImages);

  const uploadFileToCloudinary = (file: RcFile) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", "366417255826682");
    formData.append("upload_preset", "a9arz1lk");

    return axios
        .post("https://api.cloudinary.com/v1_1/odinson/image/upload", formData)
        .then((response) => {
          setUploadedFiles((state) => {
            const image = response.data.url;

            const images = [...state, image];

            onChange(multiple ? images : [image])

            return images
          });
        });
  };

  return (
      <Space>
        {imageRender}
        {editable && (
            <Upload
                customRequest={({onSuccess, onError, file, onProgress}) => {
                  uploadFileToCloudinary(file as RcFile)
                      .then(() => onSuccess?.("Ok"))
                      .catch(onError);
                }}
                accept={"image/*"}
                showUploadList={false}
                multiple={multiple}
            >
              <Button icon={<UploadOutlined/>}>Click to upload</Button>
            </Upload>
        )}
      </Space>
  );
};

const Account = () => {
  const dispatch = useDispatch();
  const api = useApi();
  const user = useSelector(selectUser);
  const [form] = Form.useForm();

  const [profileImage, setProfileImage] = useState<string | null>();
  const [governmentId, setGovernmentId] = useState<string | null>();

  useEffect(() => {
    if (user) {
      const initialValues: Record<any, any> = {
        ...user,
      };
      if (initialValues.dateOfBirth) {
        initialValues.dateOfBirth = moment(initialValues.dateOfBirth);
      }
      setProfileImage(user?.profileImage);
      setGovernmentId(user?.governmentId);
      form.setFieldsValue(initialValues);
    }
  }, [form, user]);

  const {data: roles} = useQuery("roles", () =>
      api.publicClient.get<string, Array<Role>>("/roles/")
  );

  const {mutateAsync: updateUser} = useMutation(
      (data: Partial<User>) => {
        const formattedData = {...data};
        if (formattedData.dateOfBirth) {
          formattedData.dateOfBirth = moment(formattedData.dateOfBirth).format(
              "YYYY-MM-DD"
          );
        }
        return api.client.put<any, User>(`/users/${user?.uuid}/`, {
          ...formattedData,
        });
      },
      {
        onSuccess: (user) => {
          dispatch(setUser(user));
        },
      }
  );

  return (
      <div>
        <Header position={"relative"} showSearch={false} textColor={"#40a9ff"}/>

        <StyledContent>
          <Typography.Title>Account Info</Typography.Title>
          <Typography.Text type={"secondary"}>
            This information will be used to verify your account
          </Typography.Text>
          <Divider/>

          <Form form={form} layout={"vertical"} onFinish={updateUser}>
            <Form.Item
                name={"profileImage"}
                label={<strong>Profile Image</strong>}
            >
              <ImageField
                  onChange={(value) => {
                    form.setFieldsValue({profileImage: value});
                    setProfileImage(value[0]);
                  }}
                  imageRender={
                    profileImage && (
                        <Avatar
                            size={96}
                            icon={<UserOutlined/>}
                            src={profileImage}
                        />
                    )
                  }
              />
            </Form.Item>
            <Form.Item name={"legalName"} label={<strong>Name</strong>}>
              <Input/>
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
              <Input disabled={true}/>
            </Form.Item>

            <Form.Item
                name={"governmentId"}
                label={<strong>Government ID</strong>}
            >
              <ImageField
                  onChange={(value) => {
                    setGovernmentId(value[0]);
                    form.setFieldsValue({governmentId: value});
                  }}
                  imageRender={
                    governmentId && <Image width={300} src={governmentId}/>
                  }
              />
            </Form.Item>

            <Form.Item
                name={"emergencyContact"}
                label={<strong>Emergency contact</strong>}
            >
              <Input type={"email"}/>
            </Form.Item>

            <Form.Item name={"address"} label={<strong>Address</strong>}>
              <Input/>
            </Form.Item>

            <Form.Item name={"role"} label={<strong>Account type</strong>}>
              <Select
                  disabled={Boolean(user?.role)}
                  options={roles?.map((role) => ({
                    value: role.url,
                    label: role.name,
                  }))}
              />
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
