import React, { FC, useEffect } from "react";
import "./App.less";
import "./firebaseConfig";
import Landing from "./views/Landing";
import Services from "./views/Services";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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
import { Api, getMapboxPlaces } from "./api";
import Account from "./views/Account";
import { useHistory } from "react-router";
import Calendar from "./views/Calendar";
import ServiceDetail from "./views/ServiceDetail";
import Inbox from "./views/Inbox";
import { head } from "lodash";
import { MapBoxFeature, setCareProvider, setFeature } from "./store/search";
import Footer from "./components/Footer";

enum Routes {
  Landing = "/",
  Search = "/search",
  Services = "/services",
  Service = "/service/:serviceId",
  Account = "/account",
  Calendar = "/calendar",
  Inbox = "/inbox",
}

const useInitializeSearch = () => {
  const dispatch = useDispatch();
  const { mutate: searchMapboxPlaces } = useMutation(getMapboxPlaces, {
    onSuccess(response) {
      const feature: MapBoxFeature | undefined = head(response.data.features);
      if (feature) {
        dispatch(setFeature(feature));
      }
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const place = params.get("feature");
    const provider = params.get("provider");
    if (place) {
      searchMapboxPlaces(place);
    }
    if (provider) {
      dispatch(setCareProvider(provider));
    }
  }, [dispatch, searchMapboxPlaces]);
};

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
  useInitializeSearch();
  const dispatch = useDispatch();
  const showSignUpModal = useSelector(selectShowSignUp);
  const showLoginModal = useSelector(selectShowLogin);

  useEffect(() => {
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
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <SignUpModal visible={showSignUpModal} />
        <LoginModal visible={showLoginModal} />
        <Switch>
          <Route path={Routes.Account} component={Account} />
          <Route path={Routes.Calendar} component={Calendar} />
          <Route path={Routes.Search} component={Search} />
          <Route path={Routes.Service} component={ServiceDetail} />
          <Route path={Routes.Services} component={Services} />
          <Route path={Routes.Inbox} component={Inbox} />
          <Route path={Routes.Landing} component={Landing} />
        </Switch>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
