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
  Role,
  selectShowLogin,
  selectShowSignUp,
  selectUser,
  setToken,
  setUser,
  showLoginModal,
  User,
} from "./store/auth";
import { Button, Form, Input, message, Modal, Select, Typography } from "antd";
import { useMutation, useQuery } from "react-query";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Api, getMapboxPlaces, useApi } from "./api";
import Account from "./views/Account";
import { useHistory } from "react-router";
import Calendar from "./views/Calendar";
import ServiceDetail from "./views/ServiceDetail";
import Inbox from "./views/Inbox";
import { head } from "lodash";
import { MapBoxFeature, setCareProvider, setFeature } from "./store/search";
import Footer from "./components/Footer";
import moment from "moment";
import styled from "styled-components/macro";

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
  const api = useApi();
  const user = useSelector(selectUser);

  const { data: roles } = useQuery("roles", () =>
    api.publicClient.get<string, Array<Role>>("/roles/")
  );

  const { mutateAsync: updateUser } = useMutation(
    (data: Partial<User>) => {
      const formattedData = { ...data };
      if (formattedData.dateOfBirth) {
        formattedData.dateOfBirth = moment(formattedData.dateOfBirth).format(
          "YYYY-MM-DD"
        );
      }
      return api.client.put<any, User>(`/users/${data?.uuid}/`, {
        ...formattedData,
      });
    },
    {
      onSuccess: (user) => {
        dispatch(setUser(user));
      },
    }
  );

  const { mutate: signUp, isLoading } = useMutation(
    ([email, password, role]: [string, string, string]) => {
      const auth = getAuth();

      return createUserWithEmailAndPassword(auth, email, password);
    },
    {
      onSuccess: ({ user }, [_, __, role]) => {
        dispatch(hideSignUpModal());

        user.getIdToken().then((token) => {
          dispatch(setToken(token));

          const api = new Api(token);

          api.client.get<string, User>(`/users/${user.uid}/`).then((user) => {
            dispatch(setUser(user));
            updateUser({ ...user, role });
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
        onFinish={(values) =>
          signUp([values.email, values.password, values.role])
        }
      >
        <Form.Item name={"email"}>
          <Input type={"email"} placeholder={"Email Address"} required />
        </Form.Item>
        <Form.Item name={"password"}>
          <Input.Password placeholder={"Password"} required />
        </Form.Item>
        <Form.Item
          name={"role"}
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select
            disabled={Boolean(user?.role)}
            placeholder={"Select role"}
            options={roles?.map((role) => ({
              value: role.url,
              label: role.name,
            }))}
          />
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

const Container = styled.div`
  min-height: calc(100vh - 75px);
`;

const PrivateRoute = ({ path, component }: any) => {
  const dispatch = useDispatch();
  const auth = getAuth();

  if (!auth?.currentUser) {
    dispatch(showLoginModal());
  }
  return <Route path={path} component={component} />;
};

function App() {
  useInitializeSearch();
  const dispatch = useDispatch();
  const showSignUpModal = useSelector(selectShowSignUp);
  const showLoginModal = useSelector(selectShowLogin);
  const history = useHistory();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((token) => {
          dispatch(setToken(token));

          const api = new Api(token);

          api.client.get<string, User>(`/users/${user.uid}/`).then((user) => {
            dispatch(setUser(user));
            if (user.roleType === "provider") {
              history.push("services");
            }
          });
        });
        // ...
      } else {
        dispatch(setToken(""));
      }
    });
  }, [dispatch, history]);

  return (
    <div className="App">
      <Router>
        <SignUpModal visible={showSignUpModal} />
        <LoginModal visible={showLoginModal} />
        <Container>
          <Switch>
            <PrivateRoute path={Routes.Account} component={Account} />
            <PrivateRoute path={Routes.Calendar} component={Calendar} />
            <Route path={Routes.Search} component={Search} />
            <Route path={Routes.Service} component={ServiceDetail} />
            <Route path={Routes.Services} component={Services} />
            <PrivateRoute path={Routes.Inbox} component={Inbox} />
            <Route path={Routes.Landing} component={Landing} />
          </Switch>
        </Container>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
