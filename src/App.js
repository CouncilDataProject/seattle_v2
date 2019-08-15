import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./pages/Home";
import Event from "./pages/Event";

const App = () => (
  <Router>
    <Route exact path="/" component={Home} />
    <Route exact path="/events/:id" component={Event} />
  </Router>
);

export default App;
