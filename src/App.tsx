import React from "react";
import "./App.less";
import Landing from "./views/Landing";
import Search from "./views/Search";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

enum Routes {
  Landing = "/",
  Search = "/search",
}

function App() {
  return (
    <div className="App">
      <Router>
        <Header />

        <Switch>
          <Route path={Routes.Search} component={Search} />
          <Route path={Routes.Landing} component={Landing} />
        </Switch>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
