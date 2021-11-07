import React from "react";
import "./App.less";
import Landing from "./views/Landing";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

enum Routes {
  Landing = "/",
}

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path={Routes.Landing} component={Landing} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
