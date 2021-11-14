import React, { FC } from "react";
import "./App.less";
import Landing from "./views/Landing";
import Search from "./views/Search";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Footer from "./components/Footer";
import Services from "./views/Services";
import { useDispatch, useSelector } from "react-redux";
import {
  hideLoginModal,
  hideSignUpModal,
  selectShowLogin,
  selectShowSignUp,
} from "./store/auth";
import { Button, Form, Input, Modal, Typography } from "antd";

enum Routes {
  Landing = "/",
  Search = "/search",
  Services = "/services",
}

const SignUpModal: FC<{ visible: boolean }> = ({ visible }) => {
  const dispatch = useDispatch();
  return (
    <Modal
      visible={visible}
      onCancel={() => dispatch(hideSignUpModal())}
      centered
      footer={null}
    >
      <Typography.Title level={3}> Sign Up</Typography.Title>
      <Form>
        <Form.Item name={"email"}>
          <Input type={"email"} placeholder={"Email Address"} />
        </Form.Item>
        <Form.Item name={"Password"}>
          <Input.Password placeholder={"Password"} />
        </Form.Item>

        <Button type={"primary"} block htmlType={"submit"}>
          Sign Up
        </Button>
      </Form>
    </Modal>
  );
};

const LoginModal: FC<{ visible: boolean }> = ({ visible }) => {
  const dispatch = useDispatch();

  return (
    <Modal
      visible={visible}
      onCancel={() => dispatch(hideLoginModal())}
      centered
      footer={null}
    >
      <Typography.Title level={3}>Login</Typography.Title>

      <Form.Item name={"email"}>
        <Input type={"email"} placeholder={"Email Address"} />
      </Form.Item>
      <Form.Item name={"Password"}>
        <Input.Password placeholder={"Password"} />
      </Form.Item>

      <Button type={"primary"} block htmlType={"submit"}>
        Login
      </Button>
    </Modal>
  );
};

function App() {
  const showSignUpModal = useSelector(selectShowSignUp);
  const showLoginModal = useSelector(selectShowLogin);

  return (
    <div className="App">
      <Router>
        <SignUpModal visible={showSignUpModal} />
        <LoginModal visible={showLoginModal} />
        <Switch>
          <Route path={Routes.Search} component={Search} />
          <Route path={Routes.Services} component={Services} />
          <Route path={Routes.Landing} component={Landing} />
        </Switch>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
