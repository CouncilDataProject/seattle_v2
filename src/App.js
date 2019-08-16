import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Event from "./pages/Event";
import People from "./pages/People"

const App = () => (
  <Router>
    <Header />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/events/:id" component={Event} />
      <Route exact path="/people" component={People} />
    </Switch>
    <Footer />
  </Router>
);

export default App;
