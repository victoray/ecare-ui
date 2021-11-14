import React, { FC, Fragment } from "react";
import styled from "styled-components/macro";
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Input,
  Menu,
  Select,
  Typography,
} from "antd";
import { MenuOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { healthCareProviders } from "../../constants";
import Search from "./Search";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsProvider,
  selectIsSignedIn,
  showLoginModal,
  showSignUpModal,
} from "../../store/auth";
import { useMutation } from "react-query";
import { getAuth, signOut } from "firebase/auth";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

const StyledContainer = styled.div<{ position?: string }>`
  padding: 10px 60px;
  position: ${(props) => props.position || "fixed"};
  top: 0;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const StyledText = styled(Typography.Title)<{ textColor?: string }>`
  && {
    color: ${(props) => props.textColor || "#40a9ff"};
  }
`;

type HeaderProps = {
  position?: "relative" | "absolute" | "fixed";
  showSearch?: boolean;
  textColor?: string;
};

const Header: FC<HeaderProps> = ({
  position,
  showSearch = true,
  textColor,
}) => {
  const dispatch = useDispatch();
  const isSignedIn = useSelector(selectIsSignedIn);
  const isProvider = useSelector(selectIsProvider);
  const history = useHistory();

  const { mutate: logout } = useMutation(() => {
    const auth = getAuth();
    return signOut(auth);
  });

  const menu = (
    <Menu>
      {isSignedIn ? (
        <Fragment>
          {isProvider && (
            <Fragment>
              <Menu.Item
                onClick={() => history.push("/services")}
                key={"service"}
              >
                My services
              </Menu.Item>
              <Menu.Item
                onClick={() => history.push("/calendar")}
                key={"calendar"}
              >
                Calendar
              </Menu.Item>
            </Fragment>
          )}

          <Menu.Item onClick={() => history.push("/account")} key={"account"}>
            Inbox
          </Menu.Item>
          <Divider />
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
      <Link to={"/"}>
        <StyledText textColor={textColor}>eCare</StyledText>
      </Link>

      {showSearch && (
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
      )}

      <Dropdown overlay={menu} overlayStyle={{ width: 250 }}>
        <StyledButton icon={<MenuOutlined />} size={"large"}>
          <Avatar
            size={24}
            src={"https://joeschmoe.io/api/v1/random"}
            icon={<UserOutlined />}
          />
        </StyledButton>
      </Dropdown>
    </StyledContainer>
  );
};

export default Header;
