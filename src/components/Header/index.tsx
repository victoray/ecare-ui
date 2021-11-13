import React, { FC } from "react";
import styled from "styled-components/macro";
import {
  Avatar,
  Button,
  DatePicker,
  Divider,
  Dropdown,
  Input,
  Menu,
  Select,
  Space,
  Typography,
} from "antd";
import { MenuOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { healthCareProviders } from "../../constants";

const { RangePicker } = DatePicker;

const StyledContainer = styled.div<{ position?: string }>`
  padding: 10px 60px;
  position: ${(props) => props.position || "fixed"};
  top: 0;
  width: 100vw;
  display: flex;
  align-items: center;
`;

const StyledInputGroup = styled.div`
  border-radius: 50px;
  margin: auto;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 5px;
`;

const StyledInput = styled(Input).attrs({
  bordered: false,
})`
  width: 300px;
`;

const StyledButton = styled(Button)`
  border-radius: 50px;
`;

const menu = (
  <Menu>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        Sign up
      </a>
    </Menu.Item>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        Login
      </a>
    </Menu.Item>
    <Divider />
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        Help
      </a>
    </Menu.Item>
  </Menu>
);

const StyledText = styled(Typography.Title)`
  && {
    color: whitesmoke;
  }
`;

type HeaderProps = {
  position?: "relative" | "absolute" | "fixed";
};

const Header: FC<HeaderProps> = ({ position }) => {
  return (
    <StyledContainer position={position}>
      <StyledText>eCare</StyledText>

      <StyledInputGroup>
        <StyledInput placeholder={"Where do you want this service?"} />
        <Divider type="vertical" />
        <StyledInput
          as={Select}
          options={healthCareProviders}
          placeholder={"Health care provider"}
        />
        <Divider type="vertical" />
        <StyledInput as={RangePicker} />

        <StyledButton icon={<SearchOutlined />} type={"primary"}>
          Search
        </StyledButton>
      </StyledInputGroup>

      <Space>
        <Button type={"link"}>Become a care provider</Button>

        <Dropdown overlay={menu} overlayStyle={{ width: 250 }}>
          <StyledButton icon={<MenuOutlined />} size={"large"}>
            <Avatar
              size={24}
              src={"https://joeschmoe.io/api/v1/random"}
              icon={<UserOutlined />}
            />
          </StyledButton>
        </Dropdown>
      </Space>
    </StyledContainer>
  );
};

export default Header;
