import React from "react";
import "./App.less";
import Landing from "./views/Landing";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <Landing />
    </div>
  );
}

export default App;
