import React from "react";
import ReactGA from "react-ga";
import withTracker from "./utils/withTracker";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Event from "./pages/Event";
import AllEvents from "./pages/AllEvents";
import People from "./pages/People";
import Person from "./pages/Person";

// Run Google Analytics
ReactGA.initialize("UA-145893191-1");

const App = () => (
  <Router basename="/">
    <Header />
    <Switch>
      <Route exact path="/" component={withTracker(Home)} />
      <Route path="/search" component={withTracker(Search)} />
      <Route exact path="/events" component={withTracker(AllEvents)} />
      <Route path="/events/:id" component={withTracker(Event)} />
      <Route exact path="/people" component={withTracker(People)} />
      <Route exact path="/people/:id" component={withTracker(Person)} />
    </Switch>
    <Footer />
  </Router>
);

export default App;
