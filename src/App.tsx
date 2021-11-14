import React, { FC } from "react";
import "./App.less";
import "./firebaseConfig";
import Landing from "./views/Landing";
import Services from "./views/Services";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Footer from "./components/Footer";
import Search from "./views/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  hideLoginModal,
  hideSignUpModal,
  selectShowLogin,
  selectShowSignUp,
  setToken,
  setUser,
  User,
} from "./store/auth";
import { Button, Form, Input, message, Modal, Typography } from "antd";
import { useMutation } from "react-query";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Api } from "./api";
import Account from "./views/Account";
import { useHistory } from "react-router";
import Calendar from "./views/Calendar";

enum Routes {
  Landing = "/",
  Search = "/search",
  Services = "/services",
  Account = "/account",
  Calendar = "/calendar",
}

const SignUpModal: FC<{ visible: boolean }> = ({ visible }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { mutate: signUp, isLoading } = useMutation(
    ([email, password]: [string, string]) => {
      const auth = getAuth();

      return createUserWithEmailAndPassword(auth, email, password);
    },
    {
      onSuccess: ({ user }) => {
        dispatch(hideSignUpModal());

        user.getIdToken().then((token) => {
          dispatch(setToken(token));

          const api = new Api(token);

          api.client.get<string, User>(`/users/${user.uid}/`).then((user) => {
            dispatch(setUser(user));

            if (!user.role) {
              history.push(Routes.Account);
            }
          });
        });
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
      destroyOnClose
    >
      <Typography.Title level={3}> Sign Up</Typography.Title>
      <Form
        initialValues={{
          email: "odinodin161@gmail.com",
          password: "Nnaemeka@07",
        }}
        onFinish={(values) => signUp([values.email, values.password])}
      >
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
  const history = useHistory();

  const { mutate: signIn, isLoading } = useMutation(
    ([email, password]: [string, string]) => {
      const auth = getAuth();

      return signInWithEmailAndPassword(auth, email, password);
    },
    {
      onSuccess: ({ user }) => {
        user.getIdToken().then((token) => {
          dispatch(setToken(token));

          const api = new Api(token);

          api.client
            .get<string, User>(`/users/${user.uid}/`)
            .then((user) => {
              dispatch(setUser(user));
              if (!user.role) {
                history.push(Routes.Account);
              }
            })
            .then(() => dispatch(hideLoginModal()));
        });
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
      destroyOnClose
    >
      <Typography.Title level={3}>Login</Typography.Title>

      <Form
        initialValues={{
          email: "odinodin161@gmail.com",
          password: "Nnaemeka@07",
        }}
        onFinish={(values) => signIn([values.email, values.password])}
      >
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

        const api = new Api(token);

        api.client.get<string, User>(`/users/${user.uid}/`).then((user) => {
          dispatch(setUser(user));
          if (!user.role && !window.location.href.includes(Routes.Account)) {
            window.location.assign(Routes.Account);
          }
        });
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
          <Route path={Routes.Account} component={Account} />
          <Route path={Routes.Calendar} component={Calendar} />
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
