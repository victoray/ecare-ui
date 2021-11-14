import React, { FC, Fragment } from "react";
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
import Search from "./Search";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsSignedIn,
  showLoginModal,
  showSignUpModal,
} from "../../store/auth";
import { useMutation } from "react-query";
import { getAuth, signOut } from "firebase/auth";
import { useHistory } from "react-router";

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

const StyledText = styled(Typography.Title)`
  && {
    color: whitesmoke;
  }
`;

type HeaderProps = {
  position?: "relative" | "absolute" | "fixed";
};

const Header: FC<HeaderProps> = ({ position }) => {
  const dispatch = useDispatch();
  const isSignedIn = useSelector(selectIsSignedIn);
  const history = useHistory();

  const { mutate: logout } = useMutation(() => {
    const auth = getAuth();
    return signOut(auth);
  });

  const menu = (
    <Menu>
      {isSignedIn ? (
        <Fragment>
          <Menu.Item onClick={() => history.push("/account")} key={"account"}>
            Account
          </Menu.Item>
          <Menu.Item onClick={() => logout()} key={"login"}>
            Logout
          </Menu.Item>
        </Fragment>
      ) : (
        <Fragment>
          <Menu.Item onClick={() => dispatch(showSignUpModal())} key={"signUp"}>
            Sign up
          </Menu.Item>
          <Menu.Item onClick={() => dispatch(showLoginModal())} key={"login"}>
            Login
          </Menu.Item>
        </Fragment>
      )}
    </Menu>
  );

  return (
    <StyledContainer position={position}>
      <StyledText>eCare</StyledText>

      <StyledInputGroup>
        <StyledInput as={Search} />
        <Divider type="vertical" />
        <StyledInput
          as={Select}
          options={healthCareProviders}
          placeholder={"Health care provider"}
        />
        <Divider type="vertical" />

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
