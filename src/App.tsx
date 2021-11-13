import React from "react";
import "./App.less";
import Landing from "./views/Landing";
import Search from "./views/Search";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Footer from "./components/Footer";
import Services from "./views/Services";

enum Routes {
  Landing = "/",
  Search = "/search",
  Services = "/services",
}

function App() {
  return (
    <div className="App">
      <Router>
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
