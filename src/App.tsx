import React, { FC } from "react";
import "./App.less";
import "./firebaseConfig";
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
  setToken,
} from "./store/auth";
import { Button, Form, Input, message, Modal, Typography } from "antd";
import { useMutation } from "react-query";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

enum Routes {
  Landing = "/",
  Search = "/search",
  Services = "/services",
}

const SignUpModal: FC<{ visible: boolean }> = ({ visible }) => {
  const dispatch = useDispatch();
  const { mutate: signUp, isLoading } = useMutation(
    ([email, password]: [string, string]) => {
      const auth = getAuth();

      return createUserWithEmailAndPassword(auth, email, password);
    },
    {
      onSuccess: () => {
        dispatch(hideSignUpModal());
      },
      onError: (error: any) => {
        message.error(error?.message || "Sign up failed");
      },
    }
  );
  return (
    <Modal
      visible={visible}
      onCancel={() => dispatch(hideSignUpModal())}
      centered
      footer={null}
    >
      <Typography.Title level={3}> Sign Up</Typography.Title>
      <Form onFinish={(values) => signUp([values.email, values.password])}>
        <Form.Item name={"email"}>
          <Input type={"email"} placeholder={"Email Address"} required />
        </Form.Item>
        <Form.Item name={"password"}>
          <Input.Password placeholder={"Password"} required />
        </Form.Item>

        <Button type={"primary"} block htmlType={"submit"} loading={isLoading}>
          Sign Up
        </Button>
      </Form>
    </Modal>
  );
};

const LoginModal: FC<{ visible: boolean }> = ({ visible }) => {
  const dispatch = useDispatch();

  const { mutate: signIn, isLoading } = useMutation(
    ([email, password]: [string, string]) => {
      const auth = getAuth();

      return signInWithEmailAndPassword(auth, email, password);
    },
    {
      onSuccess: () => {
        dispatch(hideLoginModal());
      },
      onError: (error: any) => {
        message.error(error?.message || "Login failed");
      },
    }
  );

  return (
    <Modal
      visible={visible}
      onCancel={() => dispatch(hideLoginModal())}
      centered
      footer={null}
    >
      <Typography.Title level={3}>Login</Typography.Title>

      <Form onFinish={(values) => signIn([values.email, values.password])}>
        <Form.Item name={"email"}>
          <Input type={"email"} placeholder={"Email Address"} required />
        </Form.Item>
        <Form.Item name={"password"}>
          <Input.Password placeholder={"Password"} required />
        </Form.Item>

        <Button type={"primary"} block htmlType={"submit"} loading={isLoading}>
          Login
        </Button>
      </Form>
    </Modal>
  );
};

function App() {
  const dispatch = useDispatch();
  const showSignUpModal = useSelector(selectShowSignUp);
  const showLoginModal = useSelector(selectShowLogin);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      user.getIdToken().then((token) => {
        dispatch(setToken(token));
      });
      // ...
    } else {
      dispatch(setToken(""));
    }
  });

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
